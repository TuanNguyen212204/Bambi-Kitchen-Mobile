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

  // API v3: POST /api/dish - dùng chung cho cả create và update
  // Theo web implementation: gửi FormData với các field riêng lẻ
  // CREATE: KHÔNG gửi field 'id' (hoặc id = null/undefined)
  // UPDATE: GỬI field 'id' với giá trị số hợp lệ
  // Ingredients format: ingredients[<ingredientId>] = <quantity> trong FormData
  create: async (request: DishCreateRequest): Promise<DishDto> => {
    const formData = new FormData();
    
    // QUAN TRỌNG: CREATE không gửi id (để backend tự tạo)
    // Chỉ gửi id khi update (id != null)
    const isUpdate = request.id != null && request.id !== undefined;
    if (isUpdate) {
      formData.append('id', String(request.id));
    }
    
    // Required fields
    formData.append('name', request.name);
    formData.append('dishType', request.dishType);
    
    // Optional fields
    if (request.description) {
      formData.append('description', request.description);
    }
    if (request.price != null) {
      formData.append('price', String(request.price));
    }
    
    // Account chỉ cần gửi id (theo web implementation: account.id = string number)
    if (request.account?.id != null) {
      formData.append('account.id', String(request.account.id));
    }
    
    // Public và Active
    if (request.public !== undefined) {
      formData.append('public', String(request.public));
    }
    if (request.active !== undefined) {
      formData.append('active', String(request.active));
    }
    
    // Ingredients: format ingredients[<ingredientId>] = <quantity>
    // CHỈ gửi những ingredients có quantity > 0 (theo web implementation)
    const ingredients = request.ingredients || {};
    Object.entries(ingredients)
      .filter(([, qty]) => qty > 0)
      .forEach(([ingId, qty]) => {
        formData.append(`ingredients[${ingId}]`, String(qty));
      });
    
    // UsedQuantity (nếu có)
    if (request.usedQuantity != null) {
      formData.append('usedQuantity', String(request.usedQuantity));
    }
    
    // File: Luôn gửi field 'file' (kể cả khi là empty file nếu không có file mới)
    if (request.file && typeof request.file !== 'string') {
      formData.append('file', request.file as any);
    } else {
      // Gửi empty file nếu không có file mới (theo web implementation)
      // Trong React Native, có thể tạo empty file object hoặc không gửi
      // Tạm thời không gửi nếu không có file
    }

    const res = await apiClient.post<DishDto>('/api/dish', formData);
    return (res.data?.data ?? res.data) as DishDto;
  },

  // API v3: POST /api/dish - dùng chung cho cả create và update
  // UPDATE: GỬI field 'id' với giá trị số hợp lệ
  // Theo web implementation: cùng endpoint với create, chỉ khác là có id
  update: async (request: DishUpdateRequest): Promise<DishDto> => {
    const formData = new FormData();
    
    // UPDATE: PHẢI gửi id
    formData.append('id', String(request.id));
    
    // Required fields
    if (request.name) {
      formData.append('name', request.name);
    }
    if (request.dishType) {
      formData.append('dishType', request.dishType);
    }
    
    // Optional fields
    if (request.description !== undefined) {
      formData.append('description', request.description);
    }
    if (request.price != null) {
      formData.append('price', String(request.price));
    }
    
    // Account chỉ cần gửi id (theo web implementation: account.id = string number)
    if (request.account?.id != null) {
      formData.append('account.id', String(request.account.id));
    }
    
    // Public và Active
    if (request.public !== undefined) {
      formData.append('public', String(request.public));
    }
    if (request.active !== undefined) {
      formData.append('active', String(request.active));
    }
    
    // Ingredients: format ingredients[<ingredientId>] = <quantity>
    // Nếu có ingredients trong request (DishUpdateRequest không có ingredients field mặc định)
    // Nhưng theo web implementation, update cũng có thể có ingredients
    // Tạm thời không xử lý ingredients cho update (vì DishUpdateRequest không có field này)
    
    // UsedQuantity (nếu có)
    if (request.usedQuantity != null) {
      formData.append('usedQuantity', String(request.usedQuantity));
    }
    
    // File: Luôn gửi field 'file' (kể cả khi là empty file nếu không có file mới)
    if (request.file && typeof request.file !== 'string') {
      formData.append('file', request.file as any);
    } else {
      // Gửi empty file nếu không có file mới (theo web implementation)
      // Trong React Native, có thể tạo empty file object hoặc không gửi
      // Tạm thời không gửi nếu không có file
    }

    // Dùng POST /api/dish (giống create) vì web cũng dùng POST cho cả create và update
    const res = await apiClient.post<DishDto>('/api/dish', formData);
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


