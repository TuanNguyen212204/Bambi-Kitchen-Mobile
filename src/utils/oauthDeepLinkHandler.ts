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
    // Xử lý cả custom scheme (groupproject:// hoặc groupproject:/), HTTP URLs, và HTTPS URLs
    let urlToParse = url;
    
    // Nếu là custom scheme, normalize và thêm protocol để URL() có thể parse
    if (url.startsWith('groupproject://') || url.startsWith('groupproject:/')) {
      // Normalize: groupproject:/ -> groupproject://
      const normalized = url.startsWith('groupproject://') ? url : url.replace('groupproject:/', 'groupproject://');
      urlToParse = normalized.replace('groupproject://', 'http://placeholder/');
    }
    // Nếu là HTTPS/HTTP URL (web URL), parse trực tiếp
    else if (url.startsWith('https://') || url.startsWith('http://')) {
      urlToParse = url;
    }
    
    const urlObj = new URL(urlToParse);
    
    // Parse query params từ URL gốc (không phải normalized)
    const queryString = url.includes('?') ? url.split('?')[1] : '';
    if (queryString) {
      queryString.split('&').forEach((param) => {
        const [key, value] = param.split('=');
        if (key && value) {
          params[decodeURIComponent(key)] = decodeURIComponent(value);
        }
      });
    }
  } catch (error) {
    // Fallback: parse thủ công nếu URL() không parse được
    console.log('[OAUTH_DEEP_LINK] Using manual parsing for URL:', url);
    const queryString = url.includes('?') ? url.split('?')[1] : '';
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
 * Xử lý deep link từ Google OAuth callback
 * URL format có thể là:
 * - groupproject://oauth2/callback?token=... (đúng format)
 * - groupproject:/oauth2/callback?token=... (backend có thể set thiếu một dấu /)
 * - http://localhost:8081/oauth2/callback?token=...
 * - http://127.0.0.1:8081/oauth2/callback?token=...
 * - http://10.0.2.2:8081/oauth2/callback?token=... (Android emulator)
 * - https://bambi.kdz.asia/oauth2/callback?token=...
 * - https://bambi-kitchen-web.vercel.app/oauth2/callback?token=... (web URL - cần xử lý đặc biệt)
 */
export async function handleOAuthDeepLink(url: string, navigation: any) {
  try {
    console.log('[OAUTH_DEEP_LINK] ====== START ======');
    console.log('[OAUTH_DEEP_LINK] Processing URL:', url);
    
    // Normalize URL: groupproject:/ -> groupproject:// (fix nếu backend thiếu một dấu /)
    let normalizedUrl = url;
    if (url.startsWith('groupproject:/') && !url.startsWith('groupproject://')) {
      normalizedUrl = url.replace('groupproject:/', 'groupproject://');
      console.log('[OAUTH_DEEP_LINK] Fixed URL format:', normalizedUrl);
    }
    
    console.log('[OAUTH_DEEP_LINK] Normalized URL:', normalizedUrl);
    console.log('[OAUTH_DEEP_LINK] URL includes oauth2/callback:', normalizedUrl.includes('/oauth2/callback') || normalizedUrl.includes('oauth2/callback'));

    // Kiểm tra xem có phải OAuth error URL không
    const isOAuthError = normalizedUrl.includes('/login?error') || normalizedUrl.includes('/oauth2/error');
    if (isOAuthError) {
      const params = parseQueryParams(normalizedUrl);
      const errorMsg = params.error || 'Unknown error';
      console.error('[OAUTH_DEEP_LINK] OAuth error:', errorMsg);
      Alert.alert('Đăng nhập thất bại', `Lỗi từ Google: ${errorMsg}`);
      return false;
    }

    // Kiểm tra xem có phải OAuth callback URL không
    // Hỗ trợ cả custom scheme, HTTP localhost URLs, và HTTPS web URLs
    // Và cả oauth-redirect.html (iOS)
    const isOAuthCallback = normalizedUrl.includes('/oauth2/callback') || normalizedUrl.includes('oauth2/callback') || normalizedUrl.includes('oauth-redirect.html');
    
    if (!isOAuthCallback) {
      console.log('[OAUTH_DEEP_LINK] Not an OAuth callback URL:', normalizedUrl);
      return false;
    }
    
    // Nếu là web URL (HTTPS), cảnh báo rằng backend nên redirect về groupproject://
    if (normalizedUrl.startsWith('https://') || normalizedUrl.startsWith('http://')) {
      console.warn('[OAUTH_DEEP_LINK] ⚠️ Received web URL instead of deep link. Backend should redirect to groupproject:// for mobile.');
      console.warn('[OAUTH_DEEP_LINK] This URL will be processed, but user may need to manually return to app.');
    }
    
    console.log('[OAUTH_DEEP_LINK] ✅ Confirmed OAuth callback URL');

    // Parse token từ query params (dùng normalized URL)
    const params = parseQueryParams(normalizedUrl);
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
    store.dispatch(setLoading(false));
    Alert.alert('Lỗi', 'Xử lý đăng nhập Google thất bại.');
    return false;
  }
}

