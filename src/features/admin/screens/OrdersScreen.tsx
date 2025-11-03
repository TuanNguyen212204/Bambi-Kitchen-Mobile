import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
  const navigation = useNavigation<any>();
  const [orders, setOrders] = useState<Orders[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      // GET /api/order - lấy tất cả orders (API v3)
      const data = await orderService.getOrders();
      // Sắp xếp từ mới đến cũ (theo createAt giảm dần)
      const sortedData = (data as Orders[]).sort((a, b) => {
        const dateA = a.createAt ? new Date(a.createAt).getTime() : 0;
        const dateB = b.createAt ? new Date(b.createAt).getTime() : 0;
        return dateB - dateA; // Mới nhất trước
      });
      setOrders(sortedData);
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
        renderItem={({ item }) => {
          // Đảm bảo tất cả giá trị đều là string trước khi render
          try {
            const orderId = item?.id != null ? String(item.id) : 'N/A';
            
            let createDate = 'N/A';
            if (item?.createAt) {
              try {
                const date = new Date(item.createAt);
                if (!isNaN(date.getTime())) {
                  createDate = date.toLocaleString('vi-VN');
                }
              } catch (e) {
                createDate = String(item.createAt || 'N/A');
              }
            }
            
            const totalPrice = item?.totalPrice != null ? String(item.totalPrice.toLocaleString('vi-VN')) : '0';
            
            let statusText = 'N/A';
            if (item?.status) {
              statusText = statusLabels[item.status] || String(item.status);
            }
            
            const ranking = item?.ranking != null && item.ranking > 0 ? item.ranking : 0;
            const rankingStars = ranking > 0 ? '⭐'.repeat(ranking) : '';
            
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('AdminOrderDetail', { orderId: item.id })}
                activeOpacity={0.7}
              >
                <Text style={styles.title}>Đơn #{orderId}</Text>
                <Text style={styles.meta}>Ngày: {createDate}</Text>
                <Text style={styles.meta}>Tổng tiền: {totalPrice}đ</Text>
                <Text style={styles.meta}>Trạng thái: {statusText}</Text>
                {item?.note && String(item.note).trim() && (
                  <Text style={styles.meta}>Ghi chú: {String(item.note)}</Text>
                )}
                {ranking > 0 && item?.comment && String(item.comment).trim() && (
                  <View style={{ marginTop: 8, padding: 8, backgroundColor: '#f0f0f0', borderRadius: 4 }}>
                    <Text style={styles.meta}>Đánh giá: {rankingStars}</Text>
                    <Text style={styles.meta}>{String(item.comment)}</Text>
                  </View>
                )}
                <Text style={styles.viewDetail}>Nhấn để xem chi tiết →</Text>
              </TouchableOpacity>
            );
          } catch (error) {
            // Fallback nếu có lỗi
            return (
              <View style={styles.card}>
                <Text style={styles.title}>Đơn hàng</Text>
                <Text style={styles.meta}>Lỗi hiển thị thông tin</Text>
              </View>
            );
          }
        }}
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
  viewDetail: {
    marginTop: 8,
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
});

export default OrdersScreen;


