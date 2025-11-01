import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@store/store';
import { removeFromCart, updateQuantity, clearCart } from '@store/slices/cartSlice';
import { orderService } from '@services/api/orderService';
import Button from '@components/common/Button';

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #f5f5f5;
`;

const Header = styled.View`
  background-color: #ffffff;
  padding: 12px 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: #e5e5ea;
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #111;
  flex: 1;
  text-align: center;
`;

const Content = styled(ScrollView)`
  flex: 1;
  padding: 16px;
`;

const CartItemCard = styled.View`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
  flex-direction: row;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
  position: relative;
`;

const ItemImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  margin-right: 12px;
`;

const ItemInfo = styled.View`
  flex: 1;
`;

const ItemName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #111;
  margin-bottom: 4px;
`;

const ItemPrice = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #ef4444;
  margin-bottom: 8px;
`;

const QuantityControl = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const QuantityButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #f3f4f6;
  align-items: center;
  justify-content: center;
`;

const QuantityText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #111;
  min-width: 30px;
  text-align: center;
`;

const RemoveButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #ff3b30;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
`;

const EmptyCart = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const EmptyCartText = styled.Text`
  font-size: 18px;
  color: #666;
  text-align: center;
  margin-top: 16px;
`;

const SummaryCard = styled.View`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
`;

const SummaryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const SummaryLabel = styled.Text`
  font-size: 16px;
  color: #666;
`;

const SummaryValue = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #111;
`;

const TotalRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-top: 12px;
  border-top-width: 1px;
  border-top-color: #e5e5ea;
`;

const TotalLabel = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #111;
`;

const TotalValue = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #ef4444;
`;

const Footer = styled.View`
  padding: 16px;
  background-color: #ffffff;
  border-top-width: 1px;
  border-top-color: #e5e5ea;
