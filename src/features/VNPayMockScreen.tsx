import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Linking, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { OrderItem } from '@/types/api';
import QRCode from 'react-native-qrcode-svg';

export default function VNPayMockScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { 
    amount, 
    orderInfo, 
    paymentUrl, 
    paymentMethod = 'VNPAY',
  } = route.params as {
    amount: number;
    orderInfo: string;
    paymentUrl?: string;
    paymentMethod?: 'VNPAY' | 'MOMO';
    cartItems: OrderItem[];
    orderId?: number;
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenPayment = async () => {
    if (paymentUrl) {
      try {
        const canOpen = await Linking.canOpenURL(paymentUrl);
        if (canOpen) {
          await Linking.openURL(paymentUrl);
          // Sau khi thanh toán xong:
          // 1. VNPay redirect về: http://localhost:8080/api/payment/vnpay-return?orderID=123&vnp_ResponseCode=00&...
          // 2. Backend xử lý và redirect về app: groupproject://payment-success?orderID=123&vnp_ResponseCode=00&...
          // 3. App bắt deep link và navigate đến PaymentSuccessScreen để xử lý callback
        } else {
          Alert.alert('Lỗi', 'Không thể mở link thanh toán.');
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể mở link thanh toán.');
      }
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
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{paymentMethod === 'VNPAY' ? 'VNPay' : 'Momo'}</Text>
        <Text style={styles.amount}>Số tiền: {amount.toLocaleString('vi-VN')}đ</Text>
        <Text style={styles.info}>Nội dung: {orderInfo}</Text>
        
        {/* Hiển thị QR Code cho MoMo */}
        {paymentMethod === 'MOMO' && paymentUrl && (
          <View style={styles.qrContainer}>
            <Text style={styles.qrTitle}>Quét mã QR để thanh toán</Text>
            <View style={styles.qrCodeWrapper}>
              <QRCode
                value={paymentUrl}
                size={250}
                color="#000000"
                backgroundColor="#FFFFFF"
              />
            </View>
            <Text style={styles.qrInstruction}>
              Mở app MoMo và quét mã QR này để thanh toán
            </Text>
          </View>
        )}

        {paymentUrl && (
          <Text style={styles.urlInfo} numberOfLines={2}>
            Payment URL: {paymentUrl}
          </Text>
        )}
      </View>

      {paymentUrl && (
        <>
          <TouchableOpacity 
            onPress={handleOpenPayment} 
            style={styles.openPaymentButton}
          >
            <Text style={styles.buttonText}>
              {paymentMethod === 'MOMO' ? 'Mở MoMo để thanh toán' : 'Mở trang thanh toán VNPay'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.instructionText}>
            {paymentMethod === 'MOMO' 
              ? 'Sau khi thanh toán xong, bạn sẽ được chuyển về app tự động.'
              : 'Sau khi thanh toán xong trong trình duyệt, bạn sẽ được chuyển về app tự động. Nếu không, hãy quay lại app và vào tab "Đơn hàng" để kiểm tra trạng thái.'}
          </Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 24, alignItems: 'center' },
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
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  buttonText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  qrContainer: {
    marginTop: 24,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  qrCodeWrapper: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  qrInstruction: {
    marginTop: 16,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
