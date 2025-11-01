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

export default function OrderHistoryScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector((state) => state.order);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchOrdersThunk(user.id));
    }
  }, [dispatch, user?.id]);

  // Note: API v3 không trả về items chi tiết trong Orders
  // Có thể cần gọi API getOrderById để lấy chi tiết
  // const handleReorder = (order: any) => {
  //   // Cần fetch order details trước
  //   navigation.navigate('Cart');
  // };

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
              <Text style={styles.orderId}>Đơn #{order.id}</Text>
              <Text style={styles.orderDate}>
                {new Date(order.createAt).toLocaleString('vi-VN')}
              </Text>
            </View>

            {order.note && (
              <Text style={styles.note}>Ghi chú: {order.note}</Text>
            )}

            <View style={styles.footer}>
              <Text style={styles.totalPrice}>{order.totalPrice.toLocaleString('vi-VN')}đ</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {order.status === 'PENDING'
                    ? 'Đang chờ'
                    : order.status === 'COMPLETED'
                      ? 'Hoàn thành'
                      : order.status === 'PAID'
                        ? 'Đã thanh toán'
                        : order.status === 'CANCELLED'
                          ? 'Đã hủy'
                          : order.status}
                </Text>
              </View>
            </View>

            {order.ranking && order.comment && (
              <View style={styles.feedback}>
                <Text style={styles.feedbackTitle}>Đánh giá: ⭐{order.ranking}/5</Text>
                <Text style={styles.feedbackComment}>{order.comment}</Text>
              </View>
            )}
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
  note: { fontSize: 12, color: '#666', fontStyle: 'italic', marginTop: 8 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalPrice: { fontWeight: 'bold', fontSize: 16 },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#e3f2fd',
  },
  statusText: { color: '#1976d2', fontSize: 12, fontWeight: '500' },
  feedback: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  feedbackTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  feedbackComment: { fontSize: 13, color: '#666', fontStyle: 'italic' },
});