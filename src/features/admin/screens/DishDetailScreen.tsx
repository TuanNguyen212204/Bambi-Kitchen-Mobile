import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { recipeService } from '@services/api/recipeService';
import { IngredientsGetByDishResponse } from '@services/api/dishService';
import { toast } from '@utils/toast';

const DishDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const { dishId } = route.params as { dishId: number };
  const [dishData, setDishData] = useState<IngredientsGetByDishResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  useEffect(() => {
    fetchDishDetail();
  }, [dishId]);

  const fetchDishDetail = async () => {
    try {
      setLoading(true);
      const data = await recipeService.getByDishId(dishId);
      if (data) {
        setDishData(data);
      } else {
        toast.error('Không tìm thấy thông tin món ăn');
        navigation.goBack();
      }
    } catch (err: any) {
      console.error('Error fetching dish detail:', err);
      const errorMessage = err?.response?.data?.data ||
                          err?.response?.data?.message ||
                          err?.message ||
                          'Không thể tải thông tin món ăn';
      toast.error(errorMessage);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!dishData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
          <Text style={styles.errorText}>Không tìm thấy thông tin món ăn</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchDishDetail}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Thông tin món ăn */}
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            {dishData.imageUrl ? (
              <Image
                source={{ uri: dishData.imageUrl }}
                style={styles.dishImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.dishImage, styles.placeholderImage]}>
                <Ionicons name="restaurant-outline" size={64} color="#ccc" />
              </View>
            )}
          </View>

          <View style={styles.dishInfo}>
            <Text style={styles.dishName}>{String(dishData.name || 'Chưa có tên')}</Text>
            
            {dishData.description && String(dishData.description).trim() ? (
              <Text style={styles.dishDescription}>{String(dishData.description).trim()}</Text>
            ) : null}

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giá:</Text>
              <Text style={styles.infoValue}>
                {Number(dishData.price || 0).toLocaleString('vi-VN')}đ
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Loại:</Text>
              <Text style={styles.infoValue}>
                {dishData.dishType === 'PRESET' ? 'Món có sẵn' : 'Món tùy chỉnh'}
              </Text>
            </View>

            {dishData.account ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Người tạo:</Text>
                <Text style={styles.infoValue}>{String(dishData.account.name || 'N/A')}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Danh sách nguyên liệu */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Nguyên liệu cần có ({String(dishData.ingredients?.length || 0)})
          </Text>
          
          {dishData.ingredients && dishData.ingredients.length > 0 ? (
            dishData.ingredients.map((ingredient, index) => (
              <View key={String(ingredient.id || index)} style={styles.ingredientItem}>
                <View style={styles.ingredientContent}>
                  <Text style={styles.ingredientName}>
                    {String(ingredient.name || 'Nguyên liệu không xác định')}
                  </Text>
                  {ingredient.quantity != null && ingredient.quantity !== undefined ? (
                    <Text style={styles.ingredientQuantity}>
                      {Number(ingredient.quantity).toLocaleString('vi-VN')} {String(ingredient.unit || '')}
                    </Text>
                  ) : null}
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Chưa có thông tin nguyên liệu</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dishImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dishInfo: {
    width: '100%',
  },
  dishName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
    textAlign: 'center',
  },
  dishDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#111',
    fontWeight: '400',
    flex: 1,
    textAlign: 'right',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  ingredientItem: {
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 8,
  },
  ingredientContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    flex: 1,
  },
  ingredientQuantity: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
    paddingVertical: 20,
  },
});

export default DishDetailScreen;

