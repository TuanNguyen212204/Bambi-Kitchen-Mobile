import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { dishService, type DishDto } from '@services/api/dishService';
import { orderService } from '@services/api/orderService';
import { FeedbackDto } from '@/types/api';
import { useAppSelector } from '@store/store';
import { COLORS } from '@constants';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Screen = styled.ScrollView`
  flex: 1;
  background-color: #f5f5f5;
`;

const Header = styled.View`
  background-color: #ef4444;
  padding: 20px 16px 12px 16px;
`;

const SearchContainer = styled.View`
  background-color: #ffffff;
  border-radius: 8px;
  padding-horizontal: 12px;
  flex-direction: row;
  align-items: center;
  height: 36px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 14px;
  margin-left: 8px;
  line-height: 20px;
  padding-vertical: 0;
`;

const BannerContainer = styled.View`
  height: 160px;
  margin-bottom: 8px;
`;

const BannerImage = styled.Image`
  width: ${SCREEN_WIDTH}px;
  height: 160px;
  resize-mode: cover;
`;

const BannerPagination = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: -20px;
  position: relative;
  z-index: 1;
`;

const PaginationDot = styled.View<{ active?: boolean }>`
  width: ${(p) => (p.active ? 24 : 8)}px;
  height: 8px;
  border-radius: 4px;
  background-color: ${(p) => (p.active ? '#ffffff' : 'rgba(255,255,255,0.5)')};
  margin-horizontal: 4px;
`;

const Section = styled.View`
  background-color: #ffffff;
  margin-top: 8px;
  padding-vertical: 16px;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 20px;
  margin-bottom: 12px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #111;
`;

const SectionMore = styled.Text`
  font-size: 14px;
  color: #ef4444;
  font-weight: 600;
`;

const CategoryRow = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})`
  padding-horizontal: 12px;
`;

const CategoryChip = styled.TouchableOpacity<{ active?: boolean }>`
  background-color: ${(p) => (p.active ? '#ef4444' : '#f3f4f6')};
  padding-vertical: 6px;
  padding-horizontal: 12px;
  border-radius: 20px;
  margin-right: 8px;
  min-width: 80px;
  align-items: center;
`;

const CategoryText = styled.Text<{ active?: boolean }>`
  color: ${(p) => (p.active ? '#ffffff' : '#111')};
  font-weight: 600;
  font-size: 12px;
`;

const DishRow = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})`
  padding-horizontal: 16px;
`;

const DishCard = styled.TouchableOpacity`
  width: 140px;
  margin-right: 12px;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: visible;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 3;
  margin-bottom: 8px;
`;

const DishImage = styled.Image`
  width: 100%;
  height: 120px;
  resize-mode: cover;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`;

const DishInfo = styled.View`
  padding: 8px;
`;

const DishName = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: #111;
  margin-bottom: 4px;
`;

const DishPrice = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #ef4444;
`;

const DishesGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding-horizontal: 12px;
  padding-top: 8px;
`;

const DishGridCard = styled.TouchableOpacity`
  width: ${(SCREEN_WIDTH - 36) / 2}px;
  margin: 6px;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: visible;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 3;
  margin-bottom: 12px;
`;

const OrderBuilderButton = styled.TouchableOpacity`
  background-color: #007aff;
  border-radius: 12px;
  padding: 16px;
  margin: 12px 16px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 3;
`;

