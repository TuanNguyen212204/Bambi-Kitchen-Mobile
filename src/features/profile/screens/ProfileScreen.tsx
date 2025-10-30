import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useAppDispatch } from '@store/store';
import { logoutThunk } from '@store/thunks/authThunks';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();

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
          <Text style={styles.name}>Tên người dùng</Text>
          <Text style={styles.email}>user@example.com</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin nhóm</Text>
          <View style={styles.card}>
            <InfoRow label="Tên nhóm" value="Group [Số nhóm]" />
            <InfoRow label="Môn học" value="MMA301" />
            <InfoRow label="Trường" value="FPT University HCM" />
            <InfoRow label="Thành viên" value="3 người" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vai trò trong nhóm</Text>
          <View style={styles.card}>
            <Text style={styles.roleText}>
              • Thành viên 1: UI/UX Developer{'\n'}
              • Thành viên 2: API Integration{'\n'}
              • Thành viên 3: State Management & Testing
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
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
  logoutBtn: {
    marginTop: 16,
    backgroundColor: '#E53935',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ProfileScreen;

