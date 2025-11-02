import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminHubScreen from './screens/AdminHubScreen';
import OrdersScreen from './screens/OrdersScreen';
import IngredientListScreen from '@features/ingredients/screens/IngredientListScreen';
import IngredientFormScreen from '@features/ingredients/screens/IngredientFormScreen';
import IngredientCategoryListScreen from '@features/ingredients/screens/IngredientCategoryListScreen';
import IngredientStockHistoryScreen from '@features/ingredients/screens/IngredientStockHistoryScreen';
import IngredientDetailScreen from '@features/ingredients/screens/IngredientDetailScreen';
import IngredientCategoryFormScreen from '@features/ingredients/screens/IngredientCategoryFormScreen';
import DishListScreen from './screens/DishListScreen';
import DishFormScreen from './screens/DishFormScreen';

export type AdminStackParamList = {
  AdminHub: undefined;
  AdminIngredientList: undefined;
  AdminIngredientForm: { mode: 'create' } | { mode: 'edit'; ingredientId: number };
  AdminIngredientCategoryList: undefined;
  AdminIngredientHistory: { ingredientId: number };
  AdminOrders: undefined;
  AdminIngredientDetail: { ingredientId: number };
  AdminIngredientCategoryForm: { mode: 'create' } | { mode: 'edit'; categoryId: number };
  AdminDishList: undefined;
  AdminDishForm: { mode: 'create' } | { mode: 'edit'; dishId: number };
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

const AdminNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AdminHub" component={AdminHubScreen} options={{ title: 'Admin' }} />
      <Stack.Screen name="AdminIngredientList" component={IngredientListScreen} options={{ title: 'Nguyên liệu' }} />
      <Stack.Screen name="AdminIngredientForm" component={IngredientFormScreen} options={{ title: 'Nguyên liệu' }} />
      <Stack.Screen name="AdminIngredientCategoryList" component={IngredientCategoryListScreen} options={{ title: 'Danh mục' }} />
      <Stack.Screen name="AdminIngredientCategoryForm" component={IngredientCategoryFormScreen} options={{ title: 'Danh mục' }} />
      <Stack.Screen name="AdminIngredientHistory" component={IngredientStockHistoryScreen} options={{ title: 'Lịch sử tồn kho' }} />
      <Stack.Screen name="AdminOrders" component={OrdersScreen} options={{ title: 'Đơn hàng' }} />
      <Stack.Screen name="AdminIngredientDetail" component={IngredientDetailScreen} options={{ title: 'Chi tiết nguyên liệu' }} />
      <Stack.Screen name="AdminDishList" component={DishListScreen} options={{ title: 'Quản lý món ăn' }} />
      <Stack.Screen name="AdminDishForm" component={DishFormScreen} options={{ title: 'Món ăn' }} />
    </Stack.Navigator>
  );
};

export default AdminNavigator;


