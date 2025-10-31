import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchOrdersThunk } from '../../../store/thunks/orderThunks';
import { setCartItems } from '../../../store/slices/cartSlice';

export default function OrderHistoryScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrdersThunk());
  }, [dispatch]);

  const handleReorder = (order: any) => {
    dispatch(setCartItems(order.items));
    navigation.navigate('Cart');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Lịch sử đơn hàng</Text>

      {orders.length === 0 ? (
        <Text style={styles.empty}>Chưa có đơn hàng nào</Text>
      ) : (
        orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>Đơn #{order.id.slice(-6)}</Text>
              <Text style={styles.orderDate}>
                {new Date(order.createdAt).toLocaleString('vi-VN')}
              </Text>
            </View>

            <View style={styles.items}>
              {order.items.map((item: any) => (
                <View key={item.id} style={styles.item}>
                  <Text style={styles.itemName}>
                    {item.dishName} x{item.quantity}
                  </Text>
                  {item.note && <Text style={styles.itemNote}>→ {item.note}</Text>}
                </View>
              ))}
            </View>

            <View style={styles.footer}>
              <Text style={styles.totalPrice}>{order.totalPrice.toLocaleString('vi-VN')}đ</Text>
              <Text style={styles.calories}>{order.totalCalories} calo</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleReorder(order)} style={styles.reorderButton}>
                <Text style={styles.reorderText}>Đặt lại</Text>
              </TouchableOpacity>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {order.status === 'success'
                    ? 'Thành công'
                    : order.status === 'failed'
                      ? 'Thất bại'
                      : 'Đang xử lý'}
                </Text>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  empty: { textAlign: 'center', color: '#999', marginTop: 32, fontSize: 16 },
  error: { color: '#dc3545', fontSize: 16 },
  orderCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  orderId: { fontWeight: 'bold' },
  orderDate: { fontSize: 12, color: '#666' },
  items: { marginTop: 8 },
  item: { marginBottom: 4 },
  itemName: { fontSize: 14 },
  itemNote: { fontSize: 12, color: '#e67e22', marginLeft: 8 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalPrice: { fontWeight: 'bold' },
  calories: { color: '#666', fontSize: 13 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  reorderButton: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  reorderText: { color: '#fff', fontSize: 13, fontWeight: '500' },
  statusBadge: {
    flex: 1,
    backgroundColor: '#d4edda',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  statusText: { color: '#155724', fontSize: 13, fontWeight: '500' },
});