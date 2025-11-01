import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { dishService, type DishDto } from '@services/api/dishService';
import { useAppDispatch, useAppSelector } from '@store/store';
import { addToCart } from '@store/slices/cartSlice';
import Button from '@components/common/Button';

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #ffffff;
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
`;

const DishImage = styled.Image`
  width: 100%;
  height: 300px;
  resize-mode: cover;
`;

const DishInfo = styled.View`
  padding: 20px;
`;

const DishName = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #111;
  margin-bottom: 8px;
`;

const DishPrice = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: #ef4444;
  margin-bottom: 16px;
`;

const DishDescription = styled.Text`
  font-size: 16px;
  color: #666;
  line-height: 24px;
  margin-bottom: 24px;
`;

const QuantitySection = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-top-width: 1px;
  border-top-color: #e5e5ea;
  border-bottom-width: 1px;
  border-bottom-color: #e5e5ea;
`;

const QuantityLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #111;
`;

const QuantityControl = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const QuantityButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #ef4444;
  align-items: center;
  justify-content: center;
`;

const QuantityText = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #111;
  min-width: 40px;
  text-align: center;
`;

const Footer = styled.View`
  padding: 16px;
  background-color: #ffffff;
  border-top-width: 1px;
  border-top-color: #e5e5ea;
`;

const DishDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { dishId } = route.params as { dishId: number };
  const [dish, setDish] = useState<DishDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchDish();
  }, [dishId]);

  const fetchDish = async () => {
    try {
      setLoading(true);
      const dish = await dishService.getById(dishId);
      setDish(dish);
    } catch (error) {
      console.error('Error fetching dish:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin món ăn');
      setDish(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!dish) return;

    dispatch(addToCart({ dish, quantity }));
    Alert.alert('Thành công', `Đã thêm ${quantity} ${dish.name} vào giỏ hàng!`, [
      {
        text: 'Tiếp tục mua sắm',
        onPress: () => navigation.goBack(),
      },
      {
        text: 'Xem giỏ hàng',
        style: 'default',
        onPress: () => navigation.navigate('MainTabs', { screen: 'Cart' }),
      },
    ]);
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
          <HeaderTitle>Chi tiết món ăn</HeaderTitle>
          <View style={{ width: 24 }} />
        </Header>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#ef4444" />
        </View>
      </Container>
    );
  }

  if (!dish) {
    return (
      <Container>
        <Header>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
          <HeaderTitle>Không tìm thấy</HeaderTitle>
          <View style={{ width: 24 }} />
        </Header>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
            Không tìm thấy món ăn này
          </Text>
        </View>
      </Container>
    );
  }

  const totalPrice = (dish.price || 0) * quantity;

  return (
    <Container>
      <Header>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <HeaderTitle>Chi tiết món ăn</HeaderTitle>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Cart' })}>
          <Ionicons name="cart-outline" size={24} color="#111" />
        </TouchableOpacity>
      </Header>

      <Content>
        <DishImage
          source={{
            uri: dish.imageUrl || 'https://via.placeholder.com/400x300.png?text=Dish',
          }}
        />
        <DishInfo>
          <DishName>{dish.name}</DishName>
          {dish.price && <DishPrice>{dish.price.toLocaleString('vi-VN')} ₫</DishPrice>}
          {dish.description && <DishDescription>{dish.description}</DishDescription>}
        </DishInfo>

        <QuantitySection>
          <QuantityLabel>Số lượng</QuantityLabel>
          <QuantityControl>
            <QuantityButton
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              style={{ opacity: quantity <= 1 ? 0.5 : 1 }}
            >
              <Ionicons name="remove" size={24} color="#ffffff" />
            </QuantityButton>
            <QuantityText>{quantity}</QuantityText>
            <QuantityButton onPress={() => setQuantity(quantity + 1)}>
              <Ionicons name="add" size={24} color="#ffffff" />
            </QuantityButton>
          </QuantityControl>
        </QuantitySection>
      </Content>

      <Footer>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 14, color: '#666' }}>Tổng tiền:</Text>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#ef4444' }}>
            {totalPrice.toLocaleString('vi-VN')} ₫
          </Text>
        </View>
        <Button title="Thêm vào giỏ hàng" onPress={handleAddToCart} fullWidth />
      </Footer>
    </Container>
  );
};

export default DishDetailScreen;
