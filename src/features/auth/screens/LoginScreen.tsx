import React, { useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import Button from '@components/common/Button';
import { COLORS, SIZES } from '@constants';

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
  padding: 24px;
  justify-content: center;
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
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!username || !password) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ tài khoản và mật khẩu');
      return;
    }
    setLoading(true);
    // UI only – logic sẽ được thêm ở các nhánh kế tiếp
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Thông báo', 'Đăng nhập UI hoạt động');
    }, 600);
  };

  return (
    <Container>
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
    </Container>
  );
};

export default LoginScreen;


