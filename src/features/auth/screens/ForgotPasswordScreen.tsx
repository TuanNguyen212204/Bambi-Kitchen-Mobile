import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import Button from '@components/common/Button';
import { COLORS, SIZES } from '@constants';
import { authService } from '@services/api/authService';

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const Inner = styled.View`
  flex: 1;
  padding: 24px;
  justify-content: center;
`;

const Title = styled.Text`
  font-size: 26px;
  font-weight: 700;
  color: ${COLORS.textPrimary};
  margin-bottom: 8px;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: ${COLORS.textSecondary};
  margin-bottom: 24px;
`;

const Input = styled.TextInput`
  width: 100%;
  border-width: 1px;
  border-color: ${COLORS.border};
  border-radius: ${SIZES.radiusSM}px;
  padding: 12px 14px;
  margin-bottom: 12px;
  font-size: 16px;
`;

const BackButton = styled(TouchableOpacity)`
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 10;
`;

const ForgotPasswordScreen: React.FC<any> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const onSend = async () => {
    if (!email) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập email');
      return;
    }
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      Alert.alert('Thành công', 'Đã gửi email khôi phục mật khẩu.');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Lỗi', e?.message || 'Không thể gửi yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <BackButton onPress={() => navigation.goBack()} style={{ top: Math.max(insets.top, 16) }}>
          <Ionicons name="chevron-back" size={28} color="#111" />
        </BackButton>
        <Inner>
          <Title>Quên mật khẩu</Title>
          <Subtitle>Nhập email để nhận hướng dẫn đặt lại mật khẩu</Subtitle>

          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Button title="Gửi yêu cầu" onPress={onSend} loading={loading} fullWidth />
        </Inner>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;


