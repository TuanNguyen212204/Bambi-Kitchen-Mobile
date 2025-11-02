import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAppSelector } from '@store/store';
import { dishService, DishDto, DishCreateRequest, DishUpdateRequest } from '@services/api/dishService';
import { getIngredients } from '@services/api/ingredientService';
import { getAllCategories } from '@services/api/categoryService';
import recipeService from '@services/api/recipeService';
import { toast } from '@utils/toast';

const DishFormScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const user = useAppSelector((s) => s.auth.user);

  const mode: 'create' | 'edit' = route.params?.mode || 'create';
  const dishId = route.params?.dishId;

  const [loading, setLoading] = useState(false);
  const [dish, setDish] = useState<DishDto | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [dishType, setDishType] = useState<'PRESET' | 'CUSTOM'>('PRESET');
  const [isPublic, setIsPublic] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  
  // Ingredients selection
  const [allIngredients, setAllIngredients] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<Record<number, number>>({}); // Map<ingredientId, quantity>
  const [loadingIngredients, setLoadingIngredients] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null); // Filter by category
  const [ingredientSearch, setIngredientSearch] = useState(''); // Search by name

  const loadIngredients = useCallback(async () => {
    setLoadingIngredients(true);
    try {
      const [ingredients, cats] = await Promise.all([
        getIngredients(),
        getAllCategories(),
      ]);
      setAllIngredients(ingredients || []);
      setCategories(cats || []);
    } catch (error: any) {
      toast.error(error?.message || 'Lỗi tải danh sách nguyên liệu');
    } finally {
      setLoadingIngredients(false);
    }
  }, []);

  const loadDish = useCallback(async () => {
    if (mode === 'edit' && dishId) {
      setLoading(true);
      try {
        const data = await dishService.getById(dishId);
        if (data) {
          setDish(data);
          setName(data.name || '');
          setDescription(data.description || '');
          setPrice(data.price != null ? String(data.price) : '');
          setDishType(data.dishType || 'PRESET');
          setIsPublic(data.public ?? true);
          setIsActive(data.active ?? true);
          if (data.imageUrl) {
            setExistingImageUrl(data.imageUrl);
          }
          
          // Load recipe (ingredients) for this dish
          const recipe = await recipeService.getByDishId(dishId);
          if (recipe?.ingredients) {
            const ingredientsMap: Record<number, number> = {};
            recipe.ingredients.forEach((ing) => {
              if (ing.id && ing.quantity) {
                ingredientsMap[ing.id] = ing.quantity;
              }
            });
            setSelectedIngredients(ingredientsMap);
          }
        }
      } catch (error: any) {
        toast.error(error?.message || 'Lỗi tải thông tin món');
      } finally {
        setLoading(false);
      }
    }
  }, [mode, dishId]);

  useFocusEffect(
    useCallback(() => {
      loadIngredients();
      loadDish();
    }, [loadIngredients, loadDish])
  );

  const pickImage = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        toast.error('Cần quyền truy cập ảnh');
        return;
      }

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.9,
      });

      if (res.canceled || !res.assets?.length) return;

      const asset = res.assets[0];
      const size = (asset as any).fileSize;
      if (size && size > 2 * 1024 * 1024) {
        toast.error('Ảnh phải <= 2MB');
        return;
      }

      const uri = asset.uri;
      const name = asset.fileName || 'image.jpg';
      const type = asset.mimeType || 'image/jpeg';

      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(type)) {
        toast.error('Ảnh phải là JPG/PNG');
        return;
      }

      setImage({ uri, name, type });
      setExistingImageUrl(null);
    } catch (error: any) {
      toast.error(error?.message || 'Lỗi chọn ảnh');
    }
  };

  const updateIngredientQuantity = (ingredientId: number, quantity: number) => {
    const qty = Number(quantity) || 0;
    if (qty > 0) {
      setSelectedIngredients((prev) => ({ ...prev, [ingredientId]: qty }));
    } else {
      setSelectedIngredients((prev) => {
        const next = { ...prev };
        delete next[ingredientId];
        return next;
      });
    }
  };

  const toggleIngredient = (ingredientId: number) => {
    if (selectedIngredients[ingredientId]) {
      // Remove ingredient
      setSelectedIngredients((prev) => {
        const next = { ...prev };
        delete next[ingredientId];
        return next;
      });
    } else {
      // Add ingredient with default quantity 1 (user can change immediately)
      setSelectedIngredients((prev) => ({ ...prev, [ingredientId]: 1 }));
    }
  };

  // Filter ingredients by category and search
  const filteredIngredients = allIngredients.filter((ing) => {
    // Filter by active
    if (ing.active === false) return false;
    
    // Filter by category
    if (selectedCategoryId != null) {
      if (ing.category?.id !== selectedCategoryId) return false;
    }
    
    // Filter by search keyword
    if (ingredientSearch.trim()) {
      const keyword = ingredientSearch.trim().toLowerCase();
      const name = (ing.name || '').toLowerCase();
      if (!name.includes(keyword)) return false;
    }
    
    return true;
  });

  // Get selected ingredients details for summary
  const selectedIngredientsList = allIngredients.filter((ing) => 
    selectedIngredients[ing.id] != null && selectedIngredients[ing.id] > 0
  );

  const onSubmit = async () => {
    if (!name.trim()) {
      toast.error('Tên món bắt buộc');
      return;
    }

    if (price && (Number(price) < 0 || isNaN(Number(price)))) {
      toast.error('Giá phải là số >= 0');
      return;
    }

    // Validation: Phải có ít nhất 1 nguyên liệu với quantity > 0
    const validIngredients = Object.entries(selectedIngredients).filter(([, qty]) => qty > 0);
    if (validIngredients.length === 0) {
      toast.error('Vui lòng chọn nguyên liệu và định lượng');
      return;
    }

    if (!user?.id) {
      toast.error('Không tìm thấy thông tin người dùng');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'create') {
        // Convert selectedIngredients to Map format (only quantity > 0)
        const ingredientsMap: Record<number, number> = {};
        Object.entries(selectedIngredients).forEach(([id, qty]) => {
          if (qty > 0) {
            ingredientsMap[Number(id)] = qty;
          }
        });

        const request: DishCreateRequest = {
          name: name.trim(),
          description: description.trim() || undefined,
          price: price ? Number(price) : undefined,
          account: { id: user.id },
          dishType,
          ingredients: ingredientsMap,
          public: isPublic,
          active: isActive,
          file: image || undefined,
        };

        await dishService.create(request);
        toast.success('Đã tạo món mới');
        navigation.goBack();
      } else if (mode === 'edit' && dishId) {
        // Convert selectedIngredients to Map format (only quantity > 0)
        const ingredientsMap: Record<number, number> = {};
        Object.entries(selectedIngredients).forEach(([id, qty]) => {
          if (qty > 0) {
            ingredientsMap[Number(id)] = qty;
          }
        });

        // Vì update không có ingredients field trong DishUpdateRequest,
        // dùng create với id (giống web implementation - POST /api/dish với id)
        const updateRequest: DishCreateRequest = {
          id: dishId,
          name: name.trim(),
          description: description.trim() || undefined,
          price: price ? Number(price) : undefined,
          account: { id: user.id },
          dishType,
          ingredients: ingredientsMap,
          public: isPublic,
          active: isActive,
          file: image || undefined,
        };
        
        await dishService.create(updateRequest);
        toast.success('Đã cập nhật món');
        navigation.goBack();
      }
    } catch (error: any) {
      toast.error(error?.message || 'Lỗi lưu món');
    } finally {
      setLoading(false);
    }
  };

  const displayImage = image?.uri || existingImageUrl;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Tên món *</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Nhập tên món"
        style={styles.input}
        autoCorrect={true}
        autoCapitalize="words"
        keyboardType="default"
        textContentType="none"
        enablesReturnKeyAutomatically={false}
      />

      <Text style={styles.label}>Mô tả</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Nhập mô tả"
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={3}
        autoCorrect={true}
        autoCapitalize="sentences"
        keyboardType="default"
        textContentType="none"
        enablesReturnKeyAutomatically={false}
      />

      <Text style={styles.label}>Giá (₫)</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="VD: 50000"
        keyboardType="numeric"
        style={styles.input}
      />
      <Text style={styles.hint}>Nhập giá của món (tùy chọn)</Text>

      <Text style={styles.label}>Loại món</Text>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => setDishType('PRESET')}
          style={[styles.chip, dishType === 'PRESET' && styles.chipActive]}
        >
          <Text style={dishType === 'PRESET' ? styles.chipTextActive : undefined}>
            Món có sẵn
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setDishType('CUSTOM')}
          style={[styles.chip, dishType === 'CUSTOM' && styles.chipActive]}
        >
          <Text style={dishType === 'CUSTOM' ? styles.chipTextActive : undefined}>
            Món tùy chỉnh
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Công khai</Text>
        <TouchableOpacity
          onPress={() => setIsPublic(!isPublic)}
          style={[styles.switch, isPublic && styles.switchActive]}
        >
          <Text style={isPublic ? styles.switchTextActive : styles.switchText}>
            {isPublic ? 'Có' : 'Không'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Hoạt động</Text>
        <TouchableOpacity
          onPress={() => setIsActive(!isActive)}
          style={[styles.switch, isActive && styles.switchActive]}
        >
          <Text style={isActive ? styles.switchTextActive : styles.switchText}>
            {isActive ? 'Có' : 'Không'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Nguyên liệu *</Text>
      
      {/* Search và Filter */}
      <TextInput
        placeholder="Tìm kiếm nguyên liệu..."
        value={ingredientSearch}
        onChangeText={setIngredientSearch}
        style={[styles.input, { marginBottom: 8 }]}
        autoCorrect={true}
        autoCapitalize="words"
        keyboardType="default"
        textContentType="none"
        enablesReturnKeyAutomatically={false}
      />
      
      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryFilter}
        contentContainerStyle={styles.categoryFilterContent}
      >
        <TouchableOpacity
          onPress={() => setSelectedCategoryId(null)}
          style={[
            styles.categoryChip,
            selectedCategoryId === null && styles.categoryChipActive
          ]}
        >
          <Text style={selectedCategoryId === null ? styles.categoryChipTextActive : undefined}>
            Tất cả
          </Text>
        </TouchableOpacity>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setSelectedCategoryId(cat.id)}
            style={[
              styles.categoryChip,
              selectedCategoryId === cat.id && styles.categoryChipActive
            ]}
          >
            <Text style={selectedCategoryId === cat.id ? styles.categoryChipTextActive : undefined}>
              {cat.name || 'N/A'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Selected Ingredients Summary */}
      {selectedIngredientsList.length > 0 && (
        <View style={styles.selectedSummary}>
          <Text style={styles.selectedSummaryTitle}>Đã chọn ({selectedIngredientsList.length}):</Text>
          {selectedIngredientsList.map((ing) => {
            const qty = selectedIngredients[ing.id];
            return (
              <View key={ing.id} style={styles.selectedItem}>
                <Text style={styles.selectedItemName}>
                  {ing.name || 'N/A'} - {qty} {ing.unit || ''}
                </Text>
                <TouchableOpacity
                  onPress={() => toggleIngredient(ing.id)}
                  style={styles.removeBtn}
                >
                  <Text style={styles.removeBtnText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}

      {/* Ingredients List */}
      {loadingIngredients ? (
        <Text style={styles.hint}>Đang tải danh sách nguyên liệu...</Text>
      ) : (
        <ScrollView 
          style={styles.ingredientsContainer}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={true}
        >
          {filteredIngredients.map((ingredient) => {
            const isSelected = selectedIngredients[ingredient.id] != null;
            const quantity = selectedIngredients[ingredient.id] || 0;

            return (
              <View key={ingredient.id} style={styles.ingredientItem}>
                <TouchableOpacity
                  onPress={() => toggleIngredient(ingredient.id)}
                  style={[styles.checkbox, isSelected && styles.checkboxActive]}
                >
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
                <View style={styles.ingredientInfo}>
                  <Text style={styles.ingredientName}>{ingredient.name || 'N/A'}</Text>
                  <View style={styles.ingredientMeta}>
                    {ingredient.unit && (
                      <Text style={styles.ingredientUnit}>Đơn vị: {ingredient.unit}</Text>
                    )}
                    {ingredient.category?.name && (
                      <Text style={styles.ingredientCategory}> • Danh mục: {ingredient.category.name}</Text>
                    )}
                  </View>
                </View>
                {isSelected && (
                  <TextInput
                    value={quantity > 0 ? String(quantity) : ''}
                    onChangeText={(text) => {
                      const num = Number(text) || 0;
                      updateIngredientQuantity(ingredient.id, num);
                    }}
                    placeholder="SL"
                    keyboardType="number-pad"
                    style={styles.quantityInput}
                    autoFocus={quantity === 1} // Auto focus when first selected
                    textContentType="none"
                  />
                )}
              </View>
            );
          })}
          {filteredIngredients.length === 0 && (
            <Text style={styles.hint}>
              {ingredientSearch || selectedCategoryId ? 'Không tìm thấy nguyên liệu' : 'Chưa có nguyên liệu nào'}
            </Text>
          )}
        </ScrollView>
      )}
      <Text style={styles.hint}>Chọn nguyên liệu và nhập số lượng cho món ăn</Text>

      <Text style={styles.label}>Ảnh món</Text>
      {displayImage && (
        <Image source={{ uri: displayImage }} style={styles.preview} />
      )}
      <View style={styles.imageButtons}>
        <TouchableOpacity
          onPress={() => {
            setImage(null);
            setExistingImageUrl(null);
          }}
          style={styles.outlineBtn}
        >
          <Text>Xóa ảnh</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={pickImage} style={styles.outlineBtn}>
          <Text>{displayImage ? 'Đổi ảnh' : 'Chọn ảnh'}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.hint}>Ảnh phải là JPG/PNG và &lt;= 2MB</Text>

      <TouchableOpacity
        onPress={onSubmit}
        style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
        disabled={loading}
      >
        <Text style={styles.saveBtnText}>
          {loading ? 'Đang lưu...' : mode === 'create' ? 'Tạo món' : 'Lưu thay đổi'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  hint: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  chipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  chipTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
  switch: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  switchActive: {
    backgroundColor: '#34d399',
    borderColor: '#34d399',
  },
  switchText: {
    color: '#374151',
    fontWeight: '600',
  },
  switchTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  preview: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f3f4f6',
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  outlineBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  saveBtn: {
    marginTop: 24,
    backgroundColor: '#007AFF',
    padding: 16,
    alignItems: 'center',
    borderRadius: 10,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  ingredientsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    maxHeight: 300,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  ingredientUnit: {
    fontSize: 12,
    color: '#6b7280',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    width: 80,
    textAlign: 'center',
    backgroundColor: '#f9fafb',
  },
  categoryFilter: {
    marginBottom: 12,
  },
  categoryFilterContent: {
    paddingHorizontal: 4,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryChipTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  selectedSummary: {
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  selectedSummaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  selectedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e0f2fe',
  },
  selectedItemName: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  removeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#fee2e2',
    borderRadius: 6,
  },
  removeBtnText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '600',
  },
  ingredientMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ingredientCategory: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default DishFormScreen;

