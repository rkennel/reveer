/**
 * HomeScreen — Story 001: Map and Geolocation
 *
 * Renders:
 * - A full-screen Google Maps container covering the entire viewport
 * - A floating "Where to?" search bar at the top
 * - A settings gear icon button in the top-right corner
 * - A current-location indicator overlaid on the map once geolocation is acquired
 *
 * Google Maps is initialised via the JavaScript SDK (window.google.maps).
 * If the SDK is absent (e.g. no API key, test environment) the map container
 * renders in a placeholder / loading state without throwing.
 */

import { useRef, useState } from 'react'
import { useGeolocation } from './hooks/useGeolocation'
import { useGoogleMap } from './hooks/useGoogleMap'

export default function HomeScreen() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [searchValue, setSearchValue] = useState('')

  const { position } = useGeolocation()
  useGoogleMap(mapRef, position)

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Map container — full viewport */}
      <div
        ref={mapRef}
        role="application"
        aria-label="Map"
        data-testid="map"
        style={{ position: 'absolute', inset: 0 }}
      >
        {/* Current location indicator — visible once position is known */}
        {position && (
          <div
            data-testid="current-location-indicator"
            title="Current location"
            aria-label="Current location"
            style={{
              position: 'absolute',
              bottom: '50%',
              left: '50%',
              transform: 'translate(-50%, 50%)',
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: '#1a73e8',
              border: '3px solid white',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* Floating overlay — search bar + settings button */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: 16,
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {/* Search bar */}
        <label htmlFor="search-where-to" style={{ display: 'none' }}>
          Where to?
        </label>
        <input
          id="search-where-to"
          role="searchbox"
          aria-label="Where to?"
          type="search"
          placeholder="Where to?"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value)
          }}
          style={{
            flex: 1,
            height: 48,
            borderRadius: 12,
            border: '1px solid #ddd',
            padding: '0 16px',
            fontSize: 16,
            background: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            outline: 'none',
          }}
        />

        {/* Settings button */}
        <button
          type="button"
          aria-label="Settings"
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            border: '1px solid #ddd',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            flexShrink: 0,
          }}
        >
          {/* Gear icon (SVG) */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#555"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
