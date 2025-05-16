import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { DbUser } from '../lib/types'

const Users: React.FC = () => {
  const [users, setUsers] = useState<DbUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'viewer' as const
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('users_profile')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setError(null)

    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password
      })

      if (authError) throw authError

      // Then create the user profile
      const { error: profileError } = await supabase.from('users_profile').insert([
        {
          id: authData.user?.id,
          name: formData.name,
          email: formData.email,
          role: formData.role
        }
      ])

      if (profileError) throw profileError

      // Reset form and refresh users list
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'viewer' as const
      })
      fetchUsers()
    } catch (err) {
      console.log(err)
      setError(err instanceof Error ? err.message : 'Failed to create user')
    }
  }

  const handleDelete = async (userId: string): Promise<void> => {
    try {
      const { error } = await supabase.from('users').delete().eq('id', userId)

      if (error) throw error
      fetchUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Users</h1>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Add New User</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add User'}
            </button>
          </form>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Existing Users</h2>
          <div className="space-y-4">
            {loading ? (
              <p>Loading users...</p>
            ) : users.length === 0 ? (
              <p className="text-gray-500">No users found</p>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{user.role}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Users
