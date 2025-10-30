import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, TouchableOpacity, View, StatusBar, Dimensions, ImageBackground } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import Button from '@components/common/Button';
import { COLORS, SIZES } from '@constants';
import { authService } from '@services/api/authService';

const Banner = styled.Image`
  width: 100%;
  height: 60%;
  background-color: ${COLORS.primary};
  justify-content: center;
  align-items: center;
`;

const BannerText = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  text-align: center;
  padding: 0 20px;
`;

const Sheet = styled(View)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  border-top-left-radius: 36px;
  border-top-right-radius: 36px;
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
  margin-top: -24px;
  min-height: ${Dimensions.get('window').height * 0.54}px;
  padding: 24px 24px 48px 24px;
`;

const Title = styled.Text`
  font-size: 26px;
  font-weight: 700;
  color: ${COLORS.textPrimary};
  margin-bottom: 8px;
  text-align: center;
`;

const TitleContainer = styled.View`
  align-items: center;
  margin-bottom: 8px;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: ${COLORS.textSecondary};
  margin-bottom: 24px;
  text-align: center;
`;

const Input = styled.TextInput`
  width: 100%;
  border-width: 1px;
  border-color: ${COLORS.border};
  border-radius: 24px;
  padding: 14px 16px;
  margin-bottom: 12px;
  font-size: 16px;
`;

const BackButton = styled(TouchableOpacity)`
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 10;
`;

interface ResetPasswordScreenProps {
  navigation: any;
  route: {
    params: {
      email: string;
      otp: string;
    };
  };
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ navigation, route }) => {
  const { email, otp } = route.params || {};
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onReset = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập mật khẩu mới');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(email, otp, newPassword);
      Alert.alert('Thành công', 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập.');
      navigation.navigate('Login');
    } catch (e: any) {
      Alert.alert('Lỗi', e?.message || 'Không thể đặt lại mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left','right','bottom']}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Banner
            source={require('../../../../assets/LoginPage/loginPage1.png')}
            resizeMode="cover"
            style={{ height: Dimensions.get('window').height * 0.58 }}
          />
          <Sheet style={{ bottom: -32 }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 8, left: 8, zIndex: 10 }}>
              <Ionicons name="chevron-back" size={28} color="#111" />
            </TouchableOpacity>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <TitleContainer>
                <Title>Đặt lại mật khẩu</Title>
              </TitleContainer>
              <Subtitle>Nhập mật khẩu mới của bạn</Subtitle>
              <Input
                placeholder="Mật khẩu mới"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <Input
                placeholder="Xác nhận mật khẩu mới"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <Button title="Đặt lại mật khẩu" onPress={onReset} loading={loading} fullWidth style={{ borderRadius: 24 }} />
            </View>
          </Sheet>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;

