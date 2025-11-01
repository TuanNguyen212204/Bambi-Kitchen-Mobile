import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { CheckCircle, XCircle } from 'lucide-react-native';
import { useAppDispatch } from '@/store/store';
import { clearCart } from '@/store/slices/cartSlice';
import { orderService } from '@services/api/orderService';
import paymentService from '@services/api/paymentService';

/**
 * PaymentSuccessScreen - Xử lý callback từ VNPay/MoMo sau khi thanh toán
 * Tương tự SuccessPage trên web
 * 
 * Deep link format: 
 * groupproject://payment-success?orderID=123&vnp_TransactionStatus=00&vnp_ResponseCode=00&...
 */
export default function PaymentSuccessScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('Đang xử lý...');

  // Parse params từ deep link hoặc route params
  // Deep link format: groupproject://payment-success?orderID=123&vnp_ResponseCode=00&...
  const params = route.params?.params || route.params || {};
  
  // VNPay: orderID có thể là orderID hoặc vnp_TxnRef
  // MoMo: orderID có thể là orderID hoặc orderId
  const orderID = params.orderID || params.vnp_TxnRef || params.orderId;
  const vnp_TransactionStatus = params.vnp_TransactionStatus;
  const vnp_ResponseCode = params.vnp_ResponseCode;
  const resultCode = params.resultCode; // MoMo
  const paymentMethod = params.vnp_ResponseCode ? 'VNPAY' : 'MOMO';
  
  console.log('[PAYMENT_SUCCESS] Params:', params);
  console.log('[PAYMENT_SUCCESS] OrderID:', orderID);

  useEffect(() => {
    handlePaymentCallback();
  }, []);

  /**
   * Xử lý callback payment - tương tự SuccessPage trên web
   */
  const handlePaymentCallback = async () => {
    try {
      setLoading(true);

      // Kiểm tra trạng thái thanh toán
      let paymentSuccess = false;
      if (paymentMethod === 'VNPAY') {
        // VNPay: vnp_ResponseCode = '00' và vnp_TransactionStatus = '00' là thành công
        paymentSuccess = vnp_ResponseCode === '00' && vnp_TransactionStatus === '00';
      } else if (paymentMethod === 'MOMO') {
        // MoMo: resultCode = '0' là thành công
        paymentSuccess = resultCode === '0';
      }

      if (!paymentSuccess) {
        setSuccess(false);
        setMessage('Thanh toán thất bại. Vui lòng thử lại.');
        setLoading(false);
        return;
      }

      // Bước 1: Gọi API để cập nhật order status (POST /order/pay?orderID=...)
      // Tương tự web: await api.post(`/order/pay?orderID=${orderID}`)
      if (orderID) {
        try {
          // Parse tất cả VNPay params để gọi API payment return
          const paymentParams: Record<string, string> = {};
          Object.keys(params).forEach((key) => {
            if (key.startsWith('vnp_') || key.startsWith('resultCode') || key === 'orderID') {
              paymentParams[key] = String(params[key]);
            }
          });

          if (paymentMethod === 'VNPAY') {
            await paymentService.handleVnPayReturn(paymentParams);
          } else if (paymentMethod === 'MOMO') {
            await paymentService.handleMomoReturn(paymentParams);
          }

          console.log('[PAYMENT_SUCCESS] Payment return API called successfully');
        } catch (error: any) {
          console.error('[PAYMENT_SUCCESS] Error calling payment return API:', error);
          // Vẫn tiếp tục nếu API lỗi (có thể backend đã tự xử lý)
        }
      }

      // Bước 2: Clear cart (tương tự web: dispatch(clearOrder()))
      dispatch(clearCart());

      // Bước 3: Set success state
      setSuccess(true);
      setMessage('Thanh toán thành công! Đơn hàng của bạn đã được xác nhận.');

    } catch (error: any) {
      console.error('[PAYMENT_SUCCESS] Error:', error);
      setSuccess(false);
      setMessage('Xử lý thanh toán thất bại. Vui lòng liên hệ hỗ trợ.');
      Alert.alert('Lỗi', error?.message || 'Xử lý thanh toán thất bại.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Đang xử lý thanh toán...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {success ? (
        <CheckCircle size={80} color="#28a745" />
      ) : (
        <XCircle size={80} color="#dc3545" />
      )}
      <Text style={[styles.title, success ? styles.successText : styles.failText]}>
        {success ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
      </Text>
      <Text style={styles.message}>{message}</Text>

      {orderID && (
        <Text style={styles.orderInfo}>Mã đơn hàng: #{orderID}</Text>
      )}

      {success && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('MainTabs', { screen: 'Orders' });
          }}
          style={styles.primaryButton}
        >
          <Text style={styles.buttonText}>Xem lịch sử đơn hàng</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('MainTabs', { screen: 'Home' });
        }}
        style={styles.secondaryButton}
      >
        <Text style={styles.buttonText}>Về trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
  },
  successText: {
    color: '#28a745',
  },
  failText: {
    color: '#dc3545',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    color: '#666',
    paddingHorizontal: 24,
  },
  orderInfo: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
  primaryButton: {
    marginTop: 32,
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  secondaryButton: {
    marginTop: 12,
    backgroundColor: '#6c757d',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

