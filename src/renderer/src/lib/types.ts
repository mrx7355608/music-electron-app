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

export interface ArtistFormData {
  real_name: string
  country_of_origin: string
  label: string
  distributor: string
  social_media_links: {
    instagram?: string
    twitter?: string
    facebook?: string
    youtube?: string
    spotify?: string
  }
  biography: string
}

export interface Artist {
  id: string
  real_name: string
  country_of_origin: string
  label: string
  distributor: string
  social_media_links: {
    instagram?: string
    twitter?: string
    facebook?: string
    youtube?: string
    spotify?: string
  }
  biography: string
  created_at: string
  updated_at: string
  created_by: string
}
