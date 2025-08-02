import React from 'react'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useSettings } from '../contexts/SettingsContext'
import { useAuth } from '../contexts/AuthContext'

const Cart: React.FC = () => {
  const { cart, updateQuantity, removeItem, clearCart } = useCart()
  const { selectedNeighborhood, deliveryFee } = useSettings()
  const { user } = useAuth()

  const subtotal = cart.total
  const total = subtotal + deliveryFee

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleCheckout = () => {
    if (!user) {
      alert('Você precisa estar logado para finalizar o pedido.')
      return
    }
    
    if (!selectedNeighborhood) {
      alert('Selecione um bairro para entrega.')
      return
    }

    if (cart.items.length === 0) {
      alert('Seu carrinho está vazio.')
      return
    }

    // Here you would integrate with your order processing system
    alert('Funcionalidade de checkout será implementada em breve!')
  }

  if (cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Seu carrinho está vazio
        </h2>
        <p className="text-gray-600 mb-6">
          Adicione alguns produtos deliciosos ao seu carrinho!
        </p>
        <a href="/" className="btn-primary">
          Ver Produtos
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Seu Carrinho</h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-800 flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Limpar Carrinho
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map(item => (
            <div key={item.product.id} className="card">
              <div className="flex items-center gap-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.product.name}</h3>
                  <p className="text-gray-600 text-sm">{item.product.description}</p>
                  <p className="text-green-600 font-bold">
                    R$ {item.product.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-lg w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {item.quantity} x R$ {item.product.price.toFixed(2)}
                </span>
                <span className="font-bold text-lg">
                  R$ {(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h3 className="text-xl font-semibold mb-4">Resumo do Pedido</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              
              {selectedNeighborhood ? (
                <div className="flex justify-between">
                  <span>Taxa de Entrega ({selectedNeighborhood.name}):</span>
                  <span>R$ {deliveryFee.toFixed(2)}</span>
                </div>
              ) : (
                <div className="text-sm text-red-600">
                  Selecione um bairro para ver a taxa de entrega
                </div>
              )}
              
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>

            {!user && (
              <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded text-sm">
                Você precisa estar logado para finalizar o pedido.
              </div>
            )}

            {!selectedNeighborhood && (
              <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-800 rounded text-sm">
                Selecione um bairro na página inicial para continuar.
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={!user || !selectedNeighborhood}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Finalizar Pedido
            </button>

            <div className="mt-4 text-center">
              <a href="/" className="text-blue-600 hover:text-blue-800 text-sm">
                ← Continuar Comprando
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart