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
  letter-spacing: 8px;
  text-align: center;
`;

const OTPInputContainer = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-bottom: 12px;
`;

const OTPInputBox = styled.TextInput`
  flex: 1;
  border-width: 1px;
  border-color: ${COLORS.border};
  border-radius: 12px;
  padding: 14px;
  text-align: center;
  font-size: 24px;
  font-weight: 700;
`;

const BackButton = styled(TouchableOpacity)`
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 10;
`;

interface OTPScreenProps {
  navigation: any;
  route: {
    params: {
      email: string;
    };
  };
}

const OTPScreen: React.FC<OTPScreenProps> = ({ navigation, route }) => {
  const { email } = route.params || {};
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const onVerify = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Lỗi', 'Vui lòng nhập mã OTP 6 chữ số');
      return;
    }
    setLoading(true);
    try {
      await authService.verifyOTP(email, otp);
      Alert.alert('Thành công', 'Xác thực OTP thành công');
      navigation.navigate('ResetPassword', { email, otp });
    } catch (e: any) {
      Alert.alert('Lỗi', e?.message || 'Mã OTP không đúng');
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
                <Title>Nhập mã OTP</Title>
              </TitleContainer>
              <Subtitle>Nhập mã OTP 6 chữ số được gửi đến email của bạn</Subtitle>
              <Input
                placeholder="000000"
                value={otp}
                onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, '').substring(0, 6))}
                keyboardType="number-pad"
                autoCapitalize="none"
                maxLength={6}
              />
              <Button title="Xác nhận" onPress={onVerify} loading={loading} fullWidth style={{ borderRadius: 24 }} />
            </View>
          </Sheet>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OTPScreen;

