import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '@store/store';

interface TileData {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
  route: string;
}

const AdminHubScreen = () => {
  const navigation = useNavigation<any>();
  const user = useAppSelector((s) => s.auth.user);

  const tiles: TileData[] = [
    {
      id: 'dishes',
      title: 'Món ăn',
      description: 'Quản lý menu, thêm/sửa/xóa món',
      icon: 'restaurant',
      color: '#007AFF',
      bgColor: '#E3F2FD',
      route: 'AdminDishList',
    },
    {
      id: 'ingredients',
      title: 'Nguyên liệu',
      description: 'Quản lý nguyên liệu, điều chỉnh tồn kho',
      icon: 'cube',
      color: '#34C759',
      bgColor: '#E8F5E9',
      route: 'AdminIngredientList',
    },
    {
      id: 'categories',
      title: 'Danh mục',
      description: 'Quản lý danh mục nguyên liệu',
      icon: 'grid',
      color: '#FF9500',
      bgColor: '#FFF3E0',
      route: 'AdminIngredientCategoryList',
    },
    {
      id: 'orders',
      title: 'Đơn hàng',
      description: 'Xem và quản lý đơn hàng',
      icon: 'receipt',
      color: '#FF3B30',
      bgColor: '#FFEBEE',
      route: 'AdminOrders',
    },
  ];

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('AdminDishList')}
          style={{ marginRight: 16 }}
        >
          <Ionicons name="restaurant" size={24} color="#007AFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const renderTile = (tile: TileData) => (
    <TouchableOpacity
      key={tile.id}
      style={[styles.tile, { borderLeftColor: tile.color, backgroundColor: tile.bgColor }]}
      onPress={() => navigation.navigate(tile.route)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: tile.color }]}>
        <Ionicons name={tile.icon} size={28} color="#FFFFFF" />
      </View>
      <View style={styles.tileContent}>
        <Text style={styles.tileTitle}>{tile.title}</Text>
        <Text style={styles.tileDesc}>{tile.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={tile.color} style={styles.chevron} />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Chào mừng trở lại!</Text>
          <Text style={styles.userName}>{user?.name || 'Admin'}</Text>
        </View>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={24} color="#007AFF" />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quản lý</Text>

      <View style={styles.tilesContainer}>
        {tiles.map(renderTile)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  tilesContainer: {
    gap: 12,
  },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tileContent: {
    flex: 1,
  },
  tileTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  tileDesc: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  chevron: {
    marginLeft: 8,
  },
});

export default AdminHubScreen;


