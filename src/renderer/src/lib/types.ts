export interface DbUser {
  id: string
  created_at: string
  name: string
  email: string
  role: 'viewer' | 'editor'
}
