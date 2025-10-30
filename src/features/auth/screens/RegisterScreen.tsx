import React, { useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import Button from '@components/common/Button';
import { COLORS, SIZES } from '@constants';
import { authService } from '@services/api/authService';

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
  padding: 24px;
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

const RegisterScreen: React.FC<any> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ các trường');
      return;
    }
    setLoading(true);
    try {
      await authService.register({ name, mail: email, password, role: 'USER' });
      Alert.alert('Thành công', 'Đăng ký thành công. Vui lòng đăng nhập.');
      navigation.navigate('Login');
    } catch (e: any) {
      Alert.alert('Lỗi', e?.message || 'Không thể đăng ký');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Tạo tài khoản</Title>
      <Subtitle>Đăng ký để trải nghiệm Bambi Kitchen</Subtitle>

      <Input placeholder="Họ và tên" value={name} onChangeText={setName} />
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Input
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Đăng ký" onPress={onRegister} loading={loading} fullWidth />
      <Button
        title="Đã có tài khoản? Đăng nhập"
        variant="outline"
        onPress={() => navigation.navigate('Login')}
        style={{ marginTop: 8 }}
        fullWidth
      />
    </Container>
  );
};

export default RegisterScreen;


