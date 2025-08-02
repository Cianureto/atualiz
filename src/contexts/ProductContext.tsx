import React, { createContext, useContext, useState, useEffect } from 'react'
import { ProductState, Product } from '../types'

const ProductContext = createContext<ProductState | undefined>(undefined)

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}

// Mock products data for now
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Pizza Margherita',
    description: 'Pizza clássica com molho de tomate, mussarela e manjericão',
    price: 35.90,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400',
    category: 'Pizza',
    available: true
  },
  {
    id: '2',
    name: 'Hambúrguer Artesanal',
    description: 'Hambúrguer 180g com queijo, alface, tomate e batata frita',
    price: 28.50,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    category: 'Hambúrguer',
    available: true
  },
  {
    id: '3',
    name: 'Sushi Combo',
    description: 'Combinado com 20 peças variadas de sushi e sashimi',
    price: 65.00,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    category: 'Japonês',
    available: true
  },
  {
    id: '4',
    name: 'Açaí 500ml',
    description: 'Açaí cremoso com granola, banana e mel',
    price: 18.90,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
    category: 'Sobremesa',
    available: true
  },
  {
    id: '5',
    name: 'Pizza Calabresa',
    description: 'Pizza com calabresa, cebola, mussarela e orégano',
    price: 38.90,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
    category: 'Pizza',
    available: true
  },
  {
    id: '6',
    name: 'Refrigerante Lata',
    description: 'Coca-Cola, Pepsi ou Guaraná Antarctica 350ml',
    price: 5.50,
    image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400',
    category: 'Bebida',
    available: true
  }
]

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProducts(mockProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const value: ProductState = {
    products,
    loading,
    fetchProducts,
  }

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}