const OrderBuilderText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  margin-left: 8px;
`;

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const user = useAppSelector((s) => s.auth.user);
  const cartItems = useAppSelector((s) => s.cart.items);
  const [dishes, setDishes] = useState<DishDto[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerScrollRef = useRef<any>(null);

  const banners = [
    require('../../../../assets/HomePage/WelcomePagePic.png'),
    require('../../../../assets/HomePage/OurExpectsChefPic.png'),
    require('../../../../assets/HomePage/dish-2 1.png'),
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ds, cats, fbs] = await Promise.all([
          dishService.getAll(),
          dishService.getCategories(),
          orderService.getFeedbacks(),
        ]);
        setDishes(Array.isArray(ds) ? ds : []);
        setCategories(Array.isArray(cats) ? cats : []);
        // Chỉ hiển thị feedbacks > 3 sao
        const highRatingFeedbacks = (Array.isArray(fbs) ? fbs : []).filter(
          (fb: FeedbackDto) => fb.ranking && fb.ranking > 3
        );
        setFeedbacks(highRatingFeedbacks);
      } catch (e) {
        setDishes([]);
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => {
        const next = (prev + 1) % banners.length;
        bannerScrollRef.current?.scrollTo({
          x: next * SCREEN_WIDTH,
          animated: true,
        });
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const visible = useMemo(
    () => dishes.filter((d) => (d as any).public !== false && ((d as any).active ?? true)),
    [dishes]
  );
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return visible.filter((d) => {
      const byQ =
        !q || d.name?.toLowerCase().includes(q) || d.description?.toLowerCase().includes(q);
      const byCat = !categoryId || d.categoryId === categoryId;
      return byQ && byCat;
    });
  }, [visible, query, categoryId]);

  const featured = filtered.slice(0, 5);
  const rest = filtered.slice(5);

  return (
    <Screen showsVerticalScrollIndicator={false}>
      <Header>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <SearchContainer style={{ flex: 1 }}>
            <Image
              source={require('../../../../assets/logo.png')}
              style={{ width: 20, height: 20 }}
            />
            <SearchInput
              placeholder="Tìm kiếm món ăn..."
              value={query}
              onChangeText={setQuery}
              placeholderTextColor="#999"
            />
          </SearchContainer>
          <TouchableOpacity
            onPress={() => navigation.navigate('MainTabs', { screen: 'Cart' })}
            style={{ position: 'relative', padding: 8 }}
          >
            <Ionicons name="cart-outline" size={24} color="#ffffff" />
            {cartItems.length > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  backgroundColor: '#ff3b30',
                  borderRadius: 10,
                  minWidth: 20,
                  height: 20,
                  paddingHorizontal: 6,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '700' }}>
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </Header>

      <BannerContainer>
        <ScrollView
          ref={bannerScrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setCurrentBannerIndex(index);
          }}
        >
          {banners.map((banner, index) => (
            <BannerImage key={index} source={banner} />
          ))}
        </ScrollView>
        <BannerPagination>
          {banners.map((_, index) => (
            <PaginationDot key={index} active={index === currentBannerIndex} />
          ))}
        </BannerPagination>
      </BannerContainer>

      <OrderBuilderButton onPress={() => navigation.navigate('OrderBuilder')}>
        <Text style={{ color: '#ffffff', fontSize: 20 }}>🍽️</Text>
        <OrderBuilderText>Tạo món theo từng bước</OrderBuilderText>
      </OrderBuilderButton>

      <Section>
        <SectionHeader>
          <SectionTitle>Danh mục</SectionTitle>
        </SectionHeader>
        <CategoryRow>
          <CategoryChip active={!categoryId} onPress={() => setCategoryId(undefined)}>
            <CategoryText active={!categoryId}>Tất cả</CategoryText>
          </CategoryChip>
          {categories.map((c) => (
            <CategoryChip
              key={c.id}
              active={categoryId === c.id}
              onPress={() => setCategoryId(c.id)}
            >
              <CategoryText active={categoryId === c.id}>{c.name}</CategoryText>
            </CategoryChip>
          ))}
        </CategoryRow>
      </Section>

      {featured.length > 0 && (
        <Section>
          <SectionHeader>
            <SectionTitle>Món ăn nổi bật</SectionTitle>
            <TouchableOpacity onPress={() => setCategoryId(undefined)}>
              <SectionMore>Xem tất cả &gt;</SectionMore>
            </TouchableOpacity>
          </SectionHeader>
          <DishRow>
            {featured.map((item) => (
              <DishCard
                key={item.id}
                onPress={() => navigation.navigate('DishDetail', { dishId: item.id })}
              >
                <DishImage
                  source={{
                    uri: item.imageUrl || 'https://via.placeholder.com/300x200.png?text=Dish',
                  }}
                />
                <DishInfo>
                  <DishName numberOfLines={1}>{item.name}</DishName>
                  {!!item.price && <DishPrice>{item.price?.toLocaleString('vi-VN')} ₫</DishPrice>}
                </DishInfo>
              </DishCard>
            ))}
          </DishRow>
        </Section>
      )}

      {rest.length > 0 && (
        <Section>
          <SectionHeader>
            <SectionTitle>Tất cả món ăn</SectionTitle>
          </SectionHeader>
          <DishesGrid>
            {rest.map((item) => (
              <DishGridCard
                key={item.id}
                onPress={() => navigation.navigate('DishDetail', { dishId: item.id })}
              >
                <DishImage
                  source={{
                    uri: item.imageUrl || 'https://via.placeholder.com/300x200.png?text=Dish',
                  }}
                />
                <DishInfo>
                  <DishName numberOfLines={2} style={{ fontSize: 14 }}>
                    {item.name}
                  </DishName>
                  {!!item.price && <DishPrice>{item.price?.toLocaleString('vi-VN')} ₫</DishPrice>}
                </DishInfo>
              </DishGridCard>
            ))}
          </DishesGrid>
        </Section>
      )}

      {feedbacks.length > 0 && (
        <Section>
          <SectionHeader>
            <SectionTitle>Đánh giá từ khách hàng</SectionTitle>
          </SectionHeader>
          <View style={{ paddingHorizontal: 16 }}>
            {feedbacks.slice(0, 5).map((fb, idx) => (
              <View
                key={idx}
                style={{
                  backgroundColor: '#f9f9f9',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600' }}>
                    {fb.accountName || 'Khách hàng'}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#666', marginLeft: 8 }}>
                    {'⭐'.repeat(fb.ranking || 0)}
                  </Text>
                </View>
                {fb.comment && (
                  <Text style={{ fontSize: 13, color: '#444', fontStyle: 'italic' }}>
                    "{fb.comment}"
                  </Text>
                )}
              </View>
            ))}
          </View>
        </Section>
      )}
    </Screen>
  );
};

export default HomeScreen;
