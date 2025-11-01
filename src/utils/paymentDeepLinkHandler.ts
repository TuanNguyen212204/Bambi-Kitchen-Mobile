import { Alert } from 'react-native';
import paymentService from '@services/api/paymentService';
import { clearCart } from '@store/slices/cartSlice';
import { store } from '@store/store';

/**
 * Parse query parameters từ URL
 */
function parseQueryParams(url: string): Record<string, string> {
  const params: Record<string, string> = {};
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
  } catch (error) {
    // Nếu URL không hợp lệ, thử parse thủ công
    const queryString = url.split('?')[1];
    if (queryString) {
      queryString.split('&').forEach((param) => {
        const [key, value] = param.split('=');
        if (key && value) {
          params[decodeURIComponent(key)] = decodeURIComponent(value);
        }
      });
    }
  }
  return params;
}

/**
 * Xử lý deep link từ payment gateway (VNPay/MoMo)
 * URL format:
 * - groupproject://payment-success?orderID=123&vnp_ResponseCode=00&vnp_TransactionStatus=00&...
 * - http://localhost:8080/api/payment/vnpay-return?... (nếu backend redirect về HTTP URL)
 */
export async function handlePaymentDeepLink(url: string, navigation: any) {
  try {
    console.log('[PAYMENT_DEEP_LINK] Processing URL:', url);

    // Kiểm tra xem có phải payment return URL không
    // Format có thể là:
    // - groupproject://payment-success?orderID=123&vnp_ResponseCode=00&...
    // - http://localhost:8080/api/payment/vnpay-return?orderID=123&vnp_ResponseCode=00&... (backend redirect)
    const isPaymentSuccess = url.includes('payment-success') || url.includes('/payment-success');
    const isVnPayReturn = url.includes('/vnpay-return') || (url.includes('vnp_ResponseCode') && !isPaymentSuccess);
    const isMomoReturn = url.includes('/momo-return') || (url.includes('resultCode') && !url.includes('vnp_'));

    if (!isPaymentSuccess && !isVnPayReturn && !isMomoReturn) {
      console.log('[PAYMENT_DEEP_LINK] Not a payment return URL:', url);
      return;
    }

    // Parse query params từ URL
    const params = parseQueryParams(url);
    console.log('[PAYMENT_DEEP_LINK] Parsed params:', params);
    
    // Nếu là HTTP URL từ backend (http://localhost:8080/api/payment/vnpay-return?...)
    // Backend nên redirect về deep link, nhưng nếu app bắt được HTTP URL này,
    // vẫn xử lý được (trong trường hợp test hoặc manual paste URL)

    // Điều hướng đến PaymentSuccessScreen với params để xử lý callback
    if (navigation) {
      navigation.navigate('PaymentSuccess', {
        params,
      });
    } else {
      Alert.alert('Lỗi', 'Navigation không khả dụng.');
    }
  } catch (error: any) {
    console.error('[PAYMENT_DEEP_LINK] Error:', error);
    Alert.alert('Lỗi', 'Xử lý thanh toán thất bại. Vui lòng liên hệ hỗ trợ.');
  }
}

