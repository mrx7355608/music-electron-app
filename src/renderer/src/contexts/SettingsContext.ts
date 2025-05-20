import { createContext } from 'react'
import { Settings } from '../lib/types'

export interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
}

export const defaultSettings: Settings = {
  theme: 'dark',
  link_activation_enabled: false,
  show_uncategorized_songs: true,
  show_color_code_songs: false
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined)
