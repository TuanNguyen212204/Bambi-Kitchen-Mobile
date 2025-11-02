import apiClient from './apiClient';

export interface DishDto {
  id: number;
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  publicId?: string;
  account?: { id: number; name: string; role?: string };
  dishType?: 'PRESET' | 'CUSTOM';
  usedQuantity?: number;
  public?: boolean;
  active?: boolean;
}

export interface DishCategory {
  id: number;
  name: string;
  description?: string;
}

export interface IngredientsGetByDishResponse {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  publicId?: string;
  account?: { id: number; name: string; role?: string };
  ingredients: Array<{
    id: number;
    name: string;
    quantity?: number;
    unit?: string;
  }>;
  dishType: 'PRESET' | 'CUSTOM';
  public?: boolean;
  active?: boolean;
}

export interface DishCreateRequest {
  id?: number;
  name: string;
  description?: string;
  price?: number;
  account: { id: number };
  dishType: 'PRESET' | 'CUSTOM';
  ingredients: Record<number, number>; // Map<IngredientId, Quantity>
  usedQuantity?: number;
  file?: string | { uri: string; name: string; type: string };
  public?: boolean;
  active?: boolean;
}

export interface DishUpdateRequest {
  id: number;
  name?: string;
  description?: string;
  price?: number;
  account?: { id: number };
  dishType?: 'PRESET' | 'CUSTOM';
  usedQuantity?: number;
  file?: string | { uri: string; name: string; type: string };
  public?: boolean;
  active?: boolean;
}

export const dishService = {
  // Menu: GET /api/dish - chỉ bao gồm những dish active và public
  getAll: async (): Promise<DishDto[]> => {
    const res = await apiClient.get<DishDto[]>('/api/dish');
    return (res.data?.data ?? res.data ?? []) as DishDto[];
  },

  // Admin: GET /api/dish/get-all - bao gồm cả những dish không active và public
  getAllAdmin: async (): Promise<DishDto[]> => {
    const res = await apiClient.get<DishDto[]>('/api/dish/get-all');
    return (res.data?.data ?? res.data ?? []) as DishDto[];
  },

  getById: async (id: number): Promise<DishDto | null> => {
    try {
      const res = await apiClient.get<DishDto>(`/api/dish/${id}`);
      return (res.data?.data ?? res.data) as DishDto;
    } catch (error) {
      return null;
    }
  },

  getByAccountId: async (accountId: number): Promise<DishDto[]> => {
    const res = await apiClient.get<DishDto[]>(`/api/dish/account/${accountId}`);
    return (res.data?.data ?? res.data ?? []) as DishDto[];
  },

  // API v3: POST /api/dish với query params (Spring @RequestParam binding)
  // Theo API docs: "Account chỉ cần gửi Id, mấy field khác để trống"
  // Backend có thể dùng @RequestParam("request") String requestJson để parse JSON
  // Hoặc @ModelAttribute để bind từ FormData fields
  // Thử gửi request như query param JSON trước, nếu lỗi thì dùng FormData
  create: async (request: DishCreateRequest): Promise<DishDto> => {
    // Build request payload theo API v3 format
    const requestPayload = {
      id: request.id,
      name: request.name,
      description: request.description,
      price: request.price,
      account: { id: request.account.id }, // Chỉ gửi id
      dishType: request.dishType,
      ingredients: request.ingredients || {}, // Map<Integer, Integer>
      usedQuantity: request.usedQuantity,
      public: request.public,
      active: request.active,
    };

    // Cách 1: Gửi request như query param (JSON string) theo API docs
    // File (nếu có) gửi trong FormData body
    if (request.file && typeof request.file !== 'string') {
      const formData = new FormData();
      formData.append('file', request.file as any);
      const res = await apiClient.post<DishDto>('/api/dish', formData, {
        params: {
          request: JSON.stringify(requestPayload),
        },
      });
      return (res.data?.data ?? res.data) as DishDto;
    } else {
      // Không có file, gửi request như query param, body rỗng
      const res = await apiClient.post<DishDto>('/api/dish', undefined, {
        params: {
          request: JSON.stringify(requestPayload),
        },
      });
      return (res.data?.data ?? res.data) as DishDto;
    }
  },

  // API v3: PUT /api/dish với query params (Spring @RequestParam binding)
  update: async (request: DishUpdateRequest): Promise<DishDto> => {
    const formData = new FormData();
    formData.append('id', String(request.id));
    if (request.name) formData.append('name', request.name);
    if (request.description !== undefined) formData.append('description', request.description);
    if (request.price != null) formData.append('price', String(request.price));
    if (request.account) formData.append('account', JSON.stringify(request.account));
    if (request.dishType) formData.append('dishType', request.dishType);
    if (request.usedQuantity != null) formData.append('usedQuantity', String(request.usedQuantity));
    if (request.file && typeof request.file !== 'string') {
      formData.append('file', request.file as any);
    }
    if (request.public !== undefined) formData.append('public', String(request.public));
    if (request.active !== undefined) formData.append('active', String(request.active));

    // Spring @RequestParam với multipart sẽ bind từ form fields
    const res = await apiClient.put<DishDto>('/api/dish', formData);
    return (res.data?.data ?? res.data) as DishDto;
  },

  togglePublic: async (id: number): Promise<boolean> => {
    const res = await apiClient.get<boolean>(`/api/dish/toggle-public/${id}`);
    return (res.data?.data ?? res.data) as boolean;
  },

  toggleActive: async (id: number): Promise<boolean> => {
    const res = await apiClient.get<boolean>(`/api/dish/toggle-active/${id}`);
    return (res.data?.data ?? res.data) as boolean;
  },

  saveCustomDish: async (id: number, isPublic: boolean): Promise<void> => {
    await apiClient.put(`/api/dish/save-custom-dish`, null, {
      params: { id, isPublic },
    });
  },

  getCategories: async (): Promise<DishCategory[]> => {
    const res = await apiClient.get<DishCategory[]>('/api/dish-category');
    return (res.data?.data ?? res.data ?? []) as DishCategory[];
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/dish/${id}`);
  },
};


