import React, { useState, useEffect, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { clearCart } from '@/store/slices/cartSlice';
import { OrderItem, OrderItemDTO, MakeOrderRequest } from '@/types/api';
import orderService from '@/services/api/orderService';
import { dishService, DishDto } from '@services/api/dishService';

export default function CheckoutScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const user = useAppSelector((state) => state.auth.user);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'VNPAY' | 'MOMO'>('COD');
  const [loading, setLoading] = useState(false);
  const [dishes, setDishes] = useState<Record<number, DishDto>>({});
  const [fetchingDishes, setFetchingDishes] = useState(false);

  useEffect(() => {
    const fetchDishes = async () => {
      if (cartItems.length === 0) return;
      
      setFetchingDishes(true);
      try {
        const dishIds = [...new Set(cartItems.map(item => item.dishId))];
        const dishPromises = dishIds.map(id => dishService.getById(id));
        const dishResults = await Promise.all(dishPromises);
        
        const dishesMap: Record<number, DishDto> = {};
        dishResults.forEach((dish, index) => {
          if (dish) {
            dishesMap[dishIds[index]] = dish;
          }
        });
        setDishes(dishesMap);
      } catch (error) {
        console.error('Error fetching dishes:', error);
      } finally {
        setFetchingDishes(false);
      }
    };

    fetchDishes();
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const dish = dishes[item.dishId];
      const price = dish?.price || 0;
      return sum + price * item.quantity;
    }, 0);
  }, [cartItems, dishes]);

  // Convert OrderItem to OrderItemDTO
  const convertToOrderItemDTO = (item: OrderItem): OrderItemDTO => {
    const dto: OrderItemDTO = {
      dishId: item.dishId,
      name: item.dishName,
      quantity: item.quantity,
    };
    
    // Chỉ thêm các field optional nếu có giá trị
    if (item.note) {
      dto.note = item.note;
    }
    
    // Không gửi dishTemplate vì backend đang xử lý null không đúng
    // Nếu cần dishTemplate, phải có logic chọn size từ user trước
    // dishTemplate: undefined - không gửi field này
    
    return dto;
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
  if (fetchingDishes) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Đang tải thông tin món ăn...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Xác nhận đơn hàng</Text>

      {cartItems.map((item) => {
        const dish = dishes[item.dishId];
        const price = dish?.price || 0;
        
        return (
          <View key={item.id} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>
                {item.dishName} x{item.quantity}
              </Text>
              {item.note && <Text style={styles.note}>Ghi chú: {item.note}</Text>}
              {dish?.description && (
                <Text style={styles.description} numberOfLines={1}>
                  {dish.description}
                </Text>
              )}
            </View>
            <View style={styles.priceContainer}>
              {price > 0 ? (
                <Text style={styles.price}>{(price * item.quantity).toLocaleString('vi-VN')}đ</Text>
              ) : (
                <Text style={styles.priceUnavailable}>Chưa có giá</Text>
              )}
            </View>
          </View>
        );
      })}

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tổng tiền</Text>
          <Text style={styles.totalPrice}>{totalPrice.toLocaleString('vi-VN')}đ</Text>
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
  description: { fontSize: 11, color: '#999', marginTop: 2 },
  priceContainer: { alignItems: 'flex-end' },
  price: { fontSize: 16, fontWeight: '500' },
  priceUnavailable: { fontSize: 14, color: '#999', fontStyle: 'italic' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: { marginTop: 12, fontSize: 14, color: '#666' },
  summary: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontWeight: 'bold' },
  totalPrice: { fontSize: 18, fontWeight: 'bold' },
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
