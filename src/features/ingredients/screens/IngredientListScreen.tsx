import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, Image, TextInput, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useAppDispatch, useAppSelector } from '@store/store';
import { adjustStockThunk, fetchAllIngredients, fetchCategories, setFilters, toggleActiveThunk } from '@store/slices/ingredientSlice';
import { useNavigation } from '@react-navigation/native';
import { toast } from '@utils/toast';

const IngredientListScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const { ingredients = [], categories = [], loading = false, filters = {} } = useAppSelector((s) => s.ingredient || {});
  const [keyword, setKeyword] = useState(filters.keyword || '');

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAllIngredients());
  }, [dispatch]);

  const filtered = useMemo(() => {
    return ingredients.filter((i) => {
      if (filters.categoryId && i.category?.id !== filters.categoryId) return false;
      if (filters.status === 'active' && i.active === false) return false;
      if (filters.status === 'inactive' && i.active !== false) return false;
      if (filters.stockStatus && filters.stockStatus !== 'all' && i.stockStatus !== filters.stockStatus) return false;
      if (keyword && !i.name.toLowerCase().includes(keyword.toLowerCase())) return false;
      return true;
    });
  }, [ingredients, filters, keyword]);

  const onToggle = async (id: number) => {
    try {
      await dispatch(toggleActiveThunk(id)).unwrap();
      toast.success('Đã cập nhật trạng thái');
    } catch (e: any) {
      toast.error(e?.toString?.() || 'Lỗi cập nhật trạng thái');
    }
  };

  const onAdjust = async (id: number, delta: number) => {
    try {
      await dispatch(adjustStockThunk({ ingredientId: id, quantity: Math.abs(delta), transactionType: delta > 0 })).unwrap();
      toast.success('Đã điều chỉnh tồn kho');
    } catch (e: any) {
      toast.error(e?.toString?.() || 'Lỗi điều chỉnh tồn kho');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <TextInput
          placeholder="Tìm theo tên..."
          value={keyword}
          onChangeText={setKeyword}
          style={styles.search}
          autoCorrect={true}
          autoCapitalize="words"
          keyboardType="default"
          textContentType="none"
          enablesReturnKeyAutomatically={false}
        />
        <Text style={styles.sectionLabel}>Danh mục</Text>
        <View style={styles.catRow}>
          <TouchableOpacity onPress={() => dispatch(setFilters({ categoryId: null }))} style={[styles.chip, !filters.categoryId && styles.chipActive]}>
            <Text style={!filters.categoryId ? styles.chipTextActive : undefined}>Tất cả</Text>
          </TouchableOpacity>
          <FlatList
            data={categories}
            keyExtractor={(c) => String(c.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.catListContent}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => dispatch(setFilters({ categoryId: item.id }))} style={[styles.chip, filters.categoryId === item.id && styles.chipActive]}>
                <Text style={filters.categoryId === item.id ? styles.chipTextActive : undefined}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <Text style={styles.sectionLabel}>Trạng thái</Text>
        <View style={styles.segmentGroup}>
          {(['all','active','inactive'] as const).map((s) => (
            <TouchableOpacity key={s} onPress={() => dispatch(setFilters({ status: s }))} style={[styles.segmentItem, filters.status === s && styles.segmentItemActive]}>
              <Text style={filters.status === s ? styles.segmentItemTextActive : styles.segmentItemText}>{s === 'all' ? 'Tất cả' : s === 'active' ? 'Đang hoạt động' : 'Ngưng hoạt động'}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('AdminIngredientForm', { mode: 'create' })}
          style={styles.createBtn}><Text style={{ color: 'white', fontWeight: '600' }}>+ Thêm</Text></TouchableOpacity>
      </View>

      {loading && <Text style={styles.loading}>Đang tải...</Text>}

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('AdminIngredientDetail', { ingredientId: item.id })} style={styles.card}>
            <Image source={item.imgUrl ? { uri: item.imgUrl } : undefined as any} style={styles.image} />
            <View style={styles.info}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.name}>{item.name}</Text>
                <Switch value={!!item.active} onValueChange={() => onToggle(item.id)} />
              </View>
              <Text style={styles.meta}>Đơn vị: {item.unit} • Tồn: {item.stock} ({item.stockStatus})</Text>
              {!!item.category?.name && <Text style={styles.meta}>Danh mục: {item.category.name}</Text>}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  controls: { marginBottom: 8 },
  search: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 8 },
  sectionLabel: { marginTop: 8, marginBottom: 6, color: '#6b7280' },
  catRow: { flexDirection: 'row', alignItems: 'center' },
  catListContent: { paddingRight: 4 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 20, marginRight: 8, backgroundColor: '#fff' },
  chipActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  chipTextActive: { color: 'white', fontWeight: '600' },
  segmentGroup: { flexDirection: 'row', backgroundColor: '#f3f4f6', borderRadius: 12, padding: 4, gap: 6 },
  segmentItem: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  segmentItemActive: { backgroundColor: 'white', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  segmentItemText: { color: '#374151' },
  segmentItemTextActive: { color: '#111827', fontWeight: '600' },
  createBtn: { marginTop: 8, alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 14, backgroundColor: '#007AFF', borderRadius: 10 },
  loading: { textAlign: 'center', marginVertical: 12 },
  card: {
    flexDirection: 'row', padding: 12, marginBottom: 12, borderRadius: 14,
    backgroundColor: 'white',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  image: { width: 64, height: 64, borderRadius: 10, backgroundColor: '#f3f4f6' },
  info: { flex: 1, marginLeft: 10 },
  name: { fontWeight: '700', fontSize: 16 },
  meta: { color: '#6b7280', marginTop: 2 },
  actions: { flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap' },
  smallBtn: { paddingVertical: 6, paddingHorizontal: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
});

export default IngredientListScreen;


