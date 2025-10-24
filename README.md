# GroupProject - MMA301

Dự án React Native Expo cho môn MMA301 - FPT University HCM

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cài đặt](#cài-đặt)
- [Cấu trúc dự án chi tiết](#cấu-trúc-dự-án-chi-tiết)
- [Phân công công việc](#phân-công-công-việc)
- [Hướng dẫn phát triển](#hướng-dẫn-phát-triển)
- [Scripts và Commands](#scripts-và-commands)
- [Quy tắc code](#quy-tắc-code)

## 🎯 Giới thiệu

Dự án này được phát triển bởi nhóm 3 thành viên cho môn MMA301 tại FPT University HCM. Ứng dụng được xây dựng bằng React Native với Expo, sử dụng TypeScript và các best practices hiện đại.

### Thành viên nhóm

- **Thành viên 1**: [DucTrung0704] - UI/UX Development & Components
- **Thành viên 2**: [TuanNguyen212204] - API Integration & Services  
- **Thành viên 3**: [hungdo2003] - State Management & Testing

## 🚀 Công nghệ sử dụng

### Core
- **React Native**: 0.81.5
- **Expo**: ~54.0.20
- **TypeScript**: ^5.3.3
- **React**: 19.1.0

### State Management
- **Zustand**: ^4.4.7 (Simple & lightweight alternative to Redux)

### API & Data
- **Axios**: ^1.6.2 (HTTP client)
- **react-native-dotenv**: ^3.4.9 (Environment variables)

### Development Tools
- **ESLint**: ^8.55.0
- **Prettier**: ^3.1.0
- **TypeScript ESLint**: ^6.13.2

### Testing
- **Jest**: ^29.7.0
- **@testing-library/react-native**: ^12.4.1

## 🔧 Cài đặt

### Bước 1: Cài đặt dependencies cơ bản

```bash
npm install
```

### Bước 2: Cài đặt React Navigation (bằng Expo CLI để đảm bảo tương thích)

```bash
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context
```

### Bước 3: Chạy ứng dụng

```bash
npm start
# hoặc
npx expo start
```

Sau đó bấm:
- `a` - Chạy trên Android
- `i` - Chạy trên iOS (chỉ trên macOS)
- `w` - Chạy trên Web

## 📁 Cấu trúc dự án chi tiết

```
GroupProject/
│
├── 📁 .vscode/                          # Cấu hình VS Code
│   ├── settings.json                    # Cài đặt editor (format on save, ESLint)
│   └── extensions.json                  # Extensions đề xuất (ESLint, Prettier, etc.)
│
├── 📁 assets/                           # Tài nguyên tĩnh
│   ├── icon.png                         # Icon app (1024x1024)
│   ├── splash-icon.png                  # Splash screen
│   ├── adaptive-icon.png                # Android adaptive icon
│   └── favicon.png                      # Web favicon
│
├── 📁 src/                              # Mã nguồn chính
│   │
│   ├── 📁 components/                   # Components dùng chung
│   │   │
│   │   ├── 📁 common/                   # UI components cơ bản
│   │   │   ├── Button.tsx               # Button với nhiều variants
│   │   │   │                            # Props: title, variant (primary/secondary/outline),
│   │   │   │                            # size (small/medium/large), loading, fullWidth
│   │   │   │                            # Sử dụng: <Button title="Click" onPress={handler} />
│   │   │   │
│   │   │   ├── Card.tsx                 # Card container với elevation/shadow
│   │   │   │                            # Props: children, elevation (số từ 1-5)
│   │   │   │                            # Sử dụng: <Card elevation={3}>{content}</Card>
│   │   │   │
│   │   │   ├── LoadingSpinner.tsx       # Loading indicator
│   │   │   │                            # Props: size (small/large), message, fullScreen
│   │   │   │                            # Sử dụng: <LoadingSpinner message="Đang tải..." />
│   │   │   │
│   │   │   └── index.ts                 # Export tất cả common components
│   │   │
│   │   ├── 📁 layout/                   # Layout components
│   │   │   ├── Container.tsx            # Container wrapper với padding
│   │   │   │                            # Props: children, padding (boolean)
│   │   │   │                            # Sử dụng: <Container>{content}</Container>
│   │   │   │
│   │   │   └── index.ts                 # Export layout components
│   │   │
│   │   └── index.ts                     # Export tất cả components
│   │
│   ├── 📁 features/                     # Tổ chức code theo tính năng
│   │   │                                # Mỗi feature là một module độc lập
│   │   │
│   │   ├── 📁 home/                     # Feature: Trang chủ
│   │   │   ├── 📁 components/           # Components riêng cho home
│   │   │   │                            # (Chưa có, thêm khi cần)
│   │   │   │
│   │   │   └── 📁 screens/              # Screens của home feature
│   │   │       └── HomeScreen.tsx       # Màn hình trang chủ
│   │   │                                # - Hiển thị welcome message
│   │   │                                # - Demo Zustand store (counter)
│   │   │                                # - Thông tin dự án
│   │   │
│   │   └── 📁 profile/                  # Feature: Hồ sơ người dùng
│   │       ├── 📁 components/           # Components riêng cho profile
│   │       │                            # (Chưa có, thêm khi cần)
│   │       │
│   │       └── 📁 screens/              # Screens của profile feature
│   │           └── ProfileScreen.tsx    # Màn hình profile
│   │                                    # - Hiển thị thông tin user
│   │                                    # - Thông tin nhóm
│   │                                    # - Vai trò thành viên
│   │
│   ├── 📁 hooks/                        # Custom React Hooks
│   │   │
│   │   ├── useApi.ts                    # Hook để gọi API
│   │   │                                # Tự động handle loading & error states
│   │   │                                # Usage:
│   │   │                                # const { data, loading, error, execute } = useApi(apiFunction);
│   │   │                                # useEffect(() => { execute(params); }, []);
│   │   │
│   │   ├── useDebounce.ts               # Hook để debounce value
│   │   │                                # Delay update value để tránh gọi API quá nhiều
│   │   │                                # Usage:
│   │   │                                # const debouncedValue = useDebounce(value, 500);
│   │   │
│   │   └── index.ts                     # Export tất cả hooks
│   │
│   ├── 📁 navigation/                   # Cấu hình navigation
│   │   │
│   │   ├── RootNavigator.tsx            # Root Stack Navigator
│   │   │                                # Navigator chính của app
│   │   │                                # Chứa MainTabNavigator và các screens khác
│   │   │                                # (Login, Details, Settings, etc.)
│   │   │
│   │   └── MainTabNavigator.tsx         # Bottom Tab Navigator
│   │                                    # Tab navigation với Home và Profile
│   │                                    # Customize: thêm tabs, icons, badges
│   │
│   ├── 📁 services/                     # External services & API
│   │   │
│   │   └── 📁 api/                      # API services
│   │       │
│   │       ├── apiClient.ts             # Axios instance đã config
│   │       │                            # - Base URL từ .env
│   │       │                            # - Timeout configuration
│   │       │                            # - Request interceptor (thêm token)
│   │       │                            # - Response interceptor (handle errors)
│   │       │                            # - Console logs cho debugging
│   │       │
│   │       ├── userService.ts           # User API calls
│   │       │                            # Functions:
│   │       │                            # - getUserProfile(userId): Lấy thông tin user
│   │       │                            # - updateUserProfile(userId, data): Cập nhật
│   │       │                            # - getUsers(): Lấy danh sách users
│   │       │
│   │       └── index.ts                 # Export API services
│   │
│   ├── 📁 store/                        # State management (Zustand)
│   │   │
│   │   └── appStore.ts                  # Main application store
│   │                                    # States:
│   │                                    # - count: Ví dụ counter
│   │                                    # - isLoading: Loading state toàn app
│   │                                    # - user: Thông tin user hiện tại
│   │                                    # Actions:
│   │                                    # - increment/decrement/reset: Counter
│   │                                    # - setLoading: Set loading state
│   │                                    # - setUser/clearUser: User management
│   │                                    # Usage:
│   │                                    # const { count, increment } = useAppStore();
│   │
│   ├── 📁 types/                        # TypeScript type definitions
│   │   │
│   │   ├── api.ts                       # API-related types
│   │   │                                # - ApiResponse<T>: Generic API response
│   │   │                                # - ApiError: Error response structure
│   │   │                                # - User: User model
│   │   │                                # - Product: Product model (example)
│   │   │
│   │   ├── navigation.ts                # Navigation types
│   │   │                                # - MainTabParamList: Tab navigator params
│   │   │                                # - RootStackParamList: Stack navigator params
│   │   │                                # Định nghĩa params cho mỗi screen
│   │   │
│   │   ├── env.d.ts                     # Environment variables types
│   │   │                                # Định nghĩa types cho biến trong .env
│   │   │                                # (API_BASE_URL, API_TIMEOUT, etc.)
│   │   │
│   │   └── index.ts                     # Export tất cả types
│   │
│   ├── 📁 utils/                        # Utility functions
│   │   │
│   │   ├── formatters.ts                # Format functions
│   │   │                                # - formatCurrency(amount): Format tiền VND
│   │   │                                # - formatDate(date, format): Format ngày
│   │   │                                # - truncateText(text, maxLength): Rút gọn text
│   │   │                                # - capitalizeFirstLetter(text): Viết hoa chữ đầu
│   │   │
│   │   ├── validators.ts                # Validation functions
│   │   │                                # - isValidEmail(email): Kiểm tra email
│   │   │                                # - isValidPhone(phone): Kiểm tra SĐT VN
│   │   │                                # - isStrongPassword(pwd): Kiểm tra mật khẩu mạnh
│   │   │                                # - isValidUrl(url): Kiểm tra URL
│   │   │
│   │   ├── storage.ts                   # AsyncStorage wrapper
│   │   │                                # - setItem(key, value): Lưu data
│   │   │                                # - getItem<T>(key): Lấy data
│   │   │                                # - removeItem(key): Xóa item
│   │   │                                # - clear(): Xóa tất cả
│   │   │                                # Note: Cần cài @react-native-async-storage/async-storage
│   │   │
│   │   └── index.ts                     # Export utilities
│   │
│   └── 📁 constants/                    # App constants
│       │
│       ├── colors.ts                    # Color palette
│       │                                # Định nghĩa tất cả màu sắc trong app:
│       │                                # - Primary colors (primary, primaryDark, primaryLight)
│       │                                # - Secondary colors
│       │                                # - Neutral colors (white, black, gray variants)
│       │                                # - Status colors (success, error, warning, info)
│       │                                # - Text colors (textPrimary, textSecondary, textDisabled)
│       │                                # Usage: import { COLORS } from '@constants';
│       │
│       ├── sizes.ts                     # Sizes & spacing
│       │                                # - Screen dimensions (width, height)
│       │                                # - Font sizes (fontXS to font4XL)
│       │                                # - Spacing (xs to xxxl: 4px to 32px)
│       │                                # - Border radius (radiusXS to radiusFull)
│       │                                # - Icon sizes (iconXS to iconXL)
│       │                                # Usage: import { SIZES } from '@constants';
│       │
│       ├── config.ts                    # App configuration
│       │                                # - APP_NAME, APP_VERSION
│       │                                # - API_BASE_URL (từ .env)
│       │                                # - API_TIMEOUT
│       │                                # - Feature flags (ENABLE_ANALYTICS, etc.)
│       │                                # - Pagination defaults
│       │                                # Usage: import { CONFIG } from '@constants';
│       │
│       └── index.ts                     # Export constants
│
├── 📄 App.tsx                           # Entry point của ứng dụng
│                                        # - Setup NavigationContainer
│                                        # - Setup SafeAreaProvider
│                                        # - Render RootNavigator
│                                        # - StatusBar configuration
│
├── 📄 index.js                          # Expo entry point
│                                        # File này register App component
│                                        # KHÔNG cần sửa file này
│
├── 📄 app.json                          # Expo configuration
│                                        # Cấu hình cho Expo:
│                                        # - App name, slug, version
│                                        # - Icon, splash screen
│                                        # - iOS/Android specific config
│                                        # - Bundle identifiers
│
├── 📄 package.json                      # Dependencies & scripts
│                                        # - List tất cả packages
│                                        # - Scripts (start, lint, test, etc.)
│                                        # - Jest configuration
│
├── 📄 babel.config.js                   # Babel configuration
│                                        # Cấu hình:
│                                        # - babel-preset-expo
│                                        # - module-resolver (path aliases)
│                                        # - react-native-dotenv (env variables)
│
├── 📄 metro.config.js                   # Metro bundler config
│                                        # Cấu hình Metro bundler của React Native
│                                        # Sử dụng default config của Expo
│
├── 📄 tsconfig.json                     # TypeScript configuration
│                                        # Cấu hình TypeScript:
│                                        # - Extends expo/tsconfig.base
│                                        # - Strict mode enabled
│                                        # - Path aliases (@components, @hooks, etc.)
│                                        # - Compiler options
│
├── 📄 .eslintrc.js                      # ESLint configuration
│                                        # Lint rules:
│                                        # - Extends: expo, recommended, prettier
│                                        # - TypeScript rules
│                                        # - React/React Hooks rules
│                                        # - Custom rules (console.log warning, etc.)
│
├── 📄 .prettierrc                       # Prettier configuration
│                                        # Code formatting rules:
│                                        # - Semi-colons: yes
│                                        # - Single quotes: yes
│                                        # - Print width: 100
│                                        # - Tab width: 2 spaces
│
├── 📄 .editorconfig                     # Editor configuration
│                                        # Universal editor settings:
│                                        # - Charset: UTF-8
│                                        # - End of line: LF
│                                        # - Indent: 2 spaces
│                                        # - Trim trailing whitespace
│
├── 📄 .gitignore                        # Git ignore rules
│                                        # Ignore:
│                                        # - node_modules/
│                                        # - .expo/
│                                        # - .env files
│                                        # - Build artifacts
│                                        # - OS files (.DS_Store)
│
├── 📄 .npmrc                            # NPM configuration
│                                        # - legacy-peer-deps=true
│                                        # Để tránh peer dependency conflicts
│
├── 📄 expo-env.d.ts                     # Expo type declarations
│                                        # Auto-generated types cho Expo
│                                        # KHÔNG nên edit file này
│
└── 📄 README.md                         # Documentation (file này)
                                         # Tài liệu đầy đủ về dự án

```

## 👥 Phân công công việc chi tiết

### 🎨 Thành viên 1: UI/UX Developer

**Trách nhiệm chính:**
- Thiết kế và phát triển giao diện người dùng
- Tạo các UI components tái sử dụng
- Đảm bảo UX tốt và responsive design

**Thư mục phụ trách:**

1. **`src/components/`** - Tạo và maintain components
   - Thêm components mới vào `common/` (Input, Modal, Dropdown, etc.)
   - Tạo layout components trong `layout/` (Header, Footer, etc.)
   - Đảm bảo components có props types rõ ràng
   - Viết styles sử dụng COLORS và SIZES từ constants

2. **`src/features/*/screens/`** - Xây dựng màn hình
   - Design và implement tất cả screens
   - Sử dụng components từ `src/components/`
   - Đảm bảo UI consistent và đẹp

3. **`src/constants/`** - Quản lý design system
   - Cập nhật `colors.ts` theo design
   - Thêm/sửa sizes trong `sizes.ts`
   - Maintain design consistency

4. **`src/navigation/`** - Setup navigation
   - Cấu hình tab icons và labels
   - Thêm screens mới vào navigators
   - Customize header, tab bar

**Công việc đầu tiên:**
1. Customize colors trong `src/constants/colors.ts` theo brand
2. Tạo thêm common components: Input, Modal, Dropdown
3. Design và implement Login/Register screens
4. Setup authentication flow trong navigation

### 🔌 Thành viên 2: API Integration & Services

**Trách nhiệm chính:**
- Tích hợp với backend APIs
- Xử lý authentication và authorization
- Implement data fetching và caching
- Viết utility functions

**Thư mục phụ trách:**

1. **`src/services/api/`** - API services
   - Cập nhật `apiClient.ts`:
     - Thêm authentication token vào headers
     - Implement refresh token logic
     - Custom error handling
   - Tạo service files mới cho từng resource:
     - `authService.ts`: login, register, logout
     - `productService.ts`: CRUD products
     - Các services khác theo backend
   - Ensure proper error handling

2. **`src/utils/`** - Utility functions
   - Thêm utilities cần thiết:
     - `api-helpers.ts`: Helper cho API calls
     - `error-handler.ts`: Centralized error handling
     - `cache.ts`: Caching logic
   - Maintain existing utils (formatters, validators, storage)

3. **`src/types/api.ts`** - API types
   - Định nghĩa types cho mọi API response
   - Tạo request/response interfaces
   - Document API structure

4. **`src/constants/config.ts`** - Configuration
   - Update API URLs
   - Configure timeouts và retry logic
   - Feature flags

**Công việc đầu tiên:**
1. Cập nhật `API_BASE_URL` trong file `.env`
2. Implement `authService.ts` với login/register
3. Setup token storage và refresh logic trong `apiClient.ts`
4. Tạo types cho authentication API

### 🏪 Thành viên 3: State Management & Testing

**Trách nhiệm chính:**
- Quản lý global state với Zustand
- Phát triển custom hooks
- Viết tests cho toàn bộ app
- Code quality và documentation

**Thư mục phụ trách:**

1. **`src/store/`** - State management
   - Tổ chức store structure:
     - `authStore.ts`: Authentication state
     - `userStore.ts`: User data
     - `productStore.ts`: Products state
     - `appStore.ts`: App-wide state (đã có)
   - Implement actions và selectors
   - Integrate với AsyncStorage cho persistence

2. **`src/hooks/`** - Custom hooks
   - Tạo custom hooks cho business logic:
     - `useAuth.ts`: Authentication logic
     - `useForm.ts`: Form handling với validation
     - `usePagination.ts`: Pagination logic
     - `useSearch.ts`: Search với debounce
   - Maintain existing hooks (useApi, useDebounce)

3. **Testing** - Viết tests
   - Unit tests cho components: `*.test.tsx`
   - Hook tests: test custom hooks
   - Store tests: test Zustand stores
   - Integration tests: test user flows
   - Maintain test coverage > 70%

4. **Documentation** - Maintain docs
   - Update README khi có thay đổi
   - Comment code phức tạp
   - Write JSDoc cho functions/hooks

**Công việc đầu tiên:**
1. Tạo `authStore.ts` với login/logout states
2. Implement `useAuth` hook sử dụng authStore
3. Viết tests cho existing components (Button, Card)
4. Setup test coverage reporting

## 🚀 Hướng dẫn phát triển

### Thêm Feature Mới

**Bước 1: Tạo feature structure**

```bash
# Tạo folders
mkdir -p src/features/products/components
mkdir -p src/features/products/screens
```

**Bước 2: Tạo screen**

```typescript
// src/features/products/screens/ProductListScreen.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Container } from '@components/layout';
import { LoadingSpinner } from '@components/common';
import { COLORS, SIZES } from '@constants';

const ProductListScreen = () => {
  return (
    <Container>
      <Text style={styles.title}>Danh sách sản phẩm</Text>
      {/* Your content */}
    </Container>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: SIZES.font2XL,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SIZES.lg,
  },
});

export default ProductListScreen;
```

**Bước 3: Thêm vào navigation**

```typescript
// src/navigation/MainTabNavigator.tsx
import ProductListScreen from '@features/products/screens/ProductListScreen';

// Thêm tab mới
<Tab.Screen 
  name="Products" 
  component={ProductListScreen}
  options={{
    title: 'Sản phẩm',
    tabBarLabel: 'Sản phẩm',
  }}
/>
```

**Bước 4: Update navigation types**

```typescript
// src/types/navigation.ts
export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
  Products: undefined; // ✅ Thêm dòng này
};
```

### Thêm API Service Mới

```typescript
// src/services/api/productService.ts
import apiClient from './apiClient';
import { ApiResponse, Product } from '@types/api';

export const productService = {
  // GET /products
  getProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products');
    return response.data.data;
  },

  // GET /products/:id
  getProductById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  },

  // POST /products
  createProduct: async (data: Omit<Product, 'id'>): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<Product>>('/products', data);
    return response.data.data;
  },
};
```

Sau đó export từ `src/services/api/index.ts`:

```typescript
export * from './productService';
```

### Sử dụng API trong Component

```typescript
import React, { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useApi } from '@hooks';
import { productService } from '@services/api';
import { LoadingSpinner } from '@components/common';

const ProductListScreen = () => {
  const { data, loading, error, execute } = useApi(productService.getProducts);

  useEffect(() => {
    execute();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <FlatList
      data={data || []}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Text>{item.name}</Text>
      )}
    />
  );
};
```

### Tạo Store Mới (Zustand)

```typescript
// src/store/productStore.ts
import { create } from 'zustand';
import { Product } from '@types/api';

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  
  // Actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  selectProduct: (product: Product | null) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  selectedProduct: null,
  
  setProducts: (products) => set({ products }),
  
  addProduct: (product) => set((state) => ({ 
    products: [...state.products, product] 
  })),
  
  selectProduct: (product) => set({ selectedProduct: product }),
}));
```

Sử dụng trong component:

```typescript
import { useProductStore } from '@store/productStore';

const MyComponent = () => {
  const { products, addProduct, selectProduct } = useProductStore();
  
  // Use state and actions
  const handleAdd = () => {
    addProduct({ id: '1', name: 'Product 1', price: 100 });
  };
  
  return (
    // JSX
  );
};
```

### Tạo Custom Hook

```typescript
// src/hooks/useAuth.ts
import { useState, useCallback } from 'react';
import { authService } from '@services/api';
import { useAppStore } from '@store/appStore';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const { setUser, clearUser } = useAppStore();

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      setUser(response.user);
      // Save token to storage
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  const logout = useCallback(async () => {
    clearUser();
    // Clear token from storage
  }, [clearUser]);

  return { login, logout, loading };
};
```

Export từ `src/hooks/index.ts`:

```typescript
export * from './useAuth';
```

## 📜 Scripts và Commands

### Development

```bash
# Start Expo dev server
npm start
# hoặc
npx expo start

# Chạy trên Android
npm run android
# hoặc
npx expo start --android

# Chạy trên iOS (chỉ macOS)
npm run ios
# hoặc
npx expo start --ios

# Chạy trên Web
npm run web
# hoặc
npx expo start --web
```

### Code Quality

```bash
# Check lỗi ESLint
npm run lint

# Fix ESLint errors tự động
npm run lint:fix

# Format code với Prettier
npm run format

# Check TypeScript types
npm run type-check
```

### Testing

```bash
# Run tests với watch mode (development)
npm test

# Run tests một lần (CI/CD)
npm run test:ci

# Run tests với coverage
npm test -- --coverage
```

### Clear Cache (khi gặp lỗi)

```bash
# Clear Expo cache
npx expo start -c

# Clear Metro bundler cache
npx react-native start --reset-cache

# Clear node_modules và reinstall
rm -rf node_modules
npm install
```

## 📏 Quy tắc code

### TypeScript

✅ **Luôn sử dụng TypeScript**
- Tất cả files phải là `.ts` hoặc `.tsx`
- Tránh dùng `any`, ưu tiên `unknown` hoặc generic types
- Định nghĩa interfaces cho tất cả props

```typescript
// ✅ Good
interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, disabled }) => {
  // ...
};

// ❌ Bad
const Button = ({ title, onPress, disabled }: any) => {
  // ...
};
```

### Naming Conventions

- **Components**: `PascalCase` (VD: `Button.tsx`, `HomeScreen.tsx`)
- **Files khác**: `camelCase` (VD: `userService.ts`, `apiClient.ts`)
- **Constants**: `UPPER_SNAKE_CASE` (VD: `API_BASE_URL`)
- **Functions**: `camelCase` (VD: `fetchUserData`, `formatCurrency`)
- **Interfaces/Types**: `PascalCase` (VD: `User`, `ApiResponse`)

### Import Order

```typescript
// 1. React & React Native
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 2. Third-party libraries
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

// 3. Local imports với @ aliases
import { Button, Card } from '@components';
import { useAppStore } from '@store/appStore';
import { COLORS, SIZES } from '@constants';
import { User } from '@types';

// 4. Relative imports
import LocalComponent from './LocalComponent';
```

### Component Structure

```typescript
// 1. Imports
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
  onPress?: () => void;
}

// 3. Component
const MyComponent: React.FC<MyComponentProps> = ({ title, onPress }) => {
  // Hooks
  const [state, setState] = React.useState('');
  
  // Handlers
  const handlePress = () => {
    onPress?.();
  };
  
  // Render
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

// 4. Styles
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

// 5. Export
export default MyComponent;
```

### Sử dụng Constants

```typescript
import { COLORS, SIZES } from '@constants';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    padding: SIZES.lg,
    borderRadius: SIZES.radiusMD,
  },
  text: {
    color: COLORS.textPrimary,
    fontSize: SIZES.fontLG,
  },
});
```

### Path Aliases

✅ **Sử dụng path aliases**

```typescript
// ✅ Good - Clean và dễ đọc
import { Button } from '@components';
import { useAppStore } from '@store/appStore';
import { COLORS } from '@constants';
import { User } from '@types';

// ❌ Bad - Khó maintain
import { Button } from '../../../components/common/Button';
import { useAppStore } from '../../../../store/appStore';
```

**Aliases có sẵn:**
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@features/*` → `src/features/*`
- `@hooks/*` → `src/hooks/*`
- `@services/*` → `src/services/*`
- `@store/*` → `src/store/*`
- `@utils/*` → `src/utils/*`
- `@constants/*` → `src/constants/*`
- `@types/*` → `src/types/*`
- `@navigation/*` → `src/navigation/*`

### Git Workflow

**Branch Strategy:**

```
main (production)
├── develop (development)
│   ├── feature/login-screen
│   ├── feature/product-list
│   └── bugfix/navigation-crash
```

**Branch Naming:**
- `feature/ten-tinh-nang` - Tính năng mới
- `bugfix/mo-ta-loi` - Sửa bug
- `hotfix/loi-khan-cap` - Fix urgent

**Commit Messages:**

```
<type>: <description>

[optional body]
```

**Types:**
- `feat`: Tính năng mới
- `fix`: Sửa bug
- `docs`: Cập nhật docs
- `style`: Format code
- `refactor`: Refactor code
- `test`: Thêm tests
- `chore`: Maintenance

**Ví dụ:**

```
feat: add login screen with validation

- Implement login form
- Add email/password validation
- Integrate with auth API
```

## 🧪 Testing

### Viết Tests

```typescript
// Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import Button from './Button';

describe('Button Component', () => {
  it('should render correctly', () => {
    const { getByText } = render(
      <Button title="Click me" onPress={() => {}} />
    );
    expect(getByText('Click me')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Click" onPress={onPress} />
    );
    
    fireEvent.press(getByText('Click'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should show loading spinner when loading', () => {
    const { queryByText, UNSAFE_getByType } = render(
      <Button title="Submit" onPress={() => {}} loading />
    );
    
    expect(queryByText('Submit')).toBeNull();
    // ActivityIndicator should be rendered
  });
});
```

### Test Custom Hooks

```typescript
// useAuth.test.ts
import { renderHook, act } from '@testing-library/react-native';
import { useAuth } from './useAuth';

describe('useAuth Hook', () => {
  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      const response = await result.current.login('test@email.com', 'password');
      expect(response.success).toBe(true);
    });
  });
});
```

## 🐛 Troubleshooting

### Module not found

```bash
rm -rf node_modules
npm install
npx expo start -c
```

### TypeScript errors

```bash
npm run type-check
# Fix các lỗi hiển thị
```

### ESLint errors

```bash
npm run lint:fix
# Hoặc fix manually
```

### Metro bundler issues

```bash
npx expo start -c
```

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Check documentation này
2. Google với keywords: "React Native [vấn đề]"
3. Check [Expo docs](https://docs.expo.dev)
4. Hỏi trong group chat

## 📚 Tài liệu tham khảo

- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zustand](https://github.com/pmndrs/zustand)

---

**Made with ❤️ by Group [Số nhóm] - MMA301 - FPT University HCM**

**Happy Coding! 🚀**
>>>>>>> develop
