import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, ImageBackground, Dimensions, StatusBar } from 'react-native';
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
`;

const Sheet = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  border-top-left-radius: 36px;
  border-top-right-radius: 36px;
  padding: 32px 24px 24px 24px;
  shadow-color: #000;
  shadow-opacity: 0.12;
  shadow-radius: 12px;
  elevation: 8;
`;

const Banner = styled(ImageBackground)`
  position: absolute;
  top: 0px;
  left: 0;
  right: 0;
  height: ${Dimensions.get('window').height * 0.5}px;
` as any;

const Logo = styled(Image)`
  width: 64px;
  height: 64px;
  margin: 12px auto 8px auto;
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
  border-radius: 24px;
  padding: 14px 16px;
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
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <Center>
          <Banner source={require('../../../../assets/LoginPage/loginPage1.png')} resizeMode="cover" />
          <Logo source={require('../../../../assets/logo.png')} resizeMode="contain" />
          <Sheet>
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

            <Button title="Đăng nhập" onPress={onLogin} loading={loading} fullWidth style={{ borderRadius: 24 }} />

            <Row>
              <LinkText onPress={() => navigation.navigate('ForgotPassword')}>Quên mật khẩu?</LinkText>
              <LinkText onPress={() => navigation.navigate('Register')}>Tạo tài khoản</LinkText>
            </Row>

            <View style={{ alignItems: 'center', marginTop: 16 }}>
              <Text style={{ color: '#9CA3AF' }}>Hoặc tiếp tục với</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
              <View style={{ flex: 1, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, paddingVertical: 12, alignItems: 'center' }}>
                <Text>Apple</Text>
              </View>
              <View style={{ flex: 1, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, paddingVertical: 12, alignItems: 'center' }}>
                <Text>Google</Text>
              </View>
            </View>
          </Sheet>
        </Center>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;


