import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: 700;
`;

const DashboardScreen = () => {
  return (
    <Container>
      <Title>Admin Dashboard</Title>
    </Container>
  );
};

export default DashboardScreen;


