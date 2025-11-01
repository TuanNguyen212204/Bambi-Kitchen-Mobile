import { IngredientDTO } from '@types/api';

export type BuilderStep = 'rice' | 'protein' | 'veggies' | 'soup' | 'dessert';
export type OrderStep = BuilderStep | 'confirm' | 'payment' | 'review';

export interface SelectedIngredient {
  ingredient: IngredientDTO;
  quantity: number; // in grams or unit
  calories?: number; // calculated calories
  price: number; // calculated price
}

export interface OrderBuilderState {
  rice?: SelectedIngredient[];
  protein: SelectedIngredient[];
  veggies?: SelectedIngredient[];
  soup?: SelectedIngredient[];
  dessert?: SelectedIngredient[];
  dishTemplate?: {
    size: 'S' | 'M' | 'L';
    name: string;
    priceRatio: number;
    quantityRatio: number;
    max_Carb?: number;
    max_Protein?: number;
    max_Vegetable?: number;
    max_Fat?: number;
  };
}

export interface OrderSummary {
  totalPrice: number;
  totalCalories: number;
  items: {
    category: string;
    ingredients: SelectedIngredient[];
  }[];
}

export interface SavedOrderBuilder {
  id: string;
  createdAt: string;
  state: OrderBuilderState;
  summary: OrderSummary;
}
