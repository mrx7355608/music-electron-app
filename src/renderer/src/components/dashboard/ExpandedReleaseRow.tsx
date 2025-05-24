import { Release, Track } from '@renderer/lib/types'
import { useNavigate } from 'react-router-dom'

export default function ExpandedRelease({
  release,
  track
}: {
  release: Release
  track: Partial<Track>
}) {
  const navigate = useNavigate()

  return (
    <tr key={`${release.id}-${track.id}`} className={`bg-zinc-950`}>
      <td className="px-6 py-4 text-sm">
        <button
          onClick={() => navigate(`/artists/${release.artist.id}`)}
          className="hover:cursor-pointer text-white hover:text-[#1DB954] transition-colors"
        >
          {release.artist.real_name}
        </button>
      </td>
      <td className="px-6 py-4 text-sm text-white">{release.label}</td>
      <td className="px-6 py-4 text-sm text-white">{release.distributor}</td>
      <td className="px-6 py-4 text-sm text-white pl-8">{track.title}</td>
      <td className="px-6 py-4 text-sm text-white">
        {new Date(release.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 text-sm text-white">{release.genre}</td>
      <td className="px-6 py-4 text-sm text-white">{release.bundle?.name || '-'}</td>
      <td className="px-6 py-4 text-sm text-white">{release.original_producer}</td>
      <td className="px-6 py-4 text-sm">
        <span className="font-medium text-white">{release.status.toUpperCase()}</span>
      </td>
    </tr>
  )
}
