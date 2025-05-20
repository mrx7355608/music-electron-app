import { useSettings } from '../hooks/useSettings'
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Link,
  List,
  Palette,
  Download,
  FileText,
  Table
} from 'lucide-react'
import { useState } from 'react'
import { supabase } from '@renderer/lib/supabase'
import { saveAs } from 'file-saver'
import { unparse } from 'papaparse'
import * as XLSX from 'xlsx'
const Settings = () => {
  const { settings, updateSettings } = useSettings()
  const [isExportingCsv, setIsExportingCsv] = useState(false)
  const [isExportingXlsx, setIsExportingXlsx] = useState(false)

  const handleToggle = (key: keyof typeof settings) => {
    if (key === 'theme') {
      const newTheme = settings.theme === 'dark' ? 'light' : 'dark'
      updateSettings({ theme: newTheme })
    } else {
      updateSettings({ [key]: !settings[key] })
    }
  }

  const exportAsCsv = async () => {
    setIsExportingCsv(true)
    try {
      const { data, error } = await supabase
        .from('releases')
        .select('*, artist_name:artist_id(real_name)')

      if (error) {
        console.error('Error exporting CSV:', error)
        alert('Failed to export CSV. Please try again.')
        return
      }

      // Create and download CSV file
      const flatData = data.map((release) => {
        return {
          id: release.id,
          created_at: release.created_at,
          title: release.title,
          genre: release.genre,
          original_producer: release.original_producer,
          bundle: release.bundle,
          label: release.label,
          status: release.status,
          artist_id: release.artist_id,
          release_year: release.release_year,
          release_month: release.release_month,
          release_date: release.release_date,
          artist_name: release.artist_name.real_name
        }
      })
      const csv = unparse(flatData)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      saveAs(blob, 'releases.csv')
    } catch (error) {
      console.error('CSV Export error:', error)
      alert('Failed to export CSV. Please try again.')
    } finally {
      setIsExportingCsv(false)
    }
  }

  const exportAsXlsx = async () => {
    setIsExportingXlsx(true)
    try {
      const { data, error } = await supabase
        .from('releases')
        .select('*, artist_name:artist_id(real_name)')

      if (error) {
        console.error('Error exporting XLSX:', error)
        alert('Failed to export XLSX. Please try again.')
        return
      }

      // Create an excel sheet
      const flatData = data.map((release) => {
        return {
          id: release.id,
          created_at: release.created_at,
          title: release.title,
          genre: release.genre,
          original_producer: release.original_producer,
          bundle: release.bundle,
          label: release.label,
          status: release.status,
          artist_id: release.artist_id,
          release_year: release.release_year,
          release_month: release.release_month,
          release_date: release.release_date,
          artist_name: release.artist_name.real_name
        }
      })
      const worksheet = XLSX.utils.json_to_sheet(flatData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Releases')
      const xlsxBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      })

      // Download file
      const blob = new Blob([xlsxBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      saveAs(blob, 'releases.xlsx')
    } catch (error) {
      console.error('XLSX Export error:', error)
      alert('Failed to export XLSX. Please try again.')
    } finally {
      setIsExportingXlsx(false)
    }
  }

  return (
    <div className="p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent">
            Settings
          </h1>
        </div>

        <div className="space-y-6">
          {/* Theme Setting */}
          <div className="bg-slate-800/30 rounded-xl border border-purple-500/20 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.theme === 'dark' ? (
                  <Moon className="w-6 h-6 text-purple-400" />
                ) : (
                  <Sun className="w-6 h-6 text-purple-400" />
                )}
                <div>
                  <h3 className="text-lg font-medium text-white">Theme</h3>
                  <p className="text-sm text-purple-200/70">Choose your preferred theme</p>
                </div>
              </div>
              <select
                value={settings.theme}
                onChange={(e) => updateSettings({ theme: e.target.value as 'light' | 'dark' })}
                className="px-4 py-2 rounded-lg bg-slate-800/50 border border-purple-500/20 text-white hover:bg-slate-800/70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="dark" className="bg-slate-800">
                  Dark
                </option>
                <option value="light" className="bg-slate-800">
                  Light
                </option>
              </select>
            </div>
          </div>

          {/* Link Activation Setting */}
          <div className="bg-slate-800/30 rounded-xl border border-purple-500/20 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link className="w-6 h-6 text-purple-400" />
                <div>
                  <h3 className="text-lg font-medium text-white">Link Activation</h3>
                  <p className="text-sm text-purple-200/70">Enable hyperlink activation</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.link_activation_enabled}
                  onChange={() => handleToggle('link_activation_enabled')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>

          {/* Show Uncategorized Songs Setting */}
          <div className="bg-slate-800/30 rounded-xl border border-purple-500/20 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <List className="w-6 h-6 text-purple-400" />
                <div>
                  <h3 className="text-lg font-medium text-white">Show Uncategorized Songs</h3>
                  <p className="text-sm text-purple-200/70">
                    Display songs that are not in any playlist
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.show_uncategorized_songs}
                  onChange={() => handleToggle('show_uncategorized_songs')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>

          {/* Color Code Songs Setting */}
          <div className="bg-slate-800/30 rounded-xl border border-purple-500/20 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Palette className="w-6 h-6 text-purple-400" />
                <div>
                  <h3 className="text-lg font-medium text-white">Color Code Songs</h3>
                  <p className="text-sm text-purple-200/70">
                    Enable color coding for different song types
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.show_color_code_songs}
                  onChange={() => handleToggle('show_color_code_songs')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>

          {/* Export Data Section */}
          <div className="bg-slate-800/30 rounded-xl border border-purple-500/20 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Download className="w-6 h-6 text-purple-400" />
                <div>
                  <h3 className="text-lg font-medium text-white">Export Data</h3>
                  <p className="text-sm text-purple-200/70">
                    Export artists data to CSV or XLSX format
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => exportAsCsv()}
                  disabled={isExportingCsv}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-purple-500/20 text-white hover:cursor-pointer hover:bg-slate-800/70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText className="w-4 h-4" />
                  {isExportingCsv ? (
                    <>
                      <div className="w-4 h-4 border-2 border-purple-200 border-t-transparent rounded-full animate-spin" />
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <span>CSV</span>
                  )}
                </button>
                <button
                  onClick={() => exportAsXlsx()}
                  disabled={isExportingXlsx}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-purple-500/20 text-white hover:cursor-pointer hover:bg-slate-800/70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Table className="w-4 h-4" />
                  {isExportingXlsx ? (
                    <>
                      <div className="w-4 h-4 border-2 border-purple-200 border-t-transparent rounded-full animate-spin" />
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <span>XLSX</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
