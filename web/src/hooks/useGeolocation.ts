/**
 * useGeolocation — requests the browser's current position once on mount.
 *
 * Returns the acquired position (or null until resolved / on error).
 * Errors are swallowed here; story 013 handles the "permission denied" UX.
 */

import { useEffect, useState } from 'react'

export interface GeolocationPosition {
  latitude: number
  longitude: number
}

export interface UseGeolocationResult {
  position: GeolocationPosition | null
  error: GeolocationPositionError | null
}

export function useGeolocation(): UseGeolocationResult {
  const [position, setPosition] = useState<GeolocationPosition | null>(null)
  const [error, setError] = useState<GeolocationPositionError | null>(null)

  useEffect(() => {
    // navigator.geolocation can be undefined in non-browser environments (e.g.
    // jsdom with the property removed). Cast via unknown to satisfy strict TS
    // while still guarding at runtime.
    if (!(navigator.geolocation as unknown)) return

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
      },
      (err) => {
        setError(err)
      },
    )
  }, [])

  return { position, error }
}
