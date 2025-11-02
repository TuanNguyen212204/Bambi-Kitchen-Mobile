import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '@store/store';
import { clearCart, removeFromCart, updateQuantity } from '@store/slices/cartSlice';
import { dishService, DishDto } from '@services/api/dishService';

export default function CartScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [dishes, setDishes] = useState<Record<number, DishDto>>({});
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchDishes = async () => {
      if (cartItems.length === 0) {
        setDishes({});
        return;
      }

      // Lấy danh sách dishIds cần thiết
      const allDishIds = [
        ...new Set(cartItems.map((item) => item.dishId).filter((id): id is number => id != null)),
      ];

      // Chỉ fetch dishes chưa có trong cache
      setDishes((prevDishes) => {
        const missingDishIds = allDishIds.filter((id) => !prevDishes[id]);

        // Nếu không có dishes nào cần fetch, không làm gì
        if (missingDishIds.length === 0) {
          return prevDishes;
        }

        // Chỉ set loading nếu chưa có dishes nào (lần đầu fetch)
        const shouldShowLoading = Object.keys(prevDishes).length === 0 && missingDishIds.length > 0;

        if (shouldShowLoading) {
          setLoading(true);
        }

        // Fetch dishes mới (async)
        (async () => {
          try {
            const dishPromises = missingDishIds.map((id) => dishService.getById(id));
            const dishResults = await Promise.all(dishPromises);

            // Cập nhật dishes map với dishes mới
            setDishes((currentDishes) => {
              const updatedDishes = { ...currentDishes };
              dishResults.forEach((dish, index) => {
                if (dish && missingDishIds[index] != null) {
                  updatedDishes[missingDishIds[index]] = dish;
                }
              });
              return updatedDishes;
            });
          } catch (error) {
            console.error('Error fetching dishes:', error);
          } finally {
            if (shouldShowLoading) {
              setLoading(false);
            }
          }
        })();

        // Return previous dishes while fetching
        return prevDishes;
      });
    };

    fetchDishes();
  }, [cartItems]);

  const selectedCartItems = useMemo(() => {
    return cartItems.filter((item) => item.dishId != null && selectedItems.has(item.dishId));
  }, [cartItems, selectedItems]);

  const totalPrice = useMemo(() => {
    const itemsToCalculate = selectedCartItems.length > 0 ? selectedCartItems : cartItems;
    return itemsToCalculate.reduce((sum, item) => {
      if (!item.dishId) return sum;
      const dish = dishes[item.dishId];
      const price = dish?.price || 0;
      return sum + price * item.quantity;
    }, 0);
  }, [cartItems, dishes, selectedCartItems]);

  const totalItems = useMemo(() => {
    const itemsToCalculate = selectedCartItems.length > 0 ? selectedCartItems : cartItems;
    return itemsToCalculate.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems, selectedCartItems]);

  const isAllSelected = cartItems.length > 0 && selectedItems.size === cartItems.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(
        new Set(cartItems.map((item) => item.dishId).filter((id): id is number => id != null))
      );
    }
  };

  const toggleSelectItem = (dishId: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(dishId)) {
      newSelected.delete(dishId);
    } else {
      newSelected.add(dishId);
    }
    setSelectedItems(newSelected);
  };

  const handleDeleteSelected = () => {
    if (selectedItems.size === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn món để xóa');
      return;
    }

    Alert.alert('Xác nhận', `Bạn có chắc muốn xóa ${selectedItems.size} món đã chọn?`, [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          selectedItems.forEach((dishId) => {
            dispatch(removeFromCart(dishId));
          });
          setSelectedItems(new Set());
        },
      },
    ]);
  };

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
        onPress: () => {
          dispatch(clearCart());
          setSelectedItems(new Set());
        },
      },
    ]);
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={64} color="#d1d1d6" />
        <Text style={styles.emptyText}>Giỏ hàng trống{'\n'}Hãy thêm món ăn vào giỏ hàng!</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
          style={styles.shopButton}
        >
          <Text style={styles.shopButtonText}>Tiếp tục mua sắm</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải thông tin món ăn...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giỏ hàng ({totalItems})</Text>
        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
          {selectedItems.size > 0 && (
            <TouchableOpacity onPress={handleDeleteSelected}>
              <Text style={styles.deleteSelectedText}>Xóa đã chọn ({selectedItems.size})</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={toggleSelectAll}>
            <Text style={styles.selectAllText}>
              {isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.list}>
        {cartItems.map((item) => {
          if (!item.dishId) return null;

          const dish = dishes[item.dishId];
          const price = dish?.price || 0;
          const imageUrl = dish?.imageUrl;
          const isSelected = selectedItems.has(item.dishId);

          return (
            <TouchableOpacity
              key={item.id}
              style={styles.item}
              onPress={() => navigation.navigate('DishDetail', { dishId: item.dishId! })}
              activeOpacity={0.7}
            >
              {/* Thùng rác ở góc trên bên phải */}
              {!isAllSelected && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    dispatch(removeFromCart(item.dishId!));
                  }}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={16} color="#ffffff" />
                </TouchableOpacity>
              )}

              {/* Checkbox */}
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  toggleSelectItem(item.dishId!);
                }}
                style={[styles.checkbox, isSelected && styles.checkboxSelected]}
              >
                {isSelected && <Ionicons name="checkmark" size={16} color="#ffffff" />}
              </TouchableOpacity>

              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.image} />
              ) : (
                <View style={[styles.image, styles.placeholderImage]}>
                  <Text style={styles.placeholderText}>?</Text>
                </View>
              )}
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.dishName}</Text>
                {price > 0 && (
                  <Text style={styles.itemPrice}>{price.toLocaleString('vi-VN')} ₫</Text>
                )}
                {item.note && <Text style={styles.note}>Ghi chú: {item.note}</Text>}
                {dish?.description && (
                  <Text style={styles.description} numberOfLines={1}>
                    {dish.description}
                  </Text>
                )}

                {/* Quantity Control */}
                <View style={styles.quantityControl}>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      dispatch(
                        updateQuantity({
                          dishId: item.dishId!,
                          quantity: Math.max(1, item.quantity - 1),
                        })
                      );
                    }}
                    style={styles.quantityButton}
                  >
                    <Ionicons name="remove" size={18} color="#111" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      dispatch(
                        updateQuantity({ dishId: item.dishId!, quantity: item.quantity + 1 })
                      );
                    }}
                    style={styles.quantityButton}
                  >
                    <Ionicons name="add" size={18} color="#111" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.priceContainer}>
                {price > 0 ? (
                  <Text style={styles.price}>
                    {(price * item.quantity).toLocaleString('vi-VN')} ₫
                  </Text>
                ) : (
                  <Text style={styles.priceUnavailable}>Chưa có giá</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          {selectedCartItems.length > 0 && (
            <View style={styles.selectedInfo}>
              <Text style={styles.selectedInfoText}>Đang chọn {selectedCartItems.length} món</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Số món:</Text>
            <Text style={styles.summaryValue}>{totalItems}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng tiền:</Text>
            <Text style={styles.totalPrice}>{totalPrice.toLocaleString('vi-VN')} ₫</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.actions}>
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
  header: {
    backgroundColor: '#ffffff',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5ea',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    flex: 1,
    textAlign: 'center',
  },
  deleteSelectedText: {
    fontSize: 14,
    color: '#ff3b30',
    fontWeight: '600',
  },
  selectAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: { fontSize: 18, color: '#666', marginBottom: 16, textAlign: 'center' },
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
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ff3b30',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d1d6',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
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
  itemName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  itemPrice: { fontSize: 14, fontWeight: '700', color: '#ef4444', marginBottom: 8 },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    minWidth: 30,
    textAlign: 'center',
  },
  note: { fontSize: 12, color: '#e67e22', fontStyle: 'italic', marginTop: 2 },
  description: { fontSize: 11, color: '#999', marginTop: 2 },
  priceContainer: { alignItems: 'flex-end' },
  price: { fontSize: 16, fontWeight: '600', color: '#d32f2f' },
  priceUnavailable: { fontSize: 14, color: '#999', fontStyle: 'italic' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: { marginTop: 12, fontSize: 14, color: '#666' },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  selectedInfo: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5ea',
  },
  selectedInfoText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: { fontSize: 16, color: '#666' },
  summaryValue: { fontSize: 18, fontWeight: '700', color: '#111' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
  },
  totalLabel: { fontSize: 18, fontWeight: '700', color: '#111' },
  totalPrice: { fontSize: 24, fontWeight: '700', color: '#ef4444' },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
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
