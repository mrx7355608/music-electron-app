export interface DbUser {
  id: string
  created_at: string
  name: string
  email: string
  role: 'viewer' | 'editor'
}

export interface ReleaseFormData {
  artist_id: string
  label: string
  distributor: string
  title: string
  genre: string
  original_producer: string
  status: 'online' | 'planned'
  created_at: string
}

export interface Release {
  id: string
  artist_id: string
  label: string
  distributor: string
  title: string
  genre: string
  bundle_id: string | null
  bundle?: { name: string }
  original_producer: string
  status: 'online' | 'planned'
  created_at: string
  artist: {
    id: string
    real_name: string
  }
  release_date: string
  release_month: string
  release_year: string
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
  created_by: string
}

export interface Settings {
  theme: 'light' | 'dark'
  link_activation_enabled: boolean
  show_uncategorized_songs: boolean
  show_color_code_songs: boolean
}

export interface Bundle {
  id: string
  name: string
  total_releases: number
}
