import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Linking } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '@/store/store';
import { clearCart } from '@/store/slices/cartSlice';
import { OrderItem } from '@/types/api';
import paymentService from '@/services/api/paymentService';

export default function VNPayMockScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { 
    amount, 
    orderInfo, 
    paymentUrl, 
    paymentMethod = 'VNPAY',
    cartItems,
  } = route.params as {
    amount: number;
    orderInfo: string;
    paymentUrl?: string;
    paymentMethod?: 'VNPAY' | 'MOMO';
    cartItems: OrderItem[];
  };
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenPayment = async () => {
    if (paymentUrl) {
      try {
        const canOpen = await Linking.canOpenURL(paymentUrl);
        if (canOpen) {
          await Linking.openURL(paymentUrl);
          // Trong thực tế, sau khi thanh toán xong, VNPay/Momo sẽ redirect về app với params
          // Ở đây mock nên để user tự chọn kết quả
        } else {
          Alert.alert('Lỗi', 'Không thể mở link thanh toán.');
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể mở link thanh toán.');
      }
    }
  };

  const handlePaymentReturn = async (success: boolean, returnParams?: Record<string, string>) => {
    setProcessing(true);
    try {
      if (returnParams) {
        // Xử lý return từ payment gateway
        let result: string | any;
        if (paymentMethod === 'VNPAY') {
          result = await paymentService.handleVnPayReturn(returnParams);
        } else if (paymentMethod === 'MOMO') {
          result = await paymentService.handleMomoReturn(returnParams);
        }

        // Nếu thành công, clear cart và điều hướng
        if (success && result) {
          dispatch(clearCart());
          navigation.replace('PaymentResult', { 
            success: true, 
            message: 'Thanh toán thành công! Đơn hàng của bạn đã được xác nhận.' 
          });
        } else {
          navigation.replace('PaymentResult', {
            success: false,
            message: 'Thanh toán thất bại. Vui lòng thử lại.',
          });
        }
      } else {
        // Mock flow - không có return params
        if (success) {
          dispatch(clearCart());
          navigation.replace('PaymentResult', { 
            success: true, 
            message: 'Thanh toán thành công! Đơn hàng của bạn đã được xác nhận.' 
          });
        } else {
          navigation.replace('PaymentResult', {
            success: false,
            message: 'Thanh toán thất bại. Vui lòng thử lại.',
          });
        }
      }
    } catch (error: any) {
      console.error('Payment return error:', error);
      Alert.alert('Lỗi', error?.message || 'Xử lý thanh toán thất bại.');
      navigation.replace('PaymentResult', {
        success: false,
        message: 'Xử lý thanh toán thất bại. Vui lòng liên hệ hỗ trợ.',
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>
          Đang chuyển hướng đến {paymentMethod === 'VNPAY' ? 'VNPay' : 'Momo'}...
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{paymentMethod === 'VNPAY' ? 'VNPay' : 'Momo'}</Text>
        <Text style={styles.amount}>Số tiền: {amount.toLocaleString('vi-VN')}đ</Text>
        <Text style={styles.info}>Nội dung: {orderInfo}</Text>
        {paymentUrl && (
          <Text style={styles.urlInfo} numberOfLines={2}>
            Payment URL: {paymentUrl}
          </Text>
        )}
      </View>

      {paymentUrl && (
        <TouchableOpacity 
          onPress={handleOpenPayment} 
          style={styles.openPaymentButton}
          disabled={processing}
        >
          <Text style={styles.buttonText}>Mở trang thanh toán</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.mockLabel}>Hoặc chọn kết quả (Mock):</Text>

      <TouchableOpacity 
        onPress={() => handlePaymentReturn(true)} 
        style={[styles.successButton, processing && styles.buttonDisabled]}
        disabled={processing}
      >
        {processing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Thanh toán thành công (Mock)</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => handlePaymentReturn(false)} 
        style={[styles.failButton, processing && styles.buttonDisabled]}
        disabled={processing}
      >
        {processing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Thanh toán thất bại (Mock)</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24, justifyContent: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16 },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 24,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  cardTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  amount: { fontSize: 18, fontWeight: '600' },
  info: { fontSize: 14, color: '#666', marginTop: 8 },
  urlInfo: { 
    fontSize: 12, 
    color: '#999', 
    marginTop: 8,
    textAlign: 'center',
  },
  openPaymentButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  mockLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  successButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  failButton: {
    backgroundColor: '#dc3545',
    padding: 16,
    borderRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
