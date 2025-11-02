import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Image, Text, TextInput, View } from 'react-native';
import styled from 'styled-components/native';
import { dishService, type DishDto } from '@services/api/dishService';

const Screen = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const Header = styled.View`
  padding: 20px 20px 8px 20px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: 800;
`;

const Sub = styled.Text`
  color: #7a7a7a;
  margin-top: 4px;
`;

const SearchBar = styled.View`
  margin: 12px 20px 8px 20px;
  border-width: 1px;
  border-color: #e5e7eb;
  border-radius: 12px;
  padding: 10px 12px;
  flex-direction: row;
  align-items: center;
`;

const ChipRow = styled.ScrollView.attrs({ horizontal: true, showsHorizontalScrollIndicator: false })`
  padding: 0 16px 8px 16px;
`;

const Chip = styled.TouchableOpacity<{ active?: boolean }>`
  padding: 8px 14px;
  border-radius: 16px;
  background-color: ${(p) => (p.active ? '#ef4444' : '#f3f4f6')};
  margin-right: 8px;
`;

const ChipText = styled.Text<{ active?: boolean }>`
  color: ${(p) => (p.active ? '#fff' : '#111')};
  font-weight: 600;
`;

const Card = styled.TouchableOpacity`
  background-color: #fff;
  border-radius: 16px;
  padding: 12px;
  border-width: 1px;
  border-color: #f1f5f9;
`;

const Price = styled.Text`
  color: #ef4444;
  font-weight: 800;
`;

const MenuScreen = () => {
  const [dishes, setDishes] = useState<DishDto[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);

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

  // API /api/dish đã filter chỉ trả về dish public=true và active=true rồi
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return dishes.filter((d) => {
      const byQ = !q || d.name?.toLowerCase().includes(q) || d.description?.toLowerCase().includes(q);
      const byCat = !categoryId || d.categoryId === categoryId;
      return byQ && byCat;
    });
  }, [dishes, query, categoryId]);

  return (
    <Screen>
      <Header>
        <Title>Thực đơn</Title>
        <Sub>Lọc theo danh mục, tìm theo tên/miêu tả</Sub>
      </Header>

      <SearchBar>
        <TextInput
          placeholder="Tìm món theo tên..."
          style={{ flex: 1 }}
          value={query}
          onChangeText={setQuery}
          autoCorrect={true}
          autoCapitalize="words"
          keyboardType="default"
          textContentType="none"
          enablesReturnKeyAutomatically={false}
        />
      </SearchBar>

      <ChipRow>
        <Chip active={!categoryId} onPress={() => setCategoryId(undefined)}>
          <ChipText active={!categoryId}>Tất cả</ChipText>
        </Chip>
        {categories.map((c) => (
          <Chip key={c.id} active={categoryId===c.id} onPress={() => setCategoryId(c.id)}>
            <ChipText active={categoryId===c.id}>{c.name}</ChipText>
          </Chip>
        ))}
      </ChipRow>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: 24, gap: 12 }}
        renderItem={({ item, index }) => (
          <Card style={{ flex: 1 }}>
            <Image
              source={{ uri: item.imageUrl || 'https://via.placeholder.com/300x200.png?text=Dish' }}
              style={{ width: '100%', height: 110, borderRadius: 12, marginBottom: 8 }}
              resizeMode="cover"
            />
            <Text style={{ fontWeight: '700' }} numberOfLines={1}>{item.name}</Text>
            {!!item.description && (
              <Text style={{ color: '#6b7280' }} numberOfLines={1}>{item.description}</Text>
            )}
            {!!item.price && <Price>{item.price?.toLocaleString('vi-VN')} ₫</Price>}
          </Card>
        )}
        ListEmptyComponent={!loading ? (
          <View style={{ padding: 24 }}>
            <Text>Không có món nào.</Text>
          </View>
        ) : null}
      />
    </Screen>
  );
};

export default MenuScreen;


