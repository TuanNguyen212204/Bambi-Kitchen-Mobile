import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '@store/store';
import { clearCart } from '@store/slices/cartSlice';

const DISH_PRICES: Record<number, { price: number; calories: number; image?: string }> = {
  101: { price: 85000, calories: 680, image: 'https://i.imgur.com/pho.jpg' },
  102: { price: 65000, calories: 550, image: 'https://i.imgur.com/comtam.jpg' },
};

export default function CartScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const totalPrice = cartItems.reduce((sum, item) => {
    const info = DISH_PRICES[item.dishId] || { price: 0 };
    return sum + info.price * item.quantity;
  }, 0);

  const totalCalories = cartItems.reduce((sum, item) => {
    const info = DISH_PRICES[item.dishId] || { calories: 0 };
    return sum + info.calories * item.quantity;
  }, 0);

  const goToCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Giỏ hàng trống', 'Vui lòng thêm món ăn trước khi thanh toán');
      return;
    }

    navigation.navigate('Cart', {
      screen: 'Checkout',
    });
  };

  const clearCartHandler = () => {
    Alert.alert('Xóa giỏ hàng', 'Bạn có chắc muốn xóa toàn bộ?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => dispatch(clearCart()),
      },
    ]);
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Giỏ hàng trống</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={styles.shopButton}
        >
          <Text style={styles.shopButtonText}>Tiếp tục mua sắm</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.list}>
        {cartItems.map((item) => {
          const { price = 0, calories = 0, image } = DISH_PRICES[item.dishId] || {};
          return (
            <View key={item.id} style={styles.item}>
              {image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <View style={[styles.image, styles.placeholderImage]}>
                  <Text style={styles.placeholderText}>?</Text>
                </View>
              )}
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.dishName}</Text>
                <Text style={styles.quantity}>x{item.quantity}</Text>
                {item.note && (
                  <Text style={styles.note}>Ghi chú: {item.note}</Text>
                )}
                <Text style={styles.calories}>{calories * item.quantity} calo</Text>
              </View>
              <Text style={styles.price}>
                {(price * item.quantity).toLocaleString('vi-VN')}đ
              </Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tổng tiền</Text>
            <Text style={styles.totalPrice}>
              {totalPrice.toLocaleString('vi-VN')}đ
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tổng calo</Text>
            <Text style={styles.summaryText}>{totalCalories} calo</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={clearCartHandler} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Xóa giỏ</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={goToCheckout} style={styles.checkoutButton}>
            <Text style={styles.checkoutButtonText}>Thanh toán</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: { fontSize: 18, color: '#666', marginBottom: 16 },
  shopButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: { color: '#fff', fontWeight: '600' },
  list: { flex: 1, padding: 16 },
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  placeholderImage: {
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { fontSize: 24, color: '#ccc' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '600' },
  quantity: { fontSize: 14, color: '#007AFF', marginTop: 2 },
  note: { fontSize: 12, color: '#e67e22', fontStyle: 'italic', marginTop: 2 },
  calories: { fontSize: 12, color: '#999', marginTop: 2 },
  price: { fontSize: 16, fontWeight: '600', color: '#d32f2f' },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  summary: { marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 15, color: '#666' },
  totalPrice: { fontSize: 18, fontWeight: 'bold', color: '#d32f2f' },
  summaryText: { fontSize: 15, color: '#666' },
  actions: { flexDirection: 'row', gap: 12 },
  clearButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dc3545',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: { color: '#dc3545', fontWeight: '600' },
  checkoutButton: {
    flex: 2,
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});