import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import orderService, { OrderDto, OrderStatus } from '@services/api/orderService';
import { toast } from '@utils/toast';

const statusLabels: Record<OrderStatus, string> = {
  NEW: 'Mới',
  ASSIGNED: 'Đã nhận',
  PREPARING: 'Đang chuẩn bị',
  DONE: 'Hoàn tất',
  CANCELLED: 'Đã huỷ',
};

const OrdersScreen = () => {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<OrderStatus | undefined>(undefined);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders(status ? { status } : undefined);
      setOrders(data);
    } catch (e: any) {
      toast.error(e?.toString?.() || 'Lỗi tải danh sách đơn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [status]);

  const changeStatus = async (orderId: number, next: OrderStatus) => {
    try {
      await orderService.updateStatus(orderId, next);
      toast.success('Đã cập nhật trạng thái');
      load();
    } catch (e: any) {
      toast.error(e?.toString?.() || 'Lỗi cập nhật trạng thái');
    }
  };

  const confirmCOD = async (orderId: number) => {
    try {
      await orderService.confirmCOD(orderId);
      toast.success('Đã xác nhận thanh toán COD');
      load();
    } catch (e: any) {
      toast.error(e?.toString?.() || 'Lỗi xác nhận COD');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        {(['NEW','ASSIGNED','PREPARING','DONE','CANCELLED'] as OrderStatus[]).map((s) => (
          <TouchableOpacity key={s} onPress={() => setStatus(status === s ? undefined : s)} style={[styles.chip, status === s && styles.chipActive]}>
            <Text style={status === s ? styles.chipTextActive : undefined}>{statusLabels[s]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={orders}
        keyExtractor={(i) => String(i.id)}
        refreshing={refreshing}
        onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>#{item.id} {item.code ? `• ${item.code}` : ''}</Text>
            <Text style={styles.meta}>Khách: {item.customerName || '-'} • {item.customerPhone || '-'}</Text>
            <Text style={styles.meta}>Trạng thái: {statusLabels[item.status]}</Text>
            <View style={styles.row}>
              <TouchableOpacity onPress={() => changeStatus(item.id, 'ASSIGNED')} style={styles.outline}><Text>Nhận đơn</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => changeStatus(item.id, 'PREPARING')} style={styles.outline}><Text>Chuẩn bị</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => changeStatus(item.id, 'DONE')} style={styles.outline}><Text>Hoàn tất</Text></TouchableOpacity>
            </View>
            {item.paymentMethod === 'COD' && !item.isPaid && (
              <TouchableOpacity onPress={() => confirmCOD(item.id)} style={styles.primary}><Text style={{ color: 'white' }}>Xác nhận COD</Text></TouchableOpacity>
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


