import { Linking, Alert } from 'react-native';
import { storage } from '@utils/storage';
import { store } from '@store/store';
import { setToken, setUser, setLoading } from '@store/slices/authSlice';
import { authService } from '@services/api/authService';

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
          params[key] = decodeURIComponent(value);
        }
      });
    }
  }
  return params;
}

/**
 * Xử lý deep link từ Google OAuth callback
 * URL format: bambi-kitchen-web.vercel.app/oauth2/callback?token=...
 * Hoặc: https://bambi.kdz.asia/oauth2/callback?token=...
 */
export async function handleOAuthDeepLink(url: string, navigation: any) {
  try {
    console.log('[OAUTH_DEEP_LINK] Processing URL:', url);

    // Kiểm tra xem có phải OAuth callback URL không
    const isOAuthCallback = url.includes('/oauth2/callback') || url.includes('oauth2/callback');
    
    if (!isOAuthCallback) {
      console.log('[OAUTH_DEEP_LINK] Not an OAuth callback URL:', url);
      return false;
    }

    // Parse token từ query params
    const params = parseQueryParams(url);
    const token = params.token;

    if (!token) {
      console.error('[OAUTH_DEEP_LINK] No token found in callback URL');
      Alert.alert('Lỗi', 'Không nhận được token từ Google OAuth.');
      return false;
    }

    console.log('[OAUTH_DEEP_LINK] Token received, length:', token.length);

    // Lưu token và set vào store
    store.dispatch(setLoading(true));
    try {
      await storage.setItem('authToken', token);
      store.dispatch(setToken(token));

      // Lấy thông tin user
      const me = await authService.me();
      const mapped = {
        id: me?.id ?? me?.userId ?? 0,
        name: me?.name ?? me?.username ?? me?.mail ?? 'User',
        mail: me?.mail ?? me?.email,
        role: me?.role ?? me?.authorities?.[0]?.authority ?? me?.authority,
        phone: me?.phone,
        password: me?.password, // Để check xem có password không
      };

      store.dispatch(setUser(mapped));
      store.dispatch(setLoading(false));

      // Alert sẽ được hiển thị ở ProfileScreen khi user vào màn hình Profile
      // Để tránh spam alert ngay sau khi login

      return true;
    } catch (error: any) {
      console.error('[OAUTH_DEEP_LINK] Error processing token:', error);
      store.dispatch(setLoading(false));
      Alert.alert('Lỗi', 'Không thể xác thực token. Vui lòng thử lại.');
      return false;
    }
  } catch (error: any) {
    console.error('[OAUTH_DEEP_LINK] Error:', error);
    Alert.alert('Lỗi', 'Xử lý đăng nhập Google thất bại.');
    return false;
  }
}

