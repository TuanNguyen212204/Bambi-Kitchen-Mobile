import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { dishService, type DishDto } from '@services/api/dishService';
import { useAppSelector } from '@store/store';

const Screen = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const Header = styled.View`
  padding: 20px 20px 8px 20px;
`;

const Title = styled.Text`
  font-size: 24px;
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
  padding: 6px 12px;
  border-radius: 12px;
  background-color: ${(p) => (p.active ? '#ef4444' : '#f3f4f6')};
  margin-right: 8px;
`;

const ChipText = styled.Text<{ active?: boolean }>`
  color: ${(p) => (p.active ? '#fff' : '#111')};
  font-weight: 600;
  font-size: 13px;
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

const HomeScreen = () => {
  const user = useAppSelector((s) => s.auth.user);
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

  const visible = useMemo(() => dishes.filter((d) => (d as any).public !== false && ((d as any).active ?? true)), [dishes]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return visible.filter((d) => {
      const byQ = !q || d.name?.toLowerCase().includes(q) || d.description?.toLowerCase().includes(q);
      const byCat = !categoryId || d.categoryId === categoryId;
      return byQ && byCat;
    });
  }, [visible, query, categoryId]);

  return (
    <Screen>
      <Header>
        <Title>Xin chào{user?.name ? `, ${user.name}` : ''} 👋</Title>
        <Sub>Đặt món yêu thích của bạn</Sub>
      </Header>

      <SearchBar>
        <TextInput
          placeholder="Tìm kiếm món ăn..."
          style={{ flex: 1 }}
          value={query}
          onChangeText={setQuery}
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
        renderItem={({ item }) => (
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  counterText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginVertical: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#E8F4FD',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default HomeScreen;

