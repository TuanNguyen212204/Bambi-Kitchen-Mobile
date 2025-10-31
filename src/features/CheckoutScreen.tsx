import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { saveOrderThunk } from '@/store/thunks/orderThunks';
import { clearCart } from '@/store/slices/cartSlice';
import { OrderItem, Order } from '@/types/api';

const DISH_PRICES: Record<number, { price: number; calories: number }> = {
  101: { price: 85000, calories: 680 },
  102: { price: 65000, calories: 550 },
};

export default function CheckoutScreen() {
  const naviagtion = useNavigation<any>();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'VNPAY'>('COD');

  const totalPrice = cartItems.reduce((sum, item) => {
    const info = DISH_PRICES[item.dishId] || { price: 0 };
    return sum + info.price * item.quantity;
  }, 0);

  const totalCalories = cartItems.reduce((sum, item) => {
    const info = DISH_PRICES[item.dishId] || { calories: 0 };
    return sum + info.calories * item.quantity;
  }, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Giỏ hàng trống', 'Vui lòng thêm món vào giỏ hàng trước khi thanh toán.');
      return;
    }
    if (paymentMethod === 'COD') {
      const order: Omit<Order, 'id'> = {
        items: cartItems,
        totalPrice,
        totalCalories,
        paymentMethod,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
      };
      try {
        await dispatch(saveOrderThunk(order)).unwrap();
        dispatch(clearCart());
        naviagtion.replace('PaymentResult', { success: true, message: 'Đặt hàng thành công!' });
      } catch {
        Alert.alert('Lỗi', 'Đặt hàng thất bại. Vui lòng thử lại.');
      }
    } else {
      naviagtion.navigate('VNPAYMock', {
        amount: totalPrice,
        orderInfo: cartItems.map((item) => `${item.dishName} x${item.quantity}`).join(', '),
        cartItems,
        totalCalories,
      });
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
      {(['COD', 'VNPAY'] as const).map((method) => (
        <TouchableOpacity
          key={method}
          onPress={() => setPaymentMethod(method)}
          style={[styles.paymentOption, paymentMethod === method && styles.paymentSelected]}
        >
          <Text
            style={[styles.paymentText, paymentMethod === method && styles.paymentTextSelected]}
          >
            {method === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Thanh toán Online (VNPay)'}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity onPress={handleCheckout} style={styles.checkoutButton}>
        <Text style={styles.checkoutButtonText}>
          {paymentMethod === 'COD' ? 'Đặt hàng' : 'Tiếp tục thanh toán'}
        </Text>
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
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
