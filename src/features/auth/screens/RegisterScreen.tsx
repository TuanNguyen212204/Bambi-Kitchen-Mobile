import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, TouchableOpacity, View, ScrollView, StatusBar, Dimensions, ImageBackground } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import Button from '@components/common/Button';
import { COLORS, SIZES } from '@constants';
import { authService } from '@services/api/authService';
import { Ionicons } from '@expo/vector-icons';

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const Inner = styled.View`
  flex: 1;
  padding: 24px;
  justify-content: center;
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
  padding: 72px 24px 48px 24px;
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

const BackButton = styled(TouchableOpacity)`
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 10;
`;

const RegisterScreen: React.FC<any> = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const onRegister = async () => {
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ các trường');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Mật khẩu không khớp', 'Vui lòng nhập lại mật khẩu để xác nhận.');
      return;
    }
    setLoading(true);
    try {
      await authService.register({
        firstName,
        lastName,
        email,
        phone,
        password,
        role: 'USER',
      });
      Alert.alert('Thành công', 'Đăng ký thành công. Vui lòng đăng nhập.');
      navigation.navigate('Login');
    } catch (e: any) {
      Alert.alert('Lỗi', e?.message || 'Không thể đăng ký');
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
            <Title>Tạo tài khoản</Title>
            <Subtitle>Đăng ký để trải nghiệm Bambi Kitchen</Subtitle>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Input placeholder="Họ" value={firstName} onChangeText={setFirstName} />
              <Input placeholder="Tên" value={lastName} onChangeText={setLastName} />
              <Input placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              <Input placeholder="Số điện thoại" value={phone} onChangeText={setPhone} keyboardType="phone-pad" autoCapitalize="none" />
              <Input placeholder="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry />
              <Input placeholder="Xác nhận mật khẩu" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
              <Button title="Đăng ký" onPress={onRegister} loading={loading} fullWidth />
              <Button
                title="Đã có tài khoản? Đăng nhập"
                variant="outline"
                onPress={() => navigation.navigate('Login')}
                style={{ marginTop: 8 }}
                fullWidth
              />
            </ScrollView>
          </Sheet>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;


