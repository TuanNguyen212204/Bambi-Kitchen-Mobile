import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Dimensions, StatusBar, ImageBackground, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import Button from '@components/common/Button';
import { COLORS } from '@constants';
import { useAppDispatch, useAppSelector } from '@store/store';
import { loginThunk } from '@store/thunks/authThunks';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { authService } from '@services/api/authService';
import { Linking } from 'react-native';

const Container = styled(View)`
  flex: 1;
  background-color: #ffffff;
`;

const Center = styled(View)`
  flex: 1;
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
  padding: 56px 24px 12px 24px;
`;

const Banner = styled(ImageBackground)`
  position: absolute;
  top: 0px;
  left: 0;
  right: 0;
` as any;

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
  border-radius: 24px;
  padding: 14px 48px 14px 16px;
  margin-bottom: 12px;
  font-size: 16px;
` as any;

const InputContainer = styled.View`
  position: relative;
  width: 100%;
  margin-bottom: 12px;
`;

const EyeIcon = styled(TouchableOpacity)`
  position: absolute;
  right: 16px;
  top: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

const Row = styled(View)`
  margin-top: 12px;
  flex-direction: row;
  justify-content: space-between;
`;

const LinkText = styled.Text`
  color: ${COLORS.primary};
  font-weight: 600;
`;

const GoogleBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 16px 0;
  border-radius: 27px;
  border: 1px solid #e5e7eb;
  margin-top: 28px;
  margin-bottom: 20px;
  background: #fff;
`;

const LoginScreen: React.FC<any> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.auth.loading);
  const insets = useSafeAreaInsets();

  const onLogin = async () => {
    if (!username || !password) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ tài khoản và mật khẩu');
      return;
    }
    try {
      await dispatch(loginThunk({ username, password } as any)).unwrap();
    } catch (e: any) {
      Alert.alert('Đăng nhập thất bại', e?.message || 'Vui lòng kiểm tra thông tin');
    }
  };

  const onGoogle = async () => {
    try {
      const googleLoginUrl = await authService.googleLogin();
      const canOpen = await Linking.canOpenURL(googleLoginUrl);
      if (canOpen) {
        await Linking.openURL(googleLoginUrl);
        // Sau khi user xác thực Google, backend sẽ redirect về:
        // bambi-kitchen-web.vercel.app/oauth2/callback?token=...
        // Deep link handler sẽ bắt URL này và xử lý token
      } else {
        Alert.alert('Lỗi', 'Không thể mở trình duyệt để đăng nhập Google.');
      }
    } catch (e: any) {
      Alert.alert('Lỗi', 'Không thể mở đăng nhập Google. Vui lòng thử lại.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left','right','bottom']}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <Center>
          <Banner
            source={require('../../../../assets/LoginPage/loginPage1.png')}
            resizeMode="cover"
            style={{ height: Dimensions.get('window').height * 0.58 }}
          />
          <Sheet style={{ bottom: -32 }}>
            <TitleContainer>
              <Title>Đăng nhập</Title>
            </TitleContainer>
            <Subtitle>Đăng nhập để tiếp tục với Bambi Kitchen</Subtitle>
            <Input
              placeholder="Số điện thoại"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              keyboardType="phone-pad"
              style={{ borderWidth: 1, borderColor: COLORS.border }}
              textContentType="telephoneNumber"
              enablesReturnKeyAutomatically={false}
            />
            <InputContainer>
              <Input
                placeholder="Mật khẩu"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                returnKeyType="done"
                style={{ borderWidth: 1, borderColor: COLORS.border }}
                textContentType="password"
                autoCorrect={false}
              />
              <EyeIcon onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={24} 
                  color={COLORS.textSecondary} 
                />
              </EyeIcon>
            </InputContainer>
            <Button title="Đăng nhập" onPress={onLogin} loading={loading} fullWidth style={{ borderRadius: 24 }} />
            <Row>
              <LinkText onPress={() => navigation.navigate('ForgotPassword')}>Quên mật khẩu?</LinkText>
              <LinkText onPress={() => navigation.navigate('Register')}>Tạo tài khoản</LinkText>
            </Row>
            <GoogleBtn onPress={onGoogle}>
              <MaterialCommunityIcons name="google" size={24} color="#EA4335" style={{ marginRight: 8 }} />
              <Text style={{ color: '#111', fontWeight: '600', fontSize: 16 }}>Đăng nhập với Google</Text>
            </GoogleBtn>
          </Sheet>
        </Center>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
