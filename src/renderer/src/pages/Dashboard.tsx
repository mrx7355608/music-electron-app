import React from 'react'
import { Users, Music, PlayCircle, Clock, BarChart2 } from 'lucide-react'

const StatCard = ({
  icon: Icon,
  label,
  value,
  trend
}: {
  icon: React.ElementType
  label: string
  value: string
  trend: string
}) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="text-2xl font-semibold text-slate-900">{value}</p>
        </div>
      </div>
      <div className="text-sm font-medium text-green-600">{trend}</div>
    </div>
  </div>
)

const Chart = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-slate-900">Listening Activity</h3>
      <select className="text-sm border rounded-lg px-3 py-2">
        <option>Last 7 days</option>
        <option>Last 30 days</option>
        <option>Last 90 days</option>
      </select>
    </div>
    <div className="h-64 flex items-center justify-center border-t">
      <BarChart2 className="w-12 h-12 text-slate-300" />
    </div>
  </div>
)

const TopItems = ({
  title,
  items
}: {
  title: string
  items: { name: string; value: string }[]
}) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
    <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-medium text-slate-600">
              {i + 1}
            </div>
            <span className="font-medium text-slate-900">{item.name}</span>
          </div>
          <span className="text-sm text-slate-600">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
)

const Dashboard: React.FC = () => {
  const stats = [
    { icon: Users, label: 'Total Users', value: '1,234', trend: '+12.5%' },
    { icon: Music, label: 'Total Artists', value: '567', trend: '+8.2%' },
    { icon: PlayCircle, label: 'Total Plays', value: '89.3k', trend: '+23.1%' },
    { icon: Clock, label: 'Avg. Session', value: '24m', trend: '+5.4%' }
  ]

  const topArtists = [
    { name: 'The Weekend', value: '2.3M plays' },
    { name: 'Drake', value: '1.8M plays' },
    { name: 'Taylor Swift', value: '1.5M plays' },
    { name: 'Ed Sheeran', value: '1.2M plays' }
  ]

  const topPlaylists = [
    { name: 'Workout Mix', value: '45k followers' },
    { name: 'Chill Vibes', value: '32k followers' },
    { name: 'Party Hits', value: '28k followers' },
    { name: 'Focus Flow', value: '25k followers' }
  ]

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
            <p className="text-slate-600">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-white rounded-lg border shadow-sm hover:bg-slate-50">
              Download Report
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700">
              View Analytics
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Chart />
          <div className="grid grid-cols-1 gap-6">
            <TopItems title="Top Artists" items={topArtists} />
            <TopItems title="Top Playlists" items={topPlaylists} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
