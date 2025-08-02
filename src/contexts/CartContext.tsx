import React, { createContext, useContext, useState, useEffect } from 'react'
import { CartState, Cart, Product, CartItem } from '../types'

const CartContext = createContext<CartState | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(() => {
    const savedCart = localStorage.getItem('cart')
    return savedCart ? JSON.parse(savedCart) : { items: [], total: 0 }
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const addItem = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(
        item => item.product.id === product.id
      )

      let newItems: CartItem[]

      if (existingItemIndex >= 0) {
        newItems = [...prevCart.items]
        newItems[existingItemIndex].quantity += quantity
      } else {
        newItems = [...prevCart.items, { product, quantity }]
      }

      return {
        items: newItems,
        total: calculateTotal(newItems)
      }
    })
  }

  const removeItem = (productId: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.product.id !== productId)
      return {
        items: newItems,
        total: calculateTotal(newItems)
      }
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
      return {
        items: newItems,
        total: calculateTotal(newItems)
      }
    })
  }

  const clearCart = () => {
    setCart({ items: [], total: 0 })
  }

  const value: CartState = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}