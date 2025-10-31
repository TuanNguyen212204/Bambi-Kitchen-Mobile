import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AdminHubScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản trị</Text>

      <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('AdminIngredientList')}>
        <Text style={styles.tileTitle}>Nguyên liệu</Text>
        <Text style={styles.tileDesc}>Thêm/sửa/xoá, điều chỉnh tồn kho, xem lịch sử</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('AdminIngredientCategoryList')}>
        <Text style={styles.tileTitle}>Danh mục nguyên liệu</Text>
        <Text style={styles.tileDesc}>Tạo mới, đổi tên, xoá danh mục</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('AdminOrders')}>
        <Text style={styles.tileTitle}>Đơn hàng</Text>
        <Text style={styles.tileDesc}>Xem danh sách, cập nhật trạng thái, xác nhận thanh toán</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  tile: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  tileTitle: { fontSize: 16, fontWeight: '600' },
  tileDesc: { color: '#6b7280', marginTop: 4 },
});

export default AdminHubScreen;


