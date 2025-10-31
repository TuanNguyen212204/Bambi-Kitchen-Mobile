import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { createCategory, getCategoryById, updateCategory } from '@services/api';
import { toast } from '@utils/toast';
import { useAppDispatch } from '@store/store';
import { fetchCategories } from '@store/slices/ingredientSlice';

const IngredientCategoryFormScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const mode: 'create' | 'edit' = route.params?.mode || 'create';
  const categoryId: number | undefined = route.params?.categoryId;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (mode === 'edit' && categoryId) {
        try {
          const cat = await getCategoryById(categoryId);
          setName(cat.name || '');
          setDescription(cat.description || '');
        } catch (e: any) {
          toast.error('Không tải được danh mục');
        }
      }
    };
    load();
  }, [mode, categoryId]);

  const onSubmit = async () => {
    if (!name.trim()) return toast.error('Tên danh mục bắt buộc');
    try {
      setLoading(true);
      if (mode === 'create') {
        await createCategory({ name: name.trim(), description: description.trim() || undefined });
        toast.success('Đã tạo danh mục');
      } else if (categoryId) {
        await updateCategory({ id: categoryId, name: name.trim(), description: description.trim() || undefined });
        toast.success('Đã cập nhật danh mục');
      }
      dispatch(fetchCategories());
      navigation.goBack();
    } catch (e: any) {
      toast.error(e?.toString?.() || 'Lỗi lưu danh mục');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mode === 'create' ? 'Thêm danh mục' : 'Sửa danh mục'}</Text>
      <Text style={styles.label}>Tên danh mục</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Nhập tên danh mục" style={styles.input} />
      <Text style={styles.label}>Mô tả (tuỳ chọn)</Text>
      <TextInput value={description} onChangeText={setDescription} placeholder="Nhập mô tả" style={styles.input} />
      <TouchableOpacity onPress={onSubmit} style={styles.saveBtn} disabled={loading}>
        <Text style={{ color: 'white', fontWeight: '600' }}>{loading ? 'Đang lưu...' : 'Lưu'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  label: { marginTop: 8, marginBottom: 6, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10 },
  saveBtn: { marginTop: 16, backgroundColor: '#007AFF', padding: 14, alignItems: 'center', borderRadius: 10 },
});

export default IngredientCategoryFormScreen;


