import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAppDispatch, useAppSelector } from '@store/store';
import { logoutThunk } from '@store/thunks/authThunks';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { storage } from '@utils/storage';

const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const navigation = useNavigation<any>();

  // Check xem user có cần setup phone không (Google login lần đầu)
  useFocusEffect(
    React.useCallback(() => {
      const checkAndShowSetupAlert = async () => {
        if (!user?.id) return;
        
        // Nếu user đã có phone thì không cần setup nữa
        if (user.phone && user.phone.trim()) {
          return;
        }

        // Kiểm tra xem đã hiện alert cho user này chưa
        const alertKey = `setup_alert_shown_${user.id}`;
        const hasShown = await storage.getItem<boolean>(alertKey);
        
        if (!hasShown) {
          // Delay một chút để screen render xong
          setTimeout(() => {
            Alert.alert(
              'Thiết lập tài khoản',
              'Vui lòng cập nhật số điện thoại để hoàn tất thiết lập tài khoản.',
              [
                {
                  text: 'Để sau',
                  style: 'cancel',
                  onPress: async () => {
                    // Lưu flag để không hiện lại
                    await storage.setItem(alertKey, true);
                  },
                },
                {
                  text: 'Cập nhật ngay',
                  onPress: async () => {
                    // Lưu flag để không hiện lại
                    await storage.setItem(alertKey, true);
                    navigation.navigate('EditProfile');
                  },
                },
              ]
            );
          }, 500);
        }
      };

      checkAndShowSetupAlert();
    }, [user, navigation])
  );

  const onLogout = async () => {
    await dispatch(logoutThunk());
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.name}>{user?.name || 'Người dùng'}</Text>
          <Text style={styles.email}>{user?.mail || '—'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tài khoản</Text>
          <View style={styles.card}>
            <InfoRow label="Họ tên" value={user?.name || '—'} />
            <InfoRow label="Email" value={user?.mail || '—'} />
            <InfoRow label="Vai trò" value={String(user?.role || 'USER')} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thiết lập</Text>
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Text style={styles.actionText}>Chỉnh sửa thông tin</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => navigation.navigate('ChangePassword')}
            >
              <Text style={styles.actionText}>Đổi mật khẩu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#E53935' }]} onPress={onLogout}>
              <Text style={[styles.actionText, { color: '#fff' }]}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F4FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 48,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  roleText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 24,
  },
  actionBtn: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    fontWeight: '600',
    color: '#111827',
  },
});

export default ProfileScreen;

