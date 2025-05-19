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

export interface Release {
  id: string
  artist_name: string
  label: string
  distributor: string
  title: string
  created_at: string
  genre: string
  bundle: string | null
  original_producer: string
  status: 'online' | 'planned'
}
