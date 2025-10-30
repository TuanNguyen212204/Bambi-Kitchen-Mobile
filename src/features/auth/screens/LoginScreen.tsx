import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, ImageBackground } from 'react-native';
import styled from 'styled-components/native';
import Button from '@components/common/Button';
import { COLORS, SIZES } from '@constants';
import { useAppDispatch, useAppSelector } from '@store/store';
import { loginThunk } from '@store/thunks/authThunks';

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
  justify-content: center;
`;

const Center = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const Form = styled.View`
  width: 100%;
  max-width: 420px;
`;

const Banner = styled(ImageBackground)`
  height: 180px;
  width: 100%;
` as any;

const Logo = styled(Image)`
  width: 64px;
  height: 64px;
  margin: 12px auto 8px auto;
`;

const Title = styled.Text`
  font-size: 28px;
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

const Row = styled.View`
  margin-top: 12px;
  flex-direction: row;
  justify-content: space-between;
`;

const LinkText = styled.Text`
  color: ${COLORS.primary};
  font-weight: 600;
`;

const LoginScreen: React.FC<any> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.auth.loading);
  

  const onLogin = async () => {
    if (!username || !password) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ tài khoản và mật khẩu');
      return;
    }
    try {
      await dispatch(loginThunk({ username, password } as any)).unwrap();
      // RootNavigator sẽ điều hướng theo role
    } catch (e: any) {
      Alert.alert('Đăng nhập thất bại', e?.message || 'Vui lòng kiểm tra thông tin');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <Center>
          <Banner source={require('../../../../assets/LoginPage/loginPage1.png')} resizeMode="cover" />
          <Logo source={require('../../../../assets/logo.png')} resizeMode="contain" />
          <Form>
            <Title>Chào mừng trở lại 👋</Title>
            <Subtitle>Đăng nhập để tiếp tục với Bambi Kitchen</Subtitle>

      <Input
        placeholder="Email hoặc tên đăng nhập"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
        keyboardType="email-address"
        returnKeyType="next"
      />
      <Input
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        returnKeyType="done"
      />

            <Button title="Đăng nhập" onPress={onLogin} loading={loading} fullWidth />

            <Row>
              <LinkText onPress={() => navigation.navigate('ForgotPassword')}>Quên mật khẩu?</LinkText>
              <LinkText onPress={() => navigation.navigate('Register')}>Tạo tài khoản</LinkText>
            </Row>
          </Form>
        </Center>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;


