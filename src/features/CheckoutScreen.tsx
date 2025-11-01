import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { clearCart } from '@/store/slices/cartSlice';
import { OrderItem, OrderItemDTO, MakeOrderRequest } from '@/types/api';
import orderService from '@/services/api/orderService';

const DISH_PRICES: Record<number, { price: number; calories: number }> = {
  101: { price: 85000, calories: 680 },
  102: { price: 65000, calories: 550 },
};

export default function CheckoutScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const user = useAppSelector((state) => state.auth.user);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'VNPAY' | 'MOMO'>('COD');
  const [loading, setLoading] = useState(false);

  const totalPrice = cartItems.reduce((sum, item) => {
    const info = DISH_PRICES[item.dishId] || { price: 0 };
    return sum + info.price * item.quantity;
  }, 0);

  const totalCalories = cartItems.reduce((sum, item) => {
    const info = DISH_PRICES[item.dishId] || { calories: 0 };
    return sum + info.calories * item.quantity;
  }, 0);

  // Convert OrderItem to OrderItemDTO
  const convertToOrderItemDTO = (item: OrderItem): OrderItemDTO => {
    return {
      dishId: item.dishId,
      name: item.dishName,
      quantity: item.quantity,
      note: item.note,
      // basedOnId, dishTemplate, recipe có thể thêm sau khi có thông tin từ API
    };
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Giỏ hàng trống', 'Vui lòng thêm món vào giỏ hàng trước khi thanh toán.');
      return;
    }

    if (!user?.id) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để đặt hàng.');
      return;
    }

    setLoading(true);
    try {
      const orderItems: OrderItemDTO[] = cartItems.map(convertToOrderItemDTO);
      
      const orderRequest: MakeOrderRequest = {
        accountId: user.id,
        paymentMethod: paymentMethod === 'COD' ? 'COD' : paymentMethod === 'VNPAY' ? 'VNPAY' : 'MOMO',
        totalPrice,
        items: orderItems,
      };

      const result = await orderService.createOrder(orderRequest);

      if (paymentMethod === 'COD') {
        // COD - thanh toán khi nhận hàng
        dispatch(clearCart());
        navigation.replace('PaymentResult', { 
          success: true, 
          message: 'Đặt hàng thành công! Vui lòng thanh toán khi nhận hàng.' 
        });
      } else {
        // Online payment - redirect to payment gateway
        // result có thể là URL payment hoặc order ID
        if (result && typeof result === 'string') {
          // Nếu có URL, mở browser để thanh toán
          // Hoặc navigate đến payment screen
          navigation.navigate('VNPayMock', {
            amount: totalPrice,
            orderInfo: cartItems.map((item) => `${item.dishName} x${item.quantity}`).join(', '),
            paymentUrl: result,
            paymentMethod,
            cartItems,
            totalCalories,
          });
        } else {
          // Fallback - giả sử đã thanh toán thành công
          dispatch(clearCart());
          navigation.replace('PaymentResult', { 
            success: true, 
            message: 'Đặt hàng thành công!' 
          });
        }
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      Alert.alert('Lỗi', error?.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Xác nhận đơn hàng</Text>

      {cartItems.map((item) => {
        const { price = 0, calories = 0 } = DISH_PRICES[item.dishId] || {};
        return (
          <View key={item.id} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>
                {item.dishName} x{item.quantity}
              </Text>
              {item.note && <Text style={styles.note}>Ghi chú: {item.note}</Text>}
              <Text style={styles.calories}>{calories * item.quantity} calo</Text>
            </View>
            <Text style={styles.price}>{(price * item.quantity).toLocaleString('vi-VN')}đ</Text>
          </View>
        );
      })}

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tổng tiền</Text>
          <Text style={styles.totalPrice}>{totalPrice.toLocaleString('vi-VN')}đ</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tổng calo</Text>
          <Text style={styles.summaryText}>{totalCalories} calo</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
      {(['COD', 'VNPAY', 'MOMO'] as const).map((method) => (
        <TouchableOpacity
          key={method}
          onPress={() => setPaymentMethod(method)}
          style={[styles.paymentOption, paymentMethod === method && styles.paymentSelected]}
          disabled={loading}
        >
          <Text
            style={[styles.paymentText, paymentMethod === method && styles.paymentTextSelected]}
          >
            {method === 'COD' 
              ? 'Thanh toán khi nhận hàng (COD)' 
              : method === 'VNPAY'
              ? 'Thanh toán Online (VNPay)'
              : 'Thanh toán Online (Momo)'}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity 
        onPress={handleCheckout} 
        style={[styles.checkoutButton, loading && styles.checkoutButtonDisabled]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.checkoutButtonText}>
            {paymentMethod === 'COD' ? 'Đặt hàng' : 'Tiếp tục thanh toán'}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '500' },
  note: { fontSize: 12, color: '#666', fontStyle: 'italic', marginTop: 2 },
  calories: { fontSize: 12, color: '#999', marginTop: 2 },
  price: { fontSize: 16, fontWeight: '500' },
  summary: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontWeight: 'bold' },
  totalPrice: { fontSize: 18, fontWeight: 'bold' },
  summaryText: { color: '#666' },
  sectionTitle: { marginTop: 24, marginBottom: 8, fontWeight: '600', fontSize: 16 },
  paymentOption: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  paymentSelected: {
    borderColor: '#007bff',
    backgroundColor: '#f0f8ff',
  },
  paymentText: { fontSize: 15 },
  paymentTextSelected: { color: '#007bff', fontWeight: '500' },
  checkoutButton: {
    marginTop: 24,
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    backgroundColor: '#6c757d',
    opacity: 0.6,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
