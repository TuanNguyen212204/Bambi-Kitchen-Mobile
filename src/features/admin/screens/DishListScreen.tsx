import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, Image, TextInput, TouchableOpacity, StyleSheet, Switch, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { dishService, DishDto } from '@services/api/dishService';
import { toast } from '@utils/toast';

const DishListScreen = () => {
  const navigation = useNavigation<any>();
  const [dishes, setDishes] = useState<DishDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [showMenuOnly, setShowMenuOnly] = useState(false); // Filter chỉ hiển thị món có public=true và active=true

  const loadDishes = useCallback(async () => {
    try {
      const data = await dishService.getAllAdmin();
      setDishes(data);
    } catch (error: any) {
      toast.error(error?.message || 'Lỗi tải danh sách món');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDishes();
    }, [loadDishes])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDishes();
    setRefreshing(false);
  }, [loadDishes]);

  const filtered = useMemo(() => {
    return dishes.filter((d) => {
      // Filter theo keyword
      if (keyword && d.name && !d.name.toLowerCase().includes(keyword.toLowerCase())) return false;
      if (keyword && !d.name) return false; // Nếu không có tên và có keyword thì filter ra
      
      // Filter theo showMenuOnly: chỉ hiển thị món public=true và active=true
      if (showMenuOnly) {
        if (!d.public || !d.active) return false;
      }
      
      return true;
    });
  }, [dishes, keyword, showMenuOnly]);

  const onTogglePublic = async (id: number) => {
    try {
      await dishService.togglePublic(id);
      await loadDishes();
      toast.success('Đã cập nhật trạng thái công khai');
    } catch (error: any) {
      toast.error(error?.message || 'Lỗi cập nhật trạng thái');
    }
  };

  const onToggleActive = async (id: number) => {
    try {
      await dishService.toggleActive(id);
      await loadDishes();
      toast.success('Đã cập nhật trạng thái hoạt động');
    } catch (error: any) {
      toast.error(error?.message || 'Lỗi cập nhật trạng thái');
    }
  };


  const renderItem = ({ item }: { item: DishDto }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('AdminDishForm', { mode: 'edit', dishId: item.id })}
        style={styles.card}
      >
        <Image
          source={item.imageUrl ? { uri: item.imageUrl } : undefined as any}
          style={styles.image}
        />
        <View style={styles.info}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{item.name || 'N/A'}</Text>
            <View style={styles.badges}>
              {item.public && (
                <View style={styles.badgePublic}>
                  <Text style={styles.badgeText}>Công khai</Text>
                </View>
              )}
              {!item.active && (
                <View style={styles.badgeInactive}>
                  <Text style={styles.badgeText}>Không hoạt động</Text>
                </View>
              )}
            </View>
          </View>
          {item.description && (
            <Text style={styles.description} numberOfLines={2}>
              {item.description || ''}
            </Text>
          )}
          {item.price != null && (
            <Text style={styles.price}>{item.price.toLocaleString('vi-VN')} ₫</Text>
          )}
          <Text style={styles.meta}>
            Loại: {item.dishType === 'PRESET' ? 'Món có sẵn' : item.dishType === 'CUSTOM' ? 'Món tùy chỉnh' : 'N/A'}
            {item.account?.name && ` • Người tạo: ${item.account.name || ''}`}
          </Text>
          <View style={styles.actions}>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Công khai:</Text>
              <Switch
                value={!!item.public}
                onValueChange={() => onTogglePublic(item.id)}
                trackColor={{ false: '#d1d5db', true: '#34d399' }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Hoạt động:</Text>
              <Switch
                value={!!item.active}
                onValueChange={() => onToggleActive(item.id)}
                trackColor={{ false: '#d1d5db', true: '#34d399' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <TextInput
          placeholder="Tìm theo tên món..."
          value={keyword}
          onChangeText={setKeyword}
          style={styles.search}
        />
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
          <TouchableOpacity
            onPress={() => setShowMenuOnly(!showMenuOnly)}
            style={[styles.filterBtn, showMenuOnly && styles.filterBtnActive]}
          >
            <Ionicons name={showMenuOnly ? 'checkmark-circle' : 'checkmark-circle-outline'} size={18} color={showMenuOnly ? '#fff' : '#007AFF'} />
            <Text style={[styles.filterBtnText, showMenuOnly && styles.filterBtnTextActive]}>
              Chỉ món trên menu
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('AdminDishForm', { mode: 'create' })}
          style={styles.createBtn}
        >
          <Text style={styles.createBtnText}>+ Thêm món mới</Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing && <Text style={styles.loading}>Đang tải...</Text>}

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Không có món nào</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
  },
  controls: {
    marginBottom: 12,
  },
  search: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  filterBtnActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterBtnText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
  filterBtnTextActive: {
    color: '#fff',
  },
  createBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  createBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  loading: {
    textAlign: 'center',
    marginVertical: 12,
    color: '#6b7280',
  },
  card: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    borderRadius: 14,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  name: {
    fontWeight: '700',
    fontSize: 16,
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 4,
  },
  badgePublic: {
    backgroundColor: '#34d399',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeInactive: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  description: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 4,
  },
  price: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  meta: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 4,
  },
  actions: {
    marginTop: 12,
    gap: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    color: '#374151',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
  },
});

export default DishListScreen;

