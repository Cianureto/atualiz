import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import LoginModal from './LoginModal'

const Header: React.FC = () => {
  const { user, signOut } = useAuth()
  const { cart } = useCart()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const cartItemsCount = cart.items.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Delivery App
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Início
            </Link>
            <Link 
              to="/cart" 
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5 mr-1" />
              Carrinho
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/profile" 
                  className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="w-5 h-5 mr-1" />
                  Perfil
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="btn-primary"
              >
                Entrar
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Início
              </Link>
              <Link 
                to="/cart" 
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Carrinho ({cartItemsCount})
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <User className="w-5 h-5 mr-2" />
                    Perfil
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setShowMobileMenu(false)
                    }}
                    className="flex items-center text-gray-700 hover:text-red-600 transition-colors text-left"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Sair
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowLoginModal(true)
                    setShowMobileMenu(false)
                  }}
                  className="btn-primary text-left"
                >
                  Entrar
                </button>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </header>
  )
}

export default Header