import React, { useState } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface LoginModalProps {
  onClose: () => void
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const { signIn, signUp, resetPassword } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password)
        onClose()
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('As senhas não coincidem')
        }
        await signUp(formData.email, formData.password)
        setSuccess('Conta criada com sucesso! Verifique seu email.')
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!formData.email) {
      setError('Digite seu email para recuperar a senha')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await resetPassword(formData.email)
      setSuccess('Email de recuperação enviado! Verifique sua caixa de entrada.')
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar email de recuperação')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input-field"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input-field pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Senha
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
          </button>

          {isLogin && (
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Esqueci minha senha
            </button>
          )}

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
                setSuccess('')
                setFormData({ email: '', password: '', confirmPassword: '' })
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isLogin ? 'Não tem conta? Criar uma' : 'Já tem conta? Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginModal