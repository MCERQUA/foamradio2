import type { MetadataRoute } from "next"
import { songsData } from "@/lib/songs-data"

export const dynamic = "force-static"

const SITE = "https://sprayfoamradio.com"

// Song pages come from songsData, the same array /song/[id]'s
// generateStaticParams uses, so a song is listed if and only if it is built.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1.0 },
    ...songsData.map((song) => ({
      url: `${SITE}/song/${song.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]
}
