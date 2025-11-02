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
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

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

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    const filteredCats = categories?.filter(c => !search || c.name?.toLowerCase().includes(search.toLowerCase())) || [];
    if (selectedIds.size === filteredCats.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCats.map(c => c.id)));
    }
  };

  const onDeleteSelected = async () => {
    if (selectedIds.size === 0) {
      toast.error('Vui lòng chọn ít nhất một danh mục để xóa');
      return;
    }

    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa ${selectedIds.size} danh mục đã chọn?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              const count = selectedIds.size;
              const deletePromises = Array.from(selectedIds).map((id) => deleteCategory(id));
              await Promise.all(deletePromises);
              setSelectedIds(new Set());
              dispatch(fetchCategories());
              toast.success(`Đã xóa ${count} danh mục`);
            } catch (e: any) {
              toast.error(e?.toString?.() || 'Lỗi xóa danh mục');
            }
          },
        },
      ]
    );
  };

  const filteredCategories = categories?.filter(c => !search || c.name?.toLowerCase().includes(search.toLowerCase())) || [];
  const isAllSelected = filteredCategories.length > 0 && selectedIds.size === filteredCategories.length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh mục nguyên liệu</Text>
      <TextInput 
        placeholder="Tìm kiếm danh mục..." 
        value={search} 
        onChangeText={setSearch} 
        style={[styles.input, { marginBottom: 8 }]}
        autoCorrect={true}
        autoCapitalize="words"
        keyboardType="default"
        textContentType="none"
        enablesReturnKeyAutomatically={false}
      />
      
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
        <TouchableOpacity onPress={() => navigation.navigate('AdminIngredientCategoryForm', { mode: 'create' })} style={styles.createBtn}>
          <Text style={{ color: 'white', fontWeight: '600' }}>+ Thêm danh mục</Text>
        </TouchableOpacity>
        {selectedIds.size > 0 && (
          <TouchableOpacity onPress={onDeleteSelected} style={styles.deleteSelectedBtn}>
            <Text style={{ color: 'white', fontWeight: '600' }}>Xóa ({selectedIds.size})</Text>
          </TouchableOpacity>
        )}
      </View>

      {filteredCategories.length > 0 && (
        <TouchableOpacity onPress={toggleSelectAll} style={styles.selectAllBtn}>
          <Text style={styles.selectAllText}>
            {isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
          </Text>
        </TouchableOpacity>
      )}

      {loading && <Text style={styles.loading}>Đang tải...</Text>}

      <FlatList
        data={filteredCategories}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => {
          const isSelected = selectedIds.has(item.id);
          return (
            <TouchableOpacity
              onPress={() => toggleSelect(item.id)}
              style={[styles.item, isSelected && styles.itemSelected]}
            >
              <TouchableOpacity
                onPress={() => toggleSelect(item.id)}
                style={styles.checkbox}
              >
                <View style={[styles.checkboxInner, isSelected && styles.checkboxChecked]}>
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('AdminIngredientCategoryForm', { mode: 'edit', categoryId: item.id })}
                style={{ flex: 1 }}
              >
                <Text style={styles.name}>{item.name || 'N/A'}</Text>
                {!!item.description && <Text style={styles.desc}>{item.description}</Text>}
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    navigation.navigate('AdminIngredientCategoryForm', { mode: 'edit', categoryId: item.id });
                  }}
                  style={styles.smallBtn}
                >
                  <Text>Sửa</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  row: { gap: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10 },
  createBtn: { backgroundColor: '#007AFF', padding: 12, alignItems: 'center', borderRadius: 8, flex: 1 },
  deleteSelectedBtn: { backgroundColor: '#ef4444', padding: 12, alignItems: 'center', borderRadius: 8, flex: 1 },
  selectAllBtn: {
    backgroundColor: '#f3f4f6',
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectAllText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  loading: { textAlign: 'center', marginVertical: 12 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  itemSelected: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  checkbox: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  name: { fontWeight: '700', fontSize: 15, flex: 1 },
  desc: { color: '#6b7280', marginTop: 2 },
  smallBtn: { paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, backgroundColor: '#fff' },
});

export default IngredientCategoryListScreen;


