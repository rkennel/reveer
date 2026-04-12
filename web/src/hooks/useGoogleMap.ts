/**
 * useGoogleMap — initialises a Google Maps SDK instance inside a container ref.
 *
 * Gracefully does nothing when:
 *  - the container ref is not yet attached
 *  - window.google is undefined (no SDK / no API key)
 *
 * When a position is provided the map centres on it and a Marker is placed at
 * that coordinate.
 */

import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import type { GeolocationPosition } from './useGeolocation'

// Minimal type shims for the Google Maps JS SDK to satisfy TypeScript strict
// mode without importing a full @types/google.maps package.
interface GoogleLatLng {
  lat: number
  lng: number
}

interface GoogleMapOptions {
  center: GoogleLatLng
  zoom: number
  disableDefaultUI?: boolean
}

interface GoogleMapInstance {
  setCenter(latLng: GoogleLatLng): void
  setZoom(zoom: number): void
}

interface GoogleMarkerOptions {
  position: GoogleLatLng
  map: GoogleMapInstance
}

interface GoogleMarkerInstance {
  setMap(map: GoogleMapInstance | null): void
}

interface GoogleMapsNamespace {
  Map: new (element: HTMLElement, options: GoogleMapOptions) => GoogleMapInstance
  Marker: new (options: GoogleMarkerOptions) => GoogleMarkerInstance
  LatLng: new (lat: number, lng: number) => GoogleLatLng
}

interface GoogleNamespace {
  maps: GoogleMapsNamespace
}

function getGoogleMaps(): GoogleMapsNamespace | null {
  const g = (window as Record<string, unknown>)['google'] as GoogleNamespace | undefined
  return g?.maps ?? null
}

export interface UseGoogleMapResult {
  mapInstance: GoogleMapInstance | null
}

const DEFAULT_CENTER: GoogleLatLng = { lat: 37.7749, lng: -122.4194 } // SF fallback
const DEFAULT_ZOOM = 15

export function useGoogleMap(
  containerRef: RefObject<HTMLDivElement | null>,
  position: GeolocationPosition | null,
): UseGoogleMapResult {
  const mapInstanceRef = useRef<GoogleMapInstance | null>(null)
  const markerRef = useRef<GoogleMarkerInstance | null>(null)

  useEffect(() => {
    const maps = getGoogleMaps()
    if (!maps || !containerRef.current) return

    const latLng = position ? { lat: position.latitude, lng: position.longitude } : DEFAULT_CENTER

    // Initialise map on first run; capture a typed non-null reference.
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new maps.Map(containerRef.current, {
        center: latLng,
        zoom: DEFAULT_ZOOM,
        disableDefaultUI: true,
      })
    } else {
      // Already initialised — only update centre if the map supports it
      mapInstanceRef.current.setCenter(latLng)
    }

    // Capture map in a block-scoped variable; TypeScript narrows it to
    // non-null here because we just assigned it above (or it was already set).
    const mapInstance = mapInstanceRef.current

    // Place / update the location marker when position is known
    if (position) {
      if (markerRef.current) {
        markerRef.current.setMap(null)
      }
      markerRef.current = new maps.Marker({
        position: latLng,
        map: mapInstance,
      })
    }
  }, [containerRef, position])

  return { mapInstance: mapInstanceRef.current }
}
