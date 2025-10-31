import apiClient from './apiClient';
import { storage } from '@utils/storage';
import { buildIngredientFormData } from './multipartHelpers';

const base = '/api/ingredient';

export async function getIngredients(): Promise<any[]> {
  const { data } = await apiClient.get<any[]>(base);
  return data;
}

export async function getIngredientById(id: number): Promise<any> {
  const { data } = await apiClient.get<any>(`${base}/${id}`);
  return data;
}

export async function searchIngredientsByName(name: string): Promise<any[]> {
  const { data } = await apiClient.get<any[]>(`${base}/search`, { params: { name } });
  return data;
}

export async function createIngredient(payload: {
  name: string;
  categoryId: number;
  unit: string;
  pricePerUnit?: number | null;
  image?: { uri: string; name: string; type: string } | null;
}): Promise<void> {
  const form = new FormData();
  form.append('name', payload.name);
  form.append('categoryId', String(payload.categoryId));
  form.append('unit', String(payload.unit));
  if (payload.pricePerUnit != null) form.append('pricePerUnit', String(payload.pricePerUnit));
  if (payload.image) {
    form.append('file', payload.image as any);
  }
  await apiClient.post(base, form);
}

export async function updateIngredient(payload: {
  id: number;
  name: string;
  unit: string;
  active: boolean;
  available?: number | null;
  quantity?: number | null;
  reserve?: number | null;
  pricePerUnit?: number | null;
  categoryId?: number | null;
  image?: { uri: string; name: string; type: string } | null;
}): Promise<void> {
  const form = await buildIngredientFormData(payload as any);
  const p = payload as any;
  const params = {
    ingredient: {
      id: p.id,
      name: p.name,
      unit: p.unit,
      active: p.active,
      ...(p.quantity != null ? { quantity: p.quantity } : {}),
      ...(p.available != null ? { available: p.available } : {}),
      ...(p.reserve != null ? { reserve: p.reserve } : {}),
      ...(p.pricePerUnit != null ? { pricePerUnit: p.pricePerUnit } : {}),
      ...(p.categoryId != null ? { categoryId: p.categoryId } : {}),
    },
  } as any;

  if (__DEV__) {
    try {
      const url = apiClient.getUri({ url: base, params });
      const formKeys: string[] = [
        'id',
        'name',
        'unit',
        'active',
        ...(p.available != null ? ['available'] : []),
        ...(p.quantity != null ? ['quantity'] : []),
        ...(p.reserve != null ? ['reserve'] : []),
        ...(p.pricePerUnit != null ? ['pricePerUnit'] : []),
        ...(p.categoryId != null ? ['categoryId'] : []),
        'file',
      ];
      const auth = await storage.getItem<string>('authToken');
      const maskedAuth = auth ? `Bearer ${String(auth).slice(0, 6)}…${String(auth).slice(-6)}` : undefined;
      // Important debug payload for BE parity check
      // eslint-disable-next-line no-console
      console.log('[ING_UPDATE_DEBUG] URL=', url);
      // eslint-disable-next-line no-console
      console.log('[ING_UPDATE_DEBUG] FormData keys=', formKeys);
      // eslint-disable-next-line no-console
      console.log('[ING_UPDATE_DEBUG] Headers=', { Authorization: maskedAuth, hasManualContentType: false });
    } catch {}
  }

  const token = await storage.getItem<string>('authToken');
  const baseUrl = `${(apiClient.defaults as any).baseURL || ''}${base}`;
  const search = new URLSearchParams();
  const ing = params.ingredient as any;
  // Build bracket notation explicitly to match Web/Postman behavior
  Object.entries(ing).forEach(([k, v]) => {
    if (v !== undefined && v !== null) search.append(`ingredient[${k}]`, String(v));
  });

  const url = `${baseUrl}?${search.toString()}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: token ? { Authorization: `Bearer ${token}` } as any : ({} as any),
    body: form as any, // keep RN to set multipart boundary
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
}

export async function deleteIngredient(id: number): Promise<void> {
  await apiClient.delete(`${base}/${id}`);
}

export async function toggleActiveIngredient(id: number): Promise<boolean> {
  const { data } = await apiClient.get<boolean>(`${base}/toggle-active/${id}`);
  return data;
}


