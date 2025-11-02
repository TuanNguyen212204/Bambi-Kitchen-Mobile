import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAppDispatch, useAppSelector } from '@store/store';
import { fetchCategories } from '@store/slices/ingredientSlice';
import { createCategory, deleteCategory, updateCategory } from '@services/api';
import { toast } from '@utils/toast';
import { useNavigation } from '@react-navigation/native';

const IngredientCategoryListScreen = () => {
  const dispatch = useAppDispatch();
  const { categories = [], loading = false } = useAppSelector((s) => s.ingredient || {});
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const onCreate = async () => {
    if (!name.trim()) return toast.error('Tên danh mục bắt buộc');
    try {
      await createCategory({ name: name.trim(), description: description || undefined });
      setName('');
      setDescription('');
      dispatch(fetchCategories());
      toast.success('Đã tạo danh mục');
    } catch (e: any) {
      toast.error(e?.toString?.() || 'Lỗi tạo danh mục');
    }
  };

  const onUpdate = async (id: number, currentName: string, currentDesc?: string) => {
    const newName = currentName;
    try {
      await updateCategory({ id, name: newName, description: currentDesc });
      dispatch(fetchCategories());
      toast.success('Đã cập nhật danh mục');
    } catch (e: any) {
      toast.error(e?.toString?.() || 'Lỗi cập nhật danh mục');
    }
  };

  const onDelete = async (id: number) => {
    Alert.alert('Xoá danh mục', 'Bạn có chắc muốn xoá?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCategory(id);
            dispatch(fetchCategories());
            toast.success('Đã xoá danh mục');
          } catch (e: any) {
            toast.error(e?.toString?.() || 'Lỗi xoá danh mục');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh mục nguyên liệu</Text>
      <TextInput placeholder="Tìm kiếm danh mục..." value={search} onChangeText={setSearch} style={[styles.input, { marginBottom: 8 }]} />
      <TouchableOpacity onPress={() => navigation.navigate('AdminIngredientCategoryForm', { mode: 'create' })} style={styles.createBtn}>
        <Text style={{ color: 'white', fontWeight: '600' }}>+ Thêm danh mục</Text>
      </TouchableOpacity>

      {loading && <Text style={styles.loading}>Đang tải...</Text>}

      <FlatList
        data={categories?.filter(c => !search || c.name?.toLowerCase().includes(search.toLowerCase())) || []}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('AdminIngredientCategoryForm', { mode: 'edit', categoryId: item.id })} style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              {!!item.description && <Text style={styles.desc}>{item.description}</Text>}
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity onPress={() => navigation.navigate('AdminIngredientCategoryForm', { mode: 'edit', categoryId: item.id })} style={styles.smallBtn}><Text>Sửa</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.smallBtn}><Text>Xoá</Text></TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  row: { gap: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10 },
  createBtn: { backgroundColor: '#007AFF', padding: 12, alignItems: 'center', borderRadius: 8, alignSelf: 'flex-start', marginBottom: 8 },
  loading: { textAlign: 'center', marginVertical: 12 },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    padding: 14, marginBottom: 10, borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  name: { fontWeight: '700', fontSize: 15 },
  desc: { color: '#6b7280', marginTop: 2 },
  smallBtn: { paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, backgroundColor: '#fff' },
});

export default IngredientCategoryListScreen;


