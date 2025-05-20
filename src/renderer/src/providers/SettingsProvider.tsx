import React, { useState, ReactNode, useEffect } from 'react'
import { SettingsContext, defaultSettings } from '../contexts/SettingsContext'
import { Settings } from '../lib/types'
import { supabase } from '../lib/supabase'

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true)
      const { data, error } = await supabase.from('settings').select('*').single()

      if (error) {
        console.error('Error fetching settings:', error)
        setIsLoading(false)
        return
      }

      if (data) {
        console.log('Settings fetched:', data)
        setSettings(data as Settings)
      }
      setIsLoading(false)
    }

    fetchSettings()
  }, [])

  const updateSettings = async (newSettings: Partial<Settings>) => {
    const oldSettings = settings
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)

    const { error } = await supabase.from('settings').upsert({ id: 1, ...updatedSettings })

    if (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings. Please try again.')
      setSettings(oldSettings)
      return
    }

    console.log('Settings updated:', updatedSettings)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}
