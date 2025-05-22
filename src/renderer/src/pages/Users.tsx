import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { DbUser } from '../lib/types'
import { Loader2, Plus, X } from 'lucide-react'

const Users: React.FC = () => {
  const [users, setUsers] = useState<DbUser[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAdding(true)
    setError(null)

    try {
      // First get old session
      const { data: session } = await supabase.auth.getSession()

      // Then create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      })
      if (authError) throw authError

      // Set old sessions back
      await supabase.auth.setSession(session.session!)

      // Then create the user profile
      const { error: profileError } = await supabase.from('users_profile').insert({
        id: authData.user?.id,
        name: formData.name,
        email: formData.email
      })

      if (profileError) throw profileError

      // Reset form and refresh users list
      setFormData({ name: '', email: '', password: '' })
      setShowAddModal(false)
      await fetchUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add user')
    } finally {
      setIsAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('users_profile').delete().eq('id', id)
      if (error) throw error
      await fetchUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg bg-[#1DB954] text-white hover:bg-[#1ed760] transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add User
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
            {error}
          </div>
        )}

        <div className="bg-[#181818] rounded-lg border border-[#282828] overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="flex justify-center items-center gap-2 text-[#B3B3B3]">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading users...</span>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-[#B3B3B3]">No users found</div>
          ) : (
            <div className="divide-y divide-[#282828]">
              {users.map((user) => (
                <div key={user.id} className="p-4 hover:bg-[#282828] transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-white">{user.name}</h3>
                      <p className="text-sm text-[#B3B3B3]">{user.email}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-[#181818] rounded-lg border border-[#282828] w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">Add New User</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-[#B3B3B3] hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#B3B3B3] mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
                      placeholder="Enter name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#B3B3B3] mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
                      placeholder="Enter email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#B3B3B3] mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="w-full px-4 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
                      placeholder="Enter password"
                    />
                  </div>

                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      disabled={isAdding}
                      className="px-4 py-2 rounded-lg bg-[#282828] text-[#B3B3B3] hover:text-white hover:bg-[#404040] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isAdding}
                      className="px-4 py-2 rounded-lg bg-[#1DB954] text-white hover:bg-[#1ed760] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isAdding ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Adding...</span>
                        </>
                      ) : (
                        <span>Add User</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Users
