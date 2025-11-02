import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { DishDto } from '@services/api/dishService';
import styled from 'styled-components/native';

const DishCard = styled.TouchableOpacity`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
  flex-direction: row;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const DishImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  margin-right: 12px;
`;

const PlaceholderImage = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  margin-right: 12px;
  background-color: #f0f0f0;
  justify-content: center;
  align-items: center;
`;

const DishInfo = styled.View`
  flex: 1;
`;

const DishName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #111;
  margin-bottom: 4px;
`;

const DishDescription = styled.Text`
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
  line-height: 16px;
`;

const DishPrice = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #ef4444;
`;

const FeaturedDishesScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { dishes } = route.params as { dishes: DishDto[] };

  const handleDishPress = (dishId: number) => {
    navigation.navigate('DishDetail', { dishId });
  };

  if (!dishes || dishes.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Món ăn nổi bật</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.center}>
          <Text style={styles.emptyText}>Không có món ăn nổi bật</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Món ăn nổi bật</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {dishes.map((dish) => (
          <DishCard key={dish.id} onPress={() => handleDishPress(dish.id)} activeOpacity={0.7}>
            {dish.imageUrl ? (
              <DishImage source={{ uri: dish.imageUrl }} />
            ) : (
              <PlaceholderImage>
                <Ionicons name="restaurant-outline" size={32} color="#ccc" />
              </PlaceholderImage>
            )}
            <DishInfo>
              <DishName>{dish.name}</DishName>
              {dish.description && (
                <DishDescription numberOfLines={2}>{dish.description}</DishDescription>
              )}
              {dish.price ? (
                <DishPrice>{dish.price.toLocaleString('vi-VN')} ₫</DishPrice>
              ) : (
                <DishPrice style={{ color: '#999' }}>Chưa có giá</DishPrice>
              )}
            </DishInfo>
          </DishCard>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5ea',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default FeaturedDishesScreen;
