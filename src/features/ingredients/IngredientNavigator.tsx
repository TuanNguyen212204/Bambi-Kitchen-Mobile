import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IngredientListScreen from './screens/IngredientListScreen';
import IngredientFormScreen from './screens/IngredientFormScreen';
import IngredientCategoryListScreen from './screens/IngredientCategoryListScreen';
import IngredientStockHistoryScreen from './screens/IngredientStockHistoryScreen';

export type IngredientStackParamList = {
  IngredientList: undefined;
  IngredientForm: { mode: 'create' } | { mode: 'edit'; ingredientId: number };
  IngredientCategoryList: undefined;
  IngredientHistory: { ingredientId: number };
};

const Stack = createNativeStackNavigator<IngredientStackParamList>();

const IngredientNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="IngredientList" component={IngredientListScreen} options={{ title: 'Nguyên liệu' }} />
      <Stack.Screen name="IngredientForm" component={IngredientFormScreen} options={{ title: 'Nguyên liệu' }} />
      <Stack.Screen name="IngredientCategoryList" component={IngredientCategoryListScreen} options={{ title: 'Danh mục' }} />
      <Stack.Screen name="IngredientHistory" component={IngredientStockHistoryScreen} options={{ title: 'Lịch sử' }} />
    </Stack.Navigator>
  );
};

export default IngredientNavigator;


