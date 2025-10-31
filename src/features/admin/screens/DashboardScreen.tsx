import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { useAppSelector } from '@store/store';
import { useFocusEffect } from '@react-navigation/native';
import { orderService } from '@services/api';

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

const Content = styled.View`
  flex: 1;
  padding: 20px;
`;

const Card = styled.View`
  background-color: #ffffff;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 12px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
`;

const Meta = styled.Text`
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
`;

const Badge = styled.View`
  background-color: #f3f4f6;
  padding: 6px 10px;
  border-radius: 9999px;
`;

const BadgeText = styled.Text`
  font-size: 12px;
  color: #374151;
  font-weight: 600;
`;

const Actions = styled.View`
  flex-direction: row;
  margin-top: 12px;
`;

const ActionBtn = styled.TouchableOpacity`
  background-color: #111827;
  padding: 10px 14px;
  border-radius: 12px;
  margin-right: 8px;
`;

const ActionText = styled.Text`
  color: #fff;
  font-weight: 600;
`;

const OrderList = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders({ status: 'NEW' });
      setOrders(data as any);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const assign = async (id: number) => {
    await orderService.assignOrder(id);
    await load();
  };

  const update = async (id: number, status: any) => {
    await orderService.updateStatus(id, status);
    await load();
  };

  const confirmCOD = async (id: number) => {
    await orderService.confirmCOD(id);
    await load();
  };

  const renderItem = ({ item }: { item: any }) => {
    const isCOD = (item.paymentMethod || '').toUpperCase() === 'COD';
    return (
      <Card>
        <Row>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Title>{item.code || `Đơn #${item.id}`}</Title>
            <Meta>
              {item.customerName || 'Khách lẻ'} • {item.createdAt ? new Date(item.createdAt).toLocaleTimeString() : ''}
            </Meta>
          </View>
          <Badge>
            <BadgeText>{item.status}</BadgeText>
          </Badge>
        </Row>
        <View style={{ marginTop: 10 }}>
          {(item.items || []).map((it: any) => (
            <View key={it.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ color: '#111827', fontWeight: '600' }}>{it.dishName}</Text>
              <Text style={{ color: '#6b7280' }}>x{it.quantity}</Text>
            </View>
          ))}
        </View>
        <Actions>
          {item.status === 'NEW' && (
            <ActionBtn onPress={() => assign(item.id)}>
              <ActionText>Nhận đơn</ActionText>
            </ActionBtn>
          )}
          {(item.status === 'ASSIGNED' || item.status === 'NEW') && (
            <ActionBtn onPress={() => update(item.id, 'PREPARING')}>
              <ActionText>Bắt đầu nấu</ActionText>
            </ActionBtn>
          )}
          {item.status === 'PREPARING' && (
            <ActionBtn onPress={() => update(item.id, 'DONE')}>
              <ActionText>Hoàn tất</ActionText>
            </ActionBtn>
          )}
          {item.status === 'DONE' && isCOD && !item.isPaid && (
            <ActionBtn onPress={() => confirmCOD(item.id)}>
              <ActionText>Xác nhận COD</ActionText>
            </ActionBtn>
          )}
        </Actions>
      </Card>
    );
  };

  return (
    <FlatList
      data={orders}
      keyExtractor={(it) => String(it.id)}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 24 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListHeaderComponent={() => (
        <View style={{ marginBottom: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>Đơn mới</Text>
          <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Danh sách đơn hàng chờ xử lý</Text>
        </View>
      )}
      ListEmptyComponent={!loading ? (
        <Card>
          <Text style={{ color: '#6b7280' }}>Không có đơn mới</Text>
        </Card>
      ) : null}
    />
  );
};

// bottom actions removed; accessible via footbar

const DashboardScreen = () => {
  const user = useAppSelector((s) => s.auth.user);


  return (
    <Container>
      <Header>
        <HeaderTitle>Staff Dashboard</HeaderTitle>
        <HeaderSubtitle>Chào mừng, {user?.name || 'Staff'}</HeaderSubtitle>
      </Header>
      <Content>
        <OrderList />
      </Content>
    </Container>
  );
};

export default DashboardScreen;


