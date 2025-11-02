import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { orderService } from '@services/api/orderService';
import { Orders, OrderStatusV3 } from '@/types/api';
import { toast } from '@utils/toast';

const statusLabels: Record<OrderStatusV3, string> = {
  PENDING: 'Đang chờ',
  COMPLETED: 'Hoàn thành',
  PAID: 'Đã thanh toán',
  CANCELLED: 'Đã hủy',
};

const OrdersScreen = () => {
  const [orders, setOrders] = useState<Orders[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      // GET /api/order - lấy tất cả orders (API v3)
      const data = await orderService.getOrders();
      setOrders(data as Orders[]);
    } catch (e: any) {
      toast.error(e?.toString?.() || 'Lỗi tải danh sách đơn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(i) => String(i.id)}
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true);
          await load();
          setRefreshing(false);
        }}
        ListEmptyComponent={
          loading ? null : (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: '#666' }}>Chưa có đơn hàng nào</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>Đơn #{item.id}</Text>
            <Text style={styles.meta}>
              Ngày: {new Date(item.createAt).toLocaleString('vi-VN')}
            </Text>
            <Text style={styles.meta}>Tổng tiền: {item.totalPrice.toLocaleString('vi-VN')}đ</Text>
            <Text style={styles.meta}>Trạng thái: {statusLabels[item.status]}</Text>
            {item.note && <Text style={styles.meta}>Ghi chú: {String(item.note || '')}</Text>}
            {item.ranking && item.comment && (
              <View style={{ marginTop: 8, padding: 8, backgroundColor: '#f0f0f0', borderRadius: 4 }}>
                <Text style={styles.meta}>Đánh giá: {'⭐'.repeat(item.ranking)}</Text>
                <Text style={styles.meta}>{String(item.comment || '')}</Text>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8, alignItems: 'center' },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#ddd', borderRadius: 20 },
  chipActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  chipTextActive: { color: 'white' },
  reload: { marginLeft: 'auto', backgroundColor: '#007AFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  card: { borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 12, marginBottom: 10, backgroundColor: 'white' },
  title: { fontWeight: '700' },
  meta: { color: '#666', marginTop: 2 },
  row: { flexDirection: 'row', gap: 8, marginTop: 8 },
  outline: { paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  primary: { marginTop: 8, backgroundColor: '#16a34a', paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
});

export default OrdersScreen;


