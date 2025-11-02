import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, TouchableOpacity, View, ScrollView, StatusBar, Dimensions, ImageBackground, Text, Keyboard } from 'react-native';
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
  padding: 14px 48px 14px 16px;
  margin-bottom: 12px;
  font-size: 16px;
`;

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  // Format phone number to +84 format if needed
  const formatPhone = (phoneNumber: string): string => {
    let cleaned = phoneNumber.replace(/\D/g, ''); // Remove non-digits
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1); // Remove leading 0
    }
    if (!cleaned.startsWith('84')) {
      cleaned = '84' + cleaned; // Add country code if not present
    }
    return '+' + cleaned;
  };

  const onRegister = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ các trường');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Mật khẩu không khớp', 'Vui lòng nhập lại mật khẩu để xác nhận.');
      return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Email không hợp lệ', 'Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    // Basic phone validation (should have at least 9 digits)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 9) {
      Alert.alert('Số điện thoại không hợp lệ', 'Vui lòng nhập số điện thoại hợp lệ.');
      return;
    }
    
    setLoading(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const formattedPhone = formatPhone(phone);
      
      await authService.register({
        name: fullName,
        mail: email.trim(),
        password,
        phone: formattedPhone,
        role: 'USER',
      });
      Alert.alert('Thành công', 'Đăng ký thành công. Vui lòng đăng nhập.');
      navigation.navigate('Login');
    } catch (e: any) {
      Alert.alert('Lỗi', e?.response?.data?.message || e?.message || 'Không thể đăng ký');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left','right','bottom']}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={{ flex: 1 }}>
          <Banner
            source={require('../../../../assets/LoginPage/loginPage1.png')}
            resizeMode="cover"
            style={{ height: Dimensions.get('window').height * 0.58 }}
          />
          <Sheet style={{ bottom: -32 }}>
            <TouchableOpacity 
              onPress={() => {
                Keyboard.dismiss();
                navigation.goBack();
              }} 
              style={{ position: 'absolute', top: 8, left: 8, zIndex: 10 }}
            >
              <Ionicons name="chevron-back" size={28} color="#111" />
            </TouchableOpacity>
            <ScrollView 
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <TitleContainer>
                <Title>Đăng ký</Title>
              </TitleContainer>
              <Subtitle>Đăng ký để trải nghiệm Bambi Kitchen</Subtitle>
              <Input 
                placeholder="Tên" 
                value={firstName} 
                onChangeText={setFirstName}
                autoCorrect={true}
                autoCapitalize="words"
                keyboardType="default"
                textContentType="givenName"
                enablesReturnKeyAutomatically={false}
              />
              <Input 
                placeholder="Họ" 
                value={lastName} 
                onChangeText={setLastName}
                autoCorrect={true}
                autoCapitalize="words"
                keyboardType="default"
                textContentType="familyName"
                enablesReturnKeyAutomatically={false}
              />
              <Input 
                placeholder="Email" 
                value={email} 
                onChangeText={setEmail} 
                keyboardType="email-address" 
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
              />
              <Input 
                placeholder="Số điện thoại (VD: 0912345678 hoặc +84912345678)" 
                value={phone} 
                onChangeText={setPhone} 
                keyboardType="phone-pad"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="telephoneNumber"
                enablesReturnKeyAutomatically={false}
              />
              <InputContainer>
                <Input 
                  placeholder="Mật khẩu" 
                  value={password} 
                  onChangeText={setPassword} 
                  secureTextEntry={!showPassword}
                  textContentType="newPassword"
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
              <InputContainer>
                <Input 
                  placeholder="Xác nhận mật khẩu" 
                  value={confirmPassword} 
                  onChangeText={setConfirmPassword} 
                  secureTextEntry={!showConfirmPassword}
                  textContentType="newPassword"
                  autoCorrect={false} 
                />
                <EyeIcon onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={24} 
                    color={COLORS.textSecondary} 
                  />
                </EyeIcon>
              </InputContainer>
              <Button title="Đăng ký" onPress={onRegister} loading={loading} fullWidth style={{ borderRadius: 24, marginTop: 12 }} />
              <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 12, alignItems: 'center', marginBottom: 20 }}>
                <Text style={{ color: COLORS.primary, fontWeight: '600' }}>Đã có tài khoản? Đăng nhập</Text>
              </TouchableOpacity>
            </ScrollView>
          </Sheet>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;


