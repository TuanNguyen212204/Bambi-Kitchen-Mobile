import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Ingredient, IngredientCategory, IngredientDTO, InventoryTransaction } from '@types/api';
import {
  getIngredients,
  getAllTransactions,
  getAllCategories,
  createIngredient,
  updateIngredient,
  deleteIngredient,
  toggleActiveIngredient,
  createTransaction,
  searchIngredientsByName,
} from '@services/api';
import { mapIngredientDTO } from '@services/api/multipartHelpers';

export type StockStatus = 'out' | 'low' | 'normal';

export interface IngredientFilters {
  categoryId?: number | null;
  status?: 'active' | 'inactive' | 'all';
  stockStatus?: StockStatus | 'all';
  keyword?: string;
}

interface IngredientState {
  ingredients: Ingredient[];
  categories: IngredientCategory[];
  transactions: InventoryTransaction[];
  loading: boolean;
  error?: string | null;
  filters: IngredientFilters;
}

const initialState: IngredientState = {
  ingredients: [],
  categories: [],
  transactions: [],
  loading: false,
  error: null,
  filters: { status: 'all', stockStatus: 'all', categoryId: null, keyword: '' },
};

function buildTransactionStockMap(trans: InventoryTransaction[]): Record<number, number> {
  const map: Record<number, number> = {};
  for (const t of trans) {
    const id = typeof (t.ingredient as any).id === 'number' ? (t.ingredient as any).id : (t.ingredient as any)?.id;
    const current = map[id] ?? 0;
    map[id] = current + (t.transactionType ? t.quantity : -t.quantity);
  }
  return map;
}

function mapListWithStock(list: IngredientDTO[], transactions: InventoryTransaction[]): Ingredient[] {
  const stockMap = buildTransactionStockMap(transactions);
  return list.map((dto) => mapIngredientDTO(dto, stockMap));
}

export const fetchAllIngredients = createAsyncThunk('ingredients/fetchAll', async (_, { rejectWithValue, getState }) => {
  try {
    const [list, txs] = await Promise.all([getIngredients(), getAllTransactions()]);
    return { list, txs } as { list: IngredientDTO[]; txs: InventoryTransaction[] };
  } catch (e: any) {
    return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to fetch ingredients');
  }
});

export const fetchCategories = createAsyncThunk('ingredients/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const categories = await getAllCategories();
    return categories;
  } catch (e: any) {
    return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to fetch categories');
  }
});

export const createIngredientThunk = createAsyncThunk(
  'ingredients/create',
  async (
    payload: { name: string; categoryId: number; unit: string; pricePerUnit?: number | null; image?: { uri: string; name: string; type: string } | null },
    { rejectWithValue }
  ) => {
    try {
      await createIngredient(payload);
      const [list, txs] = await Promise.all([getIngredients(), getAllTransactions()]);
      return { list, txs } as { list: IngredientDTO[]; txs: InventoryTransaction[] };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to create ingredient');
    }
  }
);

export const updateIngredientThunk = createAsyncThunk(
  'ingredients/update',
  async (
    payload: {
      id: number;
      name: string;
      unit: string;
      active: boolean;
      available?: number | null;
      quantity?: number | null;
      reserve?: number | null;
      pricePerUnit?: number | null;
      image?: { uri: string; name: string; type: string } | null;
    },
    { rejectWithValue }
  ) => {
    try {
      await updateIngredient(payload);
      const [list, txs] = await Promise.all([getIngredients(), getAllTransactions()]);
      return { list, txs } as { list: IngredientDTO[]; txs: InventoryTransaction[] };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to update ingredient');
    }
  }
);

export const deleteIngredientThunk = createAsyncThunk('ingredients/delete', async (id: number, { rejectWithValue }) => {
  try {
    await deleteIngredient(id);
    const [list, txs] = await Promise.all([getIngredients(), getAllTransactions()]);
    return { list, txs } as { list: IngredientDTO[]; txs: InventoryTransaction[] };
  } catch (e: any) {
    return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to delete ingredient');
  }
});

export const toggleActiveThunk = createAsyncThunk('ingredients/toggleActive', async (id: number, { rejectWithValue }) => {
  try {
    await toggleActiveIngredient(id);
    const [list, txs] = await Promise.all([getIngredients(), getAllTransactions()]);
    return { list, txs } as { list: IngredientDTO[]; txs: InventoryTransaction[] };
  } catch (e: any) {
    return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to toggle active');
  }
});

export const adjustStockThunk = createAsyncThunk(
  'ingredients/adjustStock',
  async (payload: { ingredientId: number; quantity: number; transactionType: boolean }, { rejectWithValue }) => {
    try {
      await createTransaction({ ingredient: { id: payload.ingredientId }, quantity: payload.quantity, transactionType: payload.transactionType });
      const [list, txs] = await Promise.all([getIngredients(), getAllTransactions()]);
      return { list, txs } as { list: IngredientDTO[]; txs: InventoryTransaction[] };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to adjust stock');
    }
  }
);

export const searchByNameThunk = createAsyncThunk('ingredients/searchByName', async (keyword: string, { rejectWithValue }) => {
  try {
    const [list, txs] = await Promise.all([searchIngredientsByName(keyword), getAllTransactions()]);
    return { list, txs } as { list: IngredientDTO[]; txs: InventoryTransaction[] };
  } catch (e: any) {
    return rejectWithValue(e?.response?.data?.message || e.message || 'Failed to search ingredients');
  }
});

const slice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<IngredientFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters(state) {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    const start = (state: IngredientState) => {
      state.loading = true;
      state.error = null;
    };
    const failure = (state: IngredientState, action: any) => {
      state.loading = false;
      state.error = action.payload || 'Request failed';
    };

    builder
      .addCase(fetchAllIngredients.pending, start)
      .addCase(fetchAllIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.txs;
        state.ingredients = mapListWithStock(action.payload.list, action.payload.txs);
      })
      .addCase(fetchAllIngredients.rejected, failure)

      .addCase(fetchCategories.pending, start)
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload as IngredientCategory[];
      })
      .addCase(fetchCategories.rejected, failure)

      .addCase(createIngredientThunk.pending, start)
      .addCase(createIngredientThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.txs;
        state.ingredients = mapListWithStock(action.payload.list, action.payload.txs);
      })
      .addCase(createIngredientThunk.rejected, failure)

      .addCase(updateIngredientThunk.pending, start)
      .addCase(updateIngredientThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.txs;
        state.ingredients = mapListWithStock(action.payload.list, action.payload.txs);
      })
      .addCase(updateIngredientThunk.rejected, failure)

      .addCase(deleteIngredientThunk.pending, start)
      .addCase(deleteIngredientThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.txs;
        state.ingredients = mapListWithStock(action.payload.list, action.payload.txs);
      })
      .addCase(deleteIngredientThunk.rejected, failure)

      .addCase(toggleActiveThunk.pending, start)
      .addCase(toggleActiveThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.txs;
        state.ingredients = mapListWithStock(action.payload.list, action.payload.txs);
      })
      .addCase(toggleActiveThunk.rejected, failure)

      .addCase(adjustStockThunk.pending, start)
      .addCase(adjustStockThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.txs;
        state.ingredients = mapListWithStock(action.payload.list, action.payload.txs);
      })
      .addCase(adjustStockThunk.rejected, failure)

      .addCase(searchByNameThunk.pending, start)
      .addCase(searchByNameThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.txs;
        state.ingredients = mapListWithStock(action.payload.list, action.payload.txs);
      })
      .addCase(searchByNameThunk.rejected, failure);
  },
});

export const { setFilters, clearFilters } = slice.actions;
export default slice.reducer;


