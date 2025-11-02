import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@store/store';
import { setUser } from '@store/slices/authSlice';
import accountService from '@services/api/accountService';
import { AccountUpdateRequest, Account } from '@/types/api';

export default function EditProfileScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.mail || '');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    // Load user info nếu chưa có phone
    if (user?.id && !phone) {
      loadUserInfo();
    } else if (user) {
      // Nếu có phone trong user (nếu được update sau)
      setPhone((user as any).phone || '');
    }
  }, [user]);

  const loadUserInfo = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const account = await accountService.getAccount(user.id);
      setName(account.name);
      setEmail(account.mail);
      setPhone(account.phone || '');
    } catch (error) {
      console.error('Error loading user info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng');
      return;
    }

    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ tên');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return;
    }

    // Validate email format
    const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return;
    }

    // Validate phone if provided
    if (phone && phone.trim()) {
      const phoneRegex = /^(\+84|0)[3|5|7|8|9][0-9]{8}$/;
      if (!phoneRegex.test(phone)) {
        Alert.alert('Lỗi', 'Số điện thoại không hợp lệ (ví dụ: 0912345678 hoặc +84912345678)');
        return;
      }
    }

    setLoading(true);
    try {
      const updateRequest: AccountUpdateRequest = {
        id: user.id,
        name: name.trim(),
        mail: email.trim(),
        phone: phone.trim() || undefined,
      };

      const updatedAccount = await accountService.updateAccount(updateRequest);

      // Update Redux state
      dispatch(
        setUser({
          id: updatedAccount.id,
          name: updatedAccount.name,
          mail: updatedAccount.mail,
          role: updatedAccount.role,
          phone: updatedAccount.phone,
        })
      );

      Alert.alert('Thành công', 'Đã cập nhật thông tin thành công', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert(
        'Lỗi',
        error?.response?.data?.message || error?.message || 'Cập nhật thông tin thất bại. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !name) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Họ tên *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nhập họ tên"
          editable={!loading}
        />

        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Nhập email"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Nhập số điện thoại (ví dụ: 0912345678)"
          keyboardType="phone-pad"
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonDisabled: {
    backgroundColor: '#6c757d',
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

