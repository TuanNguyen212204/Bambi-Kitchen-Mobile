import React, { useEffect, useMemo, useState, useRef } from 'react';
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { dishService, type DishDto } from '@services/api/dishService';
import { useAppSelector } from '@store/store';
import { COLORS } from '@constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Screen = styled.ScrollView`
  flex: 1;
  background-color: #f5f5f5;
`;

const Header = styled.View`
  background-color: #ef4444;
  padding: 44px 20px 16px 20px;
`;

const HeaderTop = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const WelcomeText = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
`;

const SearchContainer = styled.View`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 8px 12px;
  flex-direction: row;
  align-items: center;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 14px;
  margin-left: 8px;
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
  showsHorizontalScrollIndicator: false 
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
  showsHorizontalScrollIndicator: false 
})`
  padding-horizontal: 16px;
`;

const DishCard = styled.TouchableOpacity`
  width: 140px;
  margin-right: 12px;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const DishImage = styled.Image`
  width: 100%;
  height: 100px;
  resize-mode: cover;
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
  overflow: hidden;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const HomeScreen = () => {
  const user = useAppSelector((s) => s.auth.user);
  const [dishes, setDishes] = useState<DishDto[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
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
        const [ds, cats] = await Promise.all([
          dishService.getAll(),
          dishService.getCategories(),
        ]);
        setDishes(Array.isArray(ds) ? ds : []);
        setCategories(Array.isArray(cats) ? cats : []);
      } catch (e) {
        setDishes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-scroll banner
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

  const visible = useMemo(() => dishes.filter((d) => (d as any).public !== false && ((d as any).active ?? true)), [dishes]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return visible.filter((d) => {
      const byQ = !q || d.name?.toLowerCase().includes(q) || d.description?.toLowerCase().includes(q);
      const byCat = !categoryId || d.categoryId === categoryId;
      return byQ && byCat;
    });
  }, [visible, query, categoryId]);

  const featured = filtered.slice(0, 5);
  const rest = filtered.slice(5);

  return (
    <Screen showsVerticalScrollIndicator={false}>
      <Header>
        <HeaderTop>
          <WelcomeText>Xin chào{user?.name ? `, ${user.name}` : ''} 👋</WelcomeText>
        </HeaderTop>
        <SearchContainer>
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

      <Section>
        <SectionHeader>
          <SectionTitle>Danh mục</SectionTitle>
        </SectionHeader>
        <CategoryRow>
          <CategoryChip active={!categoryId} onPress={() => setCategoryId(undefined)}>
            <CategoryText active={!categoryId}>Tất cả</CategoryText>
          </CategoryChip>
          {categories.map((c) => (
            <CategoryChip key={c.id} active={categoryId === c.id} onPress={() => setCategoryId(c.id)}>
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
              <DishCard key={item.id}>
                <DishImage
                  source={{ uri: item.imageUrl || 'https://via.placeholder.com/300x200.png?text=Dish' }}
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
              <DishGridCard key={item.id}>
                <DishImage
                  source={{ uri: item.imageUrl || 'https://via.placeholder.com/300x200.png?text=Dish' }}
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
    </Screen>
  );
};

export default HomeScreen;
