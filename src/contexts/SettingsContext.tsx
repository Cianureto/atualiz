import React, { createContext, useContext, useState, useEffect } from 'react'
import { SettingsState, Neighborhood } from '../types'

const SettingsContext = createContext<SettingsState | undefined>(undefined)

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

// Mock neighborhoods data
const mockNeighborhoods: Neighborhood[] = [
  { id: '1', name: 'Centro', delivery_fee: 5.00, active: true },
  { id: '2', name: 'Zona Norte', delivery_fee: 8.00, active: true },
  { id: '3', name: 'Zona Sul', delivery_fee: 10.00, active: true },
  { id: '4', name: 'Zona Leste', delivery_fee: 7.50, active: true },
  { id: '5', name: 'Zona Oeste', delivery_fee: 9.00, active: true },
]

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([])
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(() => {
    const saved = localStorage.getItem('selectedNeighborhood')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(false)

  const deliveryFee = selectedNeighborhood?.delivery_fee || 0

  useEffect(() => {
    if (selectedNeighborhood) {
      localStorage.setItem('selectedNeighborhood', JSON.stringify(selectedNeighborhood))
    }
  }, [selectedNeighborhood])

  const fetchNeighborhoods = async () => {
    setLoading(true)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      setNeighborhoods(mockNeighborhoods)
    } catch (error) {
      console.error('Error fetching neighborhoods:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectNeighborhood = (neighborhood: Neighborhood) => {
    setSelectedNeighborhood(neighborhood)
  }

  useEffect(() => {
    fetchNeighborhoods()
  }, [])

  const value: SettingsState = {
    neighborhoods,
    selectedNeighborhood,
    deliveryFee,
    loading,
    fetchNeighborhoods,
    selectNeighborhood,
  }

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}