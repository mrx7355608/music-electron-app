import { useSettings } from '../hooks/useSettings'
import { Settings as SettingsIcon, Moon, Sun, Link, List, Palette } from 'lucide-react'

const Settings = () => {
  const { settings, updateSettings } = useSettings()

  const handleToggle = (key: keyof typeof settings) => {
    if (key === 'theme') {
      const newTheme = settings.theme === 'dark' ? 'light' : 'dark'
      updateSettings({ theme: newTheme })
    } else {
      updateSettings({ [key]: !settings[key] })
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
        </div>
      </div>
    </div>
  )
}

export default Settings
