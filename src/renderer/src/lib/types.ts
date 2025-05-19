export interface DbUser {
  id: string
  created_at: string
  name: string
  email: string
  role: 'viewer' | 'editor'
}

export interface ReleaseFormData {
  artist_name: string
  label: string
  distributor: string
  title: string
  genre: string
  bundle: string
  original_producer: string
  status: 'online' | 'planned'
  created_at: string
}
