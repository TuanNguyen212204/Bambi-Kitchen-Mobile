import React from 'react';
import { Alert, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@store/store';
import { logoutThunk } from '@store/thunks/authThunks';
import { useNavigation } from '@react-navigation/native';

const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;

const Header = styled.View`
  background-color: #ffffff;
  padding: 20px;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
`;

const HeaderTitle = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #111;
`;

const HeaderSubtitle = styled.Text`
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 20px;
`;

const StatCard = styled.View`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 16px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 8px;
  elevation: 2;
`;

const StatLabel = styled.Text`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
`;

const StatValue = styled.Text`
  font-size: 32px;
  font-weight: 700;
  color: #ef4444;
`;

const BottomNav = styled.View`
  background-color: #ffffff;
  border-top-width: 1px;
  border-top-color: #e5e7eb;
  padding: 12px 20px;
  flex-direction: row;
  align-items: center;
`;

const NavButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 12px;
  background-color: #f3f4f6;
`;

const NavButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #111;
  margin-left: 8px;
`;

const DashboardScreen = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        onPress: async () => {
          await dispatch(logoutThunk()).unwrap();
          navigation.navigate('Login');
        },
      },
    ]);
  };

  const handleGoToProfile = () => {
    navigation.navigate('MainTabs', { screen: 'Profile' });
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>Admin Dashboard</HeaderTitle>
        <HeaderSubtitle>Chào mừng, {user?.name || 'Admin'}</HeaderSubtitle>
      </Header>
      <Content>
        <StatCard>
          <StatLabel>Tổng đơn hàng</StatLabel>
          <StatValue>0</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Số người dùng</StatLabel>
          <StatValue>0</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Doanh thu</StatLabel>
          <StatValue>0 ₫</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Món ăn</StatLabel>
          <StatValue>0</StatValue>
        </StatCard>
      </Content>
      <BottomNav>
        <NavButton onPress={handleGoToProfile}>
          <Ionicons name="person-outline" size={24} color="#111" />
          <NavButtonText>Trang chủ</NavButtonText>
        </NavButton>
        <NavButton onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#ef4444" />
          <NavButtonText style={{ color: '#ef4444' }}>Đăng xuất</NavButtonText>
        </NavButton>
      </BottomNav>
    </Container>
  );
};

export default DashboardScreen;


