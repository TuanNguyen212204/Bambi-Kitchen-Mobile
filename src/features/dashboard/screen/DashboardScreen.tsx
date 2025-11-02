import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Alert,
  LinearGradient,
} from 'react-native';
import { useAppSelector } from '@store/store';
import { getDashboardData, DashboardData } from '@/services/api/dashboardService';
import { OrderStatusV3 } from '@/types/api';

export default function DashboardScreen() {
  const { user } = useAppSelector((s) => s.auth);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchData = async () => {
    if (user?.role !== 'ADMIN') {
      Alert.alert('Từ chối truy cập', 'Chỉ Admin mới xem được dashboard');
      return;
    }

    setRefreshing(true);
    try {
      const result = await getDashboardData();
      setData(result);
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const onRefresh = () => {
    fetchData();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Không có dữ liệu</Text>
      </View>
    );
  }

  const statusConfig: Record<OrderStatusV3, { label: string; color: string }> = {
    PENDING: { label: 'Chờ xử lý', color: '#FFA500' },
    COMPLETED: { label: 'Hoàn thành', color: '#2ECC71' },
    PAID: { label: 'Đã thanh toán', color: '#3498DB' },
    CANCELLED: { label: 'Đã hủy', color: '#E74C3C' },
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Gradient Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📊 Dashboard Quản trị</Text>
        <Text style={styles.subtitle}>Theo dõi tổng quan hệ thống</Text>
      </View>

      {/* Tổng quan */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: '#6C63FF' }]}>
          <Text style={styles.statValue}>{data.totalUsers}</Text>
          <Text style={styles.statLabel}>Tài khoản</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FF6B6B' }]}>
          <Text style={styles.statValue}>{data.totalOrders}</Text>
          <Text style={styles.statLabel}>Đơn hàng</Text>
        </View>
      </View>

      {/* Trạng thái đơn hàng */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📦 Trạng thái đơn hàng</Text>
        {Object.entries(data.orderByStatus).map(([status, count]) => {
          const config = statusConfig[status as OrderStatusV3];
          if (!config) return null;
          return (
            <View key={status} style={styles.statusRow}>
              <View style={styles.statusInfo}>
                <View style={[styles.statusDot, { backgroundColor: config.color }]} />
                <Text style={[styles.statusName, { color: config.color }]}>{config.label}</Text>
              </View>
              <Text style={[styles.statusCount, { color: config.color }]}>{count}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 12, color: '#666', fontSize: 16 },
  error: { color: '#E74C3C', fontSize: 16 },

  header: {
    paddingVertical: 32,
    marginBottom: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555555',
    marginTop: 4,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 6,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
  },
  statValue: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  statLabel: { fontSize: 14, color: '#F0F0F0', marginTop: 4 },

  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 12,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statusInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  statusDot: { width: 14, height: 14, borderRadius: 7, marginRight: 10 },
  statusName: { fontSize: 16, fontWeight: '500' },
  statusCount: { fontSize: 16, fontWeight: '700' },
});
