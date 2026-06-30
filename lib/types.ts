export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  badge: string | null;
  rating: number;
  review_count: number;
  is_active: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new_arrival: boolean;
  material: string | null;
  care_instructions: string | null;
  created_at: string;
  updated_at: string;
  categories?: Category;
  product_variants?: ProductVariant[];
  product_images?: ProductImage[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string | null;
  color: string | null;
  color_hex: string | null;
  stock_quantity: number;
  sku: string | null;
  price_adjustment: number;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
}

export interface CartItem {
  id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  size: string | null;
  color: string | null;
  product: Product;
}

export interface Order {
  id: string;
  user_id?: string | null;
  order_number: string;
  status: string;
  subtotal: number;
  shipping_amount: number;
  discount_amount: number;
  total: number;
  coupon_code: string | null;
  payment_method: string | null;
  payment_status: string;
  shipping_address: ShippingAddress | null;
  notes?: string | null;
  created_at: string;
  updated_at?: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  size: string | null;
  color: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Address {
  id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

export interface ShippingAddress {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  is_active: boolean;
}

export interface LocalCartItem {
  product: Product;
  quantity: number;
  size: string | null;
  color: string | null;
}
