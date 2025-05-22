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
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="w-8 h-8 text-[#1DB954]" />
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>

        <div className="space-y-6">
          <div className="bg-[#181818] rounded-lg border border-[#282828] p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Palette className="w-6 h-6 text-[#B3B3B3]" />
                  <div>
                    <h3 className="text-lg font-medium text-white">Theme</h3>
                    <p className="text-sm text-[#B3B3B3]">Switch between light and dark mode</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('theme')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#282828] text-[#B3B3B3] hover:text-white hover:bg-[#404040] transition-colors"
                >
                  {settings.theme === 'dark' ? (
                    <>
                      <Moon className="w-4 h-4" />
                      <span>Dark</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-4 h-4" />
                      <span>Light</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#181818] rounded-lg border border-[#282828] p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link className="w-6 h-6 text-[#B3B3B3]" />
                  <div>
                    <h3 className="text-lg font-medium text-white">Hyperlink Activation</h3>
                    <p className="text-sm text-[#B3B3B3]">Enable clicking on social media links</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.link_activation_enabled}
                    onChange={() => handleToggle('link_activation_enabled')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#282828] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1DB954]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Show Uncategorized Songs Setting */}
          <div className="bg-[#181818] rounded-lg border border-[#282828] p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <List className="w-6 h-6 text-[#B3B3B3]" />
                <div>
                  <h3 className="text-lg font-medium text-white">Show Uncategorized Songs</h3>
                  <p className="text-sm text-[#B3B3B3]">
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
                <div className="w-11 h-6 bg-[#282828] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1DB954]"></div>
              </label>
            </div>
          </div>

          {/* Color Code Songs Setting */}
          <div className="bg-[#181818] rounded-lg border border-[#282828] p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Palette className="w-6 h-6 text-[#B3B3B3]" />
                <div>
                  <h3 className="text-lg font-medium text-white">Color Code Songs</h3>
                  <p className="text-sm text-[#B3B3B3]">
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
                <div className="w-11 h-6 bg-[#282828] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1DB954]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
