import React, { useEffect, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@store/store';
import { fetchAllIngredients } from '@store/slices/ingredientSlice';

const IngredientStockHistoryScreen = () => {
  const route = useRoute<any>();
  const dispatch = useAppDispatch();
  const { transactions = [], ingredients = [] } = useAppSelector((s) => s.ingredient || {});
  const ingredientId: number = route.params?.ingredientId;

  useEffect(() => {
    if (!ingredients.length) dispatch(fetchAllIngredients());
  }, [dispatch]);

  const data = useMemo(() => transactions.filter((t) => (t.ingredient as any)?.id === ingredientId), [transactions, ingredientId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử tồn kho #{ingredientId}</Text>
      <FlatList
        data={data}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.transactionType ? '+' : '-'}{item.quantity}</Text>
            {!!item.createdAt && <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  item: { padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 8 },
  time: { color: '#666', marginTop: 4 },
});

export default IngredientStockHistoryScreen;


