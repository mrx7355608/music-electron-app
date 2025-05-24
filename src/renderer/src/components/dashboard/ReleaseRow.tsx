import { Track } from '@renderer/lib/types'
import { Release } from '@renderer/lib/types'
import { Plus } from 'lucide-react'
import { Minus } from 'lucide-react'
import { useState } from 'react'

import { useNavigate } from 'react-router-dom'
import ExpandedRelease from './ExpandedReleaseRow'

export default function ReleaseRow({
  release,
  tracks
}: {
  release: Release
  tracks: Partial<Track>[]
}) {
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_expandedReleases, setExpandedReleases] = useState<Set<string>>(new Set())
  const hasMultipleTracks = tracks.length > 1

  const toggleRelease = (releaseId: string) => {
    setExpandedReleases((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(releaseId)) {
        newSet.delete(releaseId)
      } else {
        newSet.add(releaseId)
      }
      return newSet
    })
    setIsExpanded(!isExpanded)
  }

  return (
    <>
      <tr key={release.id} className="hover:bg-[#282828] transition-colors">
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
        <td className="px-6 py-4 text-sm text-white">
          <div className="flex items-center gap-2">
            {tracks[0]?.title}
            {hasMultipleTracks && (
              <button
                onClick={() => toggleRelease(release.id)}
                className="text-[#B3B3B3] hover:text-white transition-colors p-1 rounded-full hover:bg-[#282828]"
              >
                {isExpanded ? (
                  <Minus className="w-6 h-6 rounded-full bg-[#2a2a2a] p-1 border border-gray-500" />
                ) : (
                  <Plus className="w-6 h-6 rounded-full bg-[#2a2a2a] p-1 border border-gray-500" />
                )}
              </button>
            )}
          </div>
        </td>
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
      {isExpanded &&
        tracks
          .slice(1)
          .map((track) => (
            <ExpandedRelease key={`${release.id}-${track.id}`} release={release} track={track} />
          ))}
    </>
  )
}