`;

const CartScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((s) => s.cart.items);
  const user = useAppSelector((s) => s.auth.user);
  const [submitting, setSubmitting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  const selectedCartItems = useMemo(() => {
    return cartItems.filter((item) => selectedItems.has(item.dish.id));
  }, [cartItems, selectedItems]);

  const totalPrice = useMemo(() => {
    return selectedCartItems.length > 0
      ? selectedCartItems.reduce((sum, item) => sum + (item.dish.price || 0) * item.quantity, 0)
      : cartItems.reduce((sum, item) => sum + (item.dish.price || 0) * item.quantity, 0);
  }, [cartItems, selectedCartItems]);

  const totalItems = useMemo(() => {
    return selectedCartItems.length > 0
      ? selectedCartItems.reduce((sum, item) => sum + item.quantity, 0)
      : cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems, selectedCartItems]);

  const isAllSelected = cartItems.length > 0 && selectedItems.size === cartItems.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map((item) => item.dish.id)));
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

  const handlePlaceOrder = async () => {
    if (!user?.id) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để đặt hàng');
      return;
    }

    const itemsToOrder = selectedCartItems.length > 0 ? selectedCartItems : cartItems;

    if (itemsToOrder.length === 0) {
      Alert.alert('Lỗi', 'Giỏ hàng trống');
      return;
    }

    setSubmitting(true);
    try {
      const orderTotalPrice = itemsToOrder.reduce(
        (sum, item) => sum + (item.dish.price || 0) * item.quantity,
        0
      );

      const order = await orderService.createOrder({
        accountId: user.id as number,
        paymentMethod: 'COD',
        items: itemsToOrder.map((item) => ({
          dishId: item.dish.id,
          quantity: item.quantity,
          note: item.note,
        })),
        totalPrice: orderTotalPrice,
      });

      Alert.alert(
        'Thành công',
        `Đơn hàng #${order.code || order.id} đã được đặt! Tổng tiền: ${orderTotalPrice.toLocaleString('vi-VN')} ₫`,
        [
          {
            text: 'OK',
            onPress: () => {
              if (selectedCartItems.length > 0) {
                selectedItems.forEach((dishId) => {
                  dispatch(removeFromCart(dishId));
                });
                setSelectedItems(new Set());
              } else {
                dispatch(clearCart());
              }
              navigation.navigate('MainTabs', { screen: 'Home' });
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Error placing order:', error);
      Alert.alert('Lỗi', error?.message || 'Không thể đặt hàng. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container>
        <Header>
          <HeaderTitle>Giỏ hàng</HeaderTitle>
          <TouchableOpacity onPress={toggleSelectAll}>
            <Text style={{ fontSize: 14, color: '#007AFF', fontWeight: '600' }}>
              {isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </Text>
          </TouchableOpacity>
        </Header>
        <EmptyCart>
          <Ionicons name="cart-outline" size={64} color="#d1d1d6" />
          <EmptyCartText>Giỏ hàng trống{'\n'}Hãy thêm món ăn vào giỏ hàng!</EmptyCartText>
          <Button
            title="Tiếp tục mua sắm"
            onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
            style={{ marginTop: 24 }}
          />
        </EmptyCart>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderTitle>Giỏ hàng ({totalItems})</HeaderTitle>
        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
          {selectedItems.size > 0 && (
            <TouchableOpacity onPress={handleDeleteSelected}>
              <Text style={{ fontSize: 14, color: '#ff3b30', fontWeight: '600' }}>
                Xóa đã chọn ({selectedItems.size})
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={toggleSelectAll}>
            <Text style={{ fontSize: 14, color: '#007AFF', fontWeight: '600' }}>
              {isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </Text>
          </TouchableOpacity>
        </View>
      </Header>

      <Content>
        {cartItems.map((item) => {
          const isSelected = selectedItems.has(item.dish.id);
          return (
            <CartItemCard key={item.dish.id}>
              {/* Thùng rác ở góc trên bên phải */}
              {!isAllSelected && (
                <TouchableOpacity
                  onPress={() => dispatch(removeFromCart(item.dish.id))}
                  style={{
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
                  }}
                >
                  <Ionicons name="trash-outline" size={16} color="#ffffff" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => toggleSelectItem(item.dish.id)}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: isSelected ? '#007AFF' : '#d1d1d6',
                  backgroundColor: isSelected ? '#007AFF' : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                {isSelected && <Ionicons name="checkmark" size={16} color="#ffffff" />}
              </TouchableOpacity>
              <ItemImage
                source={{
                  uri: item.dish.imageUrl || 'https://via.placeholder.com/80x80.png?text=Dish',
                }}
              />
              <ItemInfo>
                <ItemName>{item.dish.name}</ItemName>
                <ItemPrice>{(item.dish.price || 0).toLocaleString('vi-VN')} ₫</ItemPrice>
                <QuantityControl>
                  <QuantityButton
                    onPress={() =>
                      dispatch(
                        updateQuantity({
                          dishId: item.dish.id,
                          quantity: Math.max(1, item.quantity - 1),
                        })
                      )
                    }
                  >
                    <Ionicons name="remove" size={18} color="#111" />
                  </QuantityButton>
                  <QuantityText>{item.quantity}</QuantityText>
                  <QuantityButton
                    onPress={() =>
                      dispatch(
                        updateQuantity({ dishId: item.dish.id, quantity: item.quantity + 1 })
                      )
                    }
                  >
                    <Ionicons name="add" size={18} color="#111" />
                  </QuantityButton>
                </QuantityControl>
              </ItemInfo>
            </CartItemCard>
          );
        })}

        <SummaryCard>
          {selectedCartItems.length > 0 && (
            <View
              style={{
                marginBottom: 12,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#e5e5ea',
              }}
            >
              <Text style={{ fontSize: 12, color: '#007AFF', fontWeight: '600' }}>
                Đang chọn {selectedCartItems.length} món
              </Text>
            </View>
          )}
          <SummaryRow>
            <SummaryLabel>Số món:</SummaryLabel>
            <SummaryValue>{totalItems}</SummaryValue>
          </SummaryRow>
          <TotalRow>
            <TotalLabel>Tổng tiền:</TotalLabel>
            <TotalValue>{totalPrice.toLocaleString('vi-VN')} ₫</TotalValue>
          </TotalRow>
        </SummaryCard>
      </Content>

      <Footer>
        <Button title="Đặt hàng" onPress={handlePlaceOrder} loading={submitting} fullWidth />
      </Footer>
    </Container>
  );
};

export default CartScreen;
