import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { orderService } from '@services/api/orderService';
import { Orders } from '@/types/api';

const OrderDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const { orderId } = route.params as { orderId: number };
  const [order, setOrder] = useState<Orders | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const navigation = useNavigation<any>();

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  // Refresh khi quay lại từ FeedbackScreen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (orderId) {
        fetchOrderDetail();
      }
    });

    return unsubscribe;
  }, [navigation, orderId]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      setError('');
      // Sử dụng API getOrderById để lấy chi tiết đơn hàng
      const orderData = await orderService.getOrderById(orderId);
      setOrder(orderData);

      // Lấy items từ order (API có thể trả về items trong response)
      // Hiện tại API có thể không trả về items trong response
      // TODO: Fetch items nếu API hỗ trợ
    } catch (err: any) {
      console.error('Error fetching order detail:', err);
      setError(err?.message || 'Không thể tải chi tiết đơn hàng');
      Alert.alert('Lỗi', 'Không thể tải chi tiết đơn hàng. Vui lòng thử lại.');
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
    if (!status) return '#666';
    switch (status) {
      case 'PENDING':
        return '#FFA500';
      case 'COMPLETED':
        return '#34C759';
      case 'PAID':
        return '#007AFF';
      case 'CANCELLED':
        return '#FF3B30';
      default:
        return '#666';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải chi tiết đơn hàng...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
          <Text style={styles.errorText}>{error || 'Không tìm thấy đơn hàng'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchOrderDetail}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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

          {order.note && String(order.note).trim() ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ghi chú:</Text>
              <Text style={styles.infoValue}>{String(order.note || '')}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Danh sách món ăn</Text>
          <Text style={styles.emptyText}>Không có món nào trong đơn hàng này</Text>
          {/* {orderItems.length === 0 ? (
            <Text style={styles.emptyText}>Không có món nào trong đơn hàng này</Text>
          ) : (
            orderItems.map((item, index) => {
              const dish = item.dishId ? dishes[item.dishId] : null;
              const imageUrl = dish?.imageUrl;

              return (
                <View key={item.id || index} style={styles.itemCard}>
                  <View style={styles.itemRow}>
                    {imageUrl ? (
                      <Image source={{ uri: imageUrl }} style={styles.itemImage} />
                    ) : (
                      <View style={[styles.itemImage, styles.placeholderImage]}>
                        <Ionicons name="restaurant-outline" size={24} color="#ccc" />
                      </View>
                    )}
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.dishName || item.name}</Text>
                      {item.note && <Text style={styles.itemNote}>Ghi chú: {item.note}</Text>}
                      {item.dishTemplate?.size && (
                        <Text style={styles.itemSize}>Size: {item.dishTemplate.size}</Text>
                      )}
                      <Text style={styles.itemQuantity}>Số lượng: {item.quantity}</Text>
                    </View>
                  </View>
                </View>
              );
            })
          )} */}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tổng kết</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tổng tiền:</Text>
            <Text style={styles.summaryValue}>
              {Number(order.totalPrice || 0).toLocaleString('vi-VN')} ₫
            </Text>
          </View>
        </View>

        {/* Rating and Comment - chỉ hiển thị nếu đã đánh giá */}
        {(order.ranking && Number(order.ranking) > 0) || (order.comment && String(order.comment) !== '0' && String(order.comment).trim()) ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Đánh giá</Text>
            {order.ranking && Number(order.ranking) > 0 ? (
              <View style={styles.ratingSection}>
                <Text style={styles.infoLabel}>Đánh giá:</Text>
                <View style={styles.starContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Text key={star} style={styles.star}>
                      {order.ranking && Number(order.ranking) >= star ? '⭐' : '☆'}
                    </Text>
                  ))}
                  <Text style={styles.ratingText}>({String(order.ranking || 0)}/5)</Text>
                </View>
              </View>
            ) : null}
            {order.comment && String(order.comment) !== '0' && String(order.comment).trim() ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Bình luận:</Text>
                <Text style={[styles.infoValue, styles.commentText]}>{String(order.comment || '')}</Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </ScrollView>

      {/* Chỉ cho đánh giá khi status PAID hoặc COMPLETED và chưa đánh giá */}
      {order.status && (String(order.status) === 'PAID' || String(order.status) === 'COMPLETED') &&
      (!order.ranking || Number(order.ranking) === 0) &&
      (!order.comment || String(order.comment) === '0') ? (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.feedbackButton}
            onPress={() => navigation.navigate('Feedback', { orderId: Number(order.id || 0) })}
          >
            <Ionicons name="star-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.feedbackButtonText}>Đánh giá đơn hàng</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5ea',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 16,
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#111',
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  feedbackSection: {
    marginTop: 12,

    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  feedbackComment: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  itemCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  itemNote: {
    fontSize: 12,
    color: '#e67e22',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  itemSize: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ef4444',
  },
  footer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
  },
  feedbackButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  ratingSection: {
    marginBottom: 12,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  star: {
    fontSize: 24,
    color: '#ffa500',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginLeft: 8,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
    lineHeight: 20,
  },
});

export default OrderDetailScreen;
