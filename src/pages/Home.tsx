import React, { useState } from 'react'
import { Plus, Filter } from 'lucide-react'
import { useProducts } from '../contexts/ProductContext'
import { useCart } from '../contexts/CartContext'
import { useSettings } from '../contexts/SettingsContext'
import { Product } from '../types'

const Home: React.FC = () => {
  const { products, loading } = useProducts()
  const { addItem } = useCart()
  const { neighborhoods, selectedNeighborhood, selectNeighborhood } = useSettings()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showNeighborhoodSelector, setShowNeighborhoodSelector] = useState(false)

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))]
  
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  const handleAddToCart = (product: Product) => {
    addItem(product)
    // Simple feedback - you could add a toast notification here
    console.log(`${product.name} adicionado ao carrinho!`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Neighborhood Selection */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Selecione seu bairro para entrega</h2>
        <div className="flex flex-wrap gap-2">
          {neighborhoods.map(neighborhood => (
            <button
              key={neighborhood.id}
              onClick={() => selectNeighborhood(neighborhood)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                selectedNeighborhood?.id === neighborhood.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
              }`}
            >
              {neighborhood.name} - R$ {neighborhood.delivery_fee.toFixed(2)}
            </button>
          ))}
        </div>
        {selectedNeighborhood && (
          <p className="mt-2 text-sm text-green-600">
            Taxa de entrega: R$ {selectedNeighborhood.delivery_fee.toFixed(2)}
          </p>
        )}
      </div>

      {/* Category Filter */}
      <div className="card">
        <div className="flex items-center gap-4 mb-4">
          <Filter className="w-5 h-5" />
          <h3 className="font-semibold">Categorias</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category === 'all' ? 'Todos' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="card hover:shadow-lg transition-shadow">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">
                R$ {product.price.toFixed(2)}
              </span>
              <button
                onClick={() => handleAddToCart(product)}
                disabled={!product.available}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>
            {!product.available && (
              <p className="text-red-500 text-sm mt-2">Produto indisponível</p>
            )}
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum produto encontrado nesta categoria.</p>
        </div>
      )}
    </div>
  )
}

export default Home