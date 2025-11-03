import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { orderService } from '@services/api/orderService';
import { Orders, OrderDetail } from '@/types/api';
import { toast } from '@utils/toast';

const AdminOrderDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const { orderId } = route.params as { orderId: number };
  const [order, setOrder] = useState<Orders | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  useEffect(() => {
    fetchOrderData();
  }, [orderId]);

  const fetchOrderData = async () => {
    try {
      setLoading(true);
      // Lấy thông tin đơn hàng
      const orderData = await orderService.getOrderById(orderId);
      setOrder(orderData);

      // Lấy chi tiết đơn hàng (danh sách món trong đơn)
      const details = await orderService.getOrderDetailsByOrderId(orderId);
      setOrderDetails(details);
    } catch (err: any) {
      console.error('Error fetching order data:', err);
      // Lấy message từ error response data hoặc message
      const errorMessage = err?.response?.data?.data || 
                          err?.response?.data?.message || 
                          err?.message || 
                          'Không thể tải chi tiết đơn hàng';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string | undefined) => {
    if (!status) return 'Không xác định';
    switch (status) {
      case 'PENDING':
        return 'Đang chờ';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'PAID':
        return 'Đã thanh toán';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return String(status);
    }
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return '#8E8E93';
    switch (status) {
      case 'PENDING':
        return '#FF9500';
      case 'COMPLETED':
        return '#34C759';
      case 'PAID':
        return '#007AFF';
      case 'CANCELLED':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
          <Text style={styles.errorText}>Không tìm thấy đơn hàng</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchOrderData}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Thông tin đơn hàng */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Thông tin đơn hàng</Text>
            <View
              style={[styles.statusBadge, { backgroundColor: String(getStatusColor(order.status)) + '20' }]}
            >
              <Text style={[styles.statusText, { color: String(getStatusColor(order.status)) }]}>
                {String(getStatusText(order.status))}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mã đơn:</Text>
            <Text style={styles.infoValue}>#{String(order.id || 'N/A')}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ngày đặt:</Text>
            <Text style={styles.infoValue}>
              {(() => {
                try {
                  if (order.createAt && typeof order.createAt === 'string') {
                    const date = new Date(order.createAt);
                    if (!isNaN(date.getTime())) {
                      return date.toLocaleString('vi-VN');
                    }
                  }
                  return 'N/A';
                } catch {
                  return 'N/A';
                }
              })()}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tổng tiền:</Text>
            <Text style={[styles.infoValue, styles.totalPrice]}>
              {Number(order.totalPrice || 0).toLocaleString('vi-VN')}đ
            </Text>
          </View>

          {order.note && String(order.note).trim() ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ghi chú:</Text>
              <Text style={styles.infoValue}>{String(order.note || '')}</Text>
            </View>
          ) : null}

          {order.ranking && Number(order.ranking) > 0 && !isNaN(Number(order.ranking)) ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Đánh giá:</Text>
              <Text style={styles.infoValue}>{'⭐'.repeat(Math.max(0, Math.min(5, Number(order.ranking))))}</Text>
            </View>
          ) : null}

          {order.comment && String(order.comment).trim() ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Bình luận:</Text>
              <Text style={styles.infoValue}>{String(order.comment || '')}</Text>
            </View>
          ) : null}
        </View>

        {/* Chi tiết món ăn trong đơn */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Danh sách món ăn ({String(orderDetails.length || 0)})</Text>
          
          {orderDetails.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có món ăn nào</Text>
          ) : (
            orderDetails.map((detail) => (
              <TouchableOpacity
                key={String(detail?.id || Math.random())}
                style={styles.detailItem}
                onPress={() => {
                  if (detail?.dish?.id) {
                    navigation.navigate('AdminDishDetail', { 
                      dishId: detail.dish.id,
                      orderId: orderId,
                    });
                  }
                }}
                activeOpacity={0.7}
              >
                <Image
                  source={detail?.dish?.imageUrl && typeof detail.dish.imageUrl === 'string' && detail.dish.imageUrl.trim()
                    ? { uri: String(detail.dish.imageUrl).trim() } 
                    : undefined as any}
                  style={styles.dishImage}
                />
                <View style={styles.dishInfo}>
                  <Text style={styles.dishName}>
                    {detail?.dish?.name && String(detail.dish.name).trim() ? String(detail.dish.name).trim() : 'Món không xác định'}
                  </Text>
                  {detail?.size && String(detail.size).trim() ? (
                    <Text style={styles.dishMeta}>Size: {String(detail.size).trim()}</Text>
                  ) : null}
                  {detail?.notes && String(detail.notes).trim() ? (
                    <Text style={styles.dishMeta}>Ghi chú: {String(detail.notes).trim()}</Text>
                  ) : null}
                  {detail?.totalCalories != null && detail.totalCalories !== undefined && !isNaN(Number(detail.totalCalories)) ? (
                    <Text style={styles.dishMeta}>
                      Calories: {Number(detail.totalCalories || 0).toLocaleString('vi-VN')}
                    </Text>
                  ) : null}
                  {detail?.dish && detail.dish.price != null && !isNaN(Number(detail.dish.price)) ? (
                    <Text style={styles.dishPrice}>
                      {Number(detail.dish.price || 0).toLocaleString('vi-VN')}đ
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#111',
    fontWeight: '400',
    flex: 1,
    textAlign: 'right',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
    paddingVertical: 20,
  },
  detailItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 12,
  },
  dishImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  dishInfo: {
    flex: 1,
    marginLeft: 12,
  },
  dishName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  dishMeta: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  dishPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
    marginTop: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AdminOrderDetailScreen;

