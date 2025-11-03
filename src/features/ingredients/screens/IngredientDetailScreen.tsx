import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@store/store';
import { adjustStockThunk, fetchAllIngredients, fetchCategories, updateIngredientThunk } from '@store/slices/ingredientSlice';
import { getIngredientById } from '@services/api/ingredientService';
import { mapIngredientDTO } from '@services/api/multipartHelpers';
import { toast } from '@utils/toast';

const IngredientDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { transactions = [], categories = [] } = useAppSelector((s) => s.ingredient || {});
  const ingredientId: number = route.params?.ingredientId;

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('PCS');
  const [active, setActive] = useState(true);
  const [pricePerUnit, setPricePerUnit] = useState<string>('');
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [image, setImage] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [reserve, setReserve] = useState<number>(0);
  const [delta, setDelta] = useState<string>('0');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);

  const load = async () => {
    try {
      setLoading(true);
      const dto = await getIngredientById(ingredientId);
      const stockMap: Record<number, number> = {}; // optional for map
      const ing = mapIngredientDTO(dto, stockMap);
      setName(ing.name);
      setUnit(ing.unit);
      setActive(ing.active ?? true);
      setImgUrl(ing.imgUrl || null);
      setPricePerUnit(ing.pricePerUnit != null ? String(ing.pricePerUnit) : '');
      setQuantity(ing.quantity ?? ing.stock ?? 0);
      setReserve(ing.reserve ?? 0);
      setCategoryId(ing.category?.id);
    } catch (e: any) {
      toast.error(e?.toString?.() || 'Lỗi tải chi tiết');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    if (!categories.length) dispatch(fetchCategories());
  }, [ingredientId]);

  const nameRegex = new RegExp('^[\\p{L}0-9 ]+$', 'u');

  const onSave = async () => {
    try {
      const trimmed = name.trim();
      if (!trimmed) return toast.error('Tên nguyên liệu bắt buộc');
      if (!nameRegex.test(trimmed)) return toast.error('Tên chỉ gồm chữ/số/khoảng trắng');
      if (!categoryId) return toast.error('Chọn danh mục');
      if (pricePerUnit && Number(pricePerUnit) < 0) return toast.error('Giá phải >= 0');
      const d = Number(delta) || 0;
      const nextQuantity = quantity + d;
      if (nextQuantity < 0) return toast.error('Tồn kho sau khi điều chỉnh không được âm');

      // Tính available = quantity - reserve
      const calculatedAvailable = nextQuantity - reserve;

      await dispatch(
        updateIngredientThunk({
          id: ingredientId,
          name: trimmed,
          unit,
          active,
          quantity: nextQuantity,
          reserve: reserve,
          available: calculatedAvailable,
          pricePerUnit: pricePerUnit ? Number(pricePerUnit) : null,
          categoryId: categoryId!,
          image,
        })
      ).unwrap();

      if (d !== 0) {
        await dispatch(adjustStockThunk({ ingredientId, quantity: Math.abs(d), transactionType: d > 0 })).unwrap();
      }

      await dispatch(fetchAllIngredients());
      toast.success('Đã lưu thay đổi');
      navigation.goBack();
    } catch (e: any) {
      toast.error(e?.toString?.() || 'Lỗi lưu thay đổi');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ alignItems: 'center', marginBottom: 12 }}>
        <Image source={image?.uri ? { uri: image.uri } : imgUrl ? { uri: imgUrl } : undefined as any} style={styles.image} />
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <TouchableOpacity onPress={() => { setImage(null); }} style={styles.outlineBtn}><Text>Xoá ảnh</Text></TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (!perm.granted) return;
              const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.9 });
              if (res.canceled || !res.assets?.length) return;
              const asset = res.assets[0];
              const size = (asset as any).fileSize;
              if (size && size > 2 * 1024 * 1024) return;
              const uri = asset.uri;
              const name = asset.fileName || 'image.jpg';
              const type = asset.mimeType || 'image/jpeg';
              setImage({ uri, name, type });
            }}
            style={styles.outlineBtn}
          >
            <Text>Chọn ảnh</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.title}>Chỉnh sửa nguyên liệu</Text>
      <Text style={styles.label}>Tên nguyên liệu</Text>
      <TextInput 
        value={name} 
        onChangeText={setName} 
        placeholder="Nhập tên" 
        style={styles.input}
        autoCorrect={true}
        autoCapitalize="words"
        keyboardType="default"
        textContentType="none"
        enablesReturnKeyAutomatically={false}
      />

      <Text style={styles.label}>Danh mục</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {categories.map((c) => (
            <TouchableOpacity key={c.id} onPress={() => setCategoryId(c.id)} style={[styles.chip, categoryId === c.id && styles.chipActive]}>
              <Text style={categoryId === c.id ? styles.chipTextActive : undefined}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Text style={styles.label}>Đơn vị</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
        <View style={{ flexDirection: 'row' }}>
          {(['GRAM','KILOGRAM','LITER','PCS'] as const).map((u) => (
            <TouchableOpacity key={u} onPress={() => setUnit(u)} style={[styles.chip, unit === u && styles.chipActive]}>
              <Text style={unit === u ? styles.chipTextActive : styles.chipText}>{u}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
        <Text>Trạng thái</Text>
        <Switch value={active} onValueChange={setActive} />
      </View>

      <Text style={styles.label}>Giá mỗi đơn vị</Text>
      <TextInput value={pricePerUnit} onChangeText={setPricePerUnit} keyboardType="numeric" placeholder="VD: 10000" style={styles.input} />
      <Text style={styles.hint}>Nhập giá theo đơn vị đã chọn (>= 0). Ví dụ: 10000</Text>

      <Text style={styles.label}>Điều chỉnh tồn kho (âm: xuất, dương: nhập)</Text>
      <TextInput value={delta} onChangeText={setDelta} keyboardType="numeric" placeholder="VD: 5 hoặc -3" style={styles.input} />
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
        <TouchableOpacity onPress={() => setDelta('0')} style={styles.outlineBtn}><Text>Reset về 0</Text></TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onSave} style={styles.saveBtn}>
        <Text style={{ color: 'white', fontWeight: '600' }}>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  image: { width: 140, height: 140, borderRadius: 12, backgroundColor: '#f3f4f6' },
  title: { fontSize: 18, fontWeight: '700' },
  meta: { color: '#666', marginTop: 4 },
  label: { marginTop: 12, marginBottom: 6, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 20, marginRight: 8, backgroundColor: '#fff' },
  chipActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  chipText: { color: '#374151' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  hint: { color: '#6b7280', marginTop: 4 },
  outlineBtn: { paddingVertical: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  saveBtn: { marginTop: 16, backgroundColor: '#007AFF', padding: 14, alignItems: 'center', borderRadius: 10 },
});

export default IngredientDetailScreen;


