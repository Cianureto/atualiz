export interface User {
  id: string
  email: string
  name?: string
  phone?: string
  address?: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  available: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
}

export interface Neighborhood {
  id: string
  name: string
  delivery_fee: number
  active: boolean
}

export interface Order {
  id: string
  user_id: string
  items: CartItem[]
  total: number
  delivery_fee: number
  neighborhood_id: string
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

export interface CartState {
  cart: Cart
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

export interface ProductState {
  products: Product[]
  loading: boolean
  fetchProducts: () => Promise<void>
}

export interface SettingsState {
  neighborhoods: Neighborhood[]
  selectedNeighborhood: Neighborhood | null
  deliveryFee: number
  loading: boolean
  fetchNeighborhoods: () => Promise<void>
  selectNeighborhood: (neighborhood: Neighborhood) => void
}