import type { Ingredient, IngredientDTO, IngredientUnit } from '../../types/api';
import * as FileSystem from 'expo-file-system/legacy';

type ImageInput =
  | { uri: string; name: string; type: string }
  | null
  | undefined;

export function normalizeUnit(unit: string): IngredientUnit {
  const value = String(unit).toUpperCase();
  if (value === 'GRAM' || value === 'KILOGRAM' || value === 'LITER' || value === 'PCS') {
    return value as IngredientUnit;
  }
  return 'PCS';
}

export function parseNumberMaybe(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  }
  return null;
}

export function deriveStockFrom(dto: IngredientDTO, transactionsById?: Record<number, number>): { stock: number; stockStatus: 'out' | 'low' | 'normal' } {
  const prioritized = parseNumberMaybe(dto.quantity) ?? parseNumberMaybe(dto.available);
  let stock = prioritized ?? 0;
  if (prioritized == null && transactionsById && dto.id in transactionsById) {
    stock = transactionsById[dto.id];
  }
  const stockStatus: 'out' | 'low' | 'normal' = stock <= 0 ? 'out' : stock <= 5 ? 'low' : 'normal';
  return { stock, stockStatus };
}

export function mapIngredientDTO(dto: IngredientDTO, transactionsById?: Record<number, number>): Ingredient {
  const { stock, stockStatus } = deriveStockFrom(dto, transactionsById);
  return {
    id: dto.id,
    name: dto.name,
    unit: normalizeUnit(String(dto.unit)),
    category: typeof dto.category === 'string' || dto.category == null ? null : dto.category,
    active: dto.active ?? true,
    imgUrl: dto.imgUrl ?? null,
    quantity: parseNumberMaybe(dto.quantity),
    available: parseNumberMaybe(dto.available),
    reserve: parseNumberMaybe(dto.reserve),
    pricePerUnit: parseNumberMaybe(dto.pricePerUnit),
    stock,
    stockStatus,
  };
}

export async function buildIngredientFormData(params: {
  id?: number;
  name: string;
  categoryId: number;
  unit: IngredientUnit | string;
  active?: boolean;
  available?: number | null;
  quantity?: number | null;
  reserve?: number | null;
  pricePerUnit?: number | null;
  image?: ImageInput;
}): Promise<FormData> {
  const form = new FormData();
  if (params.id != null) form.append('id', String(params.id));
  form.append('name', params.name);
  if (params.categoryId != null) form.append('categoryId', String(params.categoryId));
  form.append('unit', String(params.unit));
  if (typeof params.active === 'boolean') form.append('active', String(params.active));
  if (params.available != null) form.append('available', String(params.available));
  if (params.quantity != null) form.append('quantity', String(params.quantity));
  if (params.reserve != null) form.append('reserve', String(params.reserve));
  if (params.pricePerUnit != null) form.append('pricePerUnit', String(params.pricePerUnit));

  if (params.image && params.image.uri) {
    form.append('file', params.image as any);
  } else {
    // Tạo file rỗng 0-byte hợp lệ để gửi như một multipart file real (name + type)
    const dummyPath = `${FileSystem.cacheDirectory || FileSystem.documentDirectory}empty.txt`;
    // Best-effort write 0-byte if not exists
    try {
      const info = await FileSystem.getInfoAsync(dummyPath);
      if (!info.exists) {
        // @ts-ignore md5 optional
        await FileSystem.writeAsStringAsync(dummyPath, '');
      }
    } catch (e) {
      // ignore
    }
    form.append('file', { uri: dummyPath, name: 'empty.txt', type: 'application/octet-stream' } as any);
  }
  return form;
}


