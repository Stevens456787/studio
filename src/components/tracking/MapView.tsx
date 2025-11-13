'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type maplibregl from 'maplibre-gl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, MapPin, Navigation, TrafficCone } from 'lucide-react';
import type { LiveTechnicianLocation } from '@/lib/tracking';
import { cn } from '@/lib/utils';

const MAP_STYLE_URL = 'https://demotiles.maplibre.org/style.json';
const REFRESH_INTERVAL_MS = 15000;

interface MapViewProps {
  technicianName: string;
  requestId: string;
  initialLocation?: LiveTechnicianLocation | null;
}

type MapLibreModule = typeof import('maplibre-gl');

export default function MapView({ technicianName, requestId, initialLocation }: MapViewProps) {
  const [location, setLocation] = useState<LiveTechnicianLocation | null>(initialLocation ?? null);
  const [isInitializing, setIsInitializing] = useState(!initialLocation);
  const [error, setError] = useState<string | null>(null);
  const [mapModule, setMapModule] = useState<MapLibreModule | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const technicianMarkerRef = useRef<maplibregl.Marker | null>(null);
  const destinationMarkerRef = useRef<maplibregl.Marker | null>(null);
  const hasFitBoundsRef = useRef(false);
  const hasFetchedRef = useRef(Boolean(initialLocation));

  const loadMapLib = useCallback(async () => {
    const module = await import('maplibre-gl');
    setMapModule(module);
  }, []);

  useEffect(() => {
    loadMapLib();
  }, [loadMapLib]);

  const fetchLocation = useCallback(async () => {
    if (!hasFetchedRef.current) {
      setIsInitializing(true);
    }
    try {
      const response = await fetch(`/api/tracking/${encodeURIComponent(requestId)}`, {
        cache: 'no-store',
      });
      if (!response.ok) {
        throw new Error('Failed to load technician location');
      }
      const data = (await response.json()) as LiveTechnicianLocation;
      setLocation(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Unable to refresh live location. We will keep retrying.');
    } finally {
      if (!hasFetchedRef.current) {
        hasFetchedRef.current = true;
        setIsInitializing(false);
      }
    }
  }, [requestId]);

  useEffect(() => {
    fetchLocation();
    const intervalId = window.setInterval(fetchLocation, REFRESH_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [fetchLocation]);

  useEffect(() => {
    if (!mapModule || !mapContainerRef.current || mapRef.current) {
      return;
    }
    const map = new mapModule.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE_URL,
      center: [location?.lng ?? 36.8219, location?.lat ?? -1.2921],
      zoom: 12,
    });
    map.addControl(new mapModule.NavigationControl({ visualizePitch: true }));
    mapRef.current = map;

    return () => {
      technicianMarkerRef.current?.remove();
      destinationMarkerRef.current?.remove();
      mapRef.current?.remove();
      mapRef.current = null;
      technicianMarkerRef.current = null;
      destinationMarkerRef.current = null;
      hasFitBoundsRef.current = false;
    };
  }, [location, mapModule]);

  useEffect(() => {
    if (!mapModule || !mapRef.current || !location) {
      return;
    }

    const map = mapRef.current;
    const { lat, lng, destinationLat, destinationLng, startLat, startLng } = location;
    const technicianCoords: [number, number] = [lng, lat];
    const destinationCoords: [number, number] = [destinationLng, destinationLat];
    const startCoords: [number, number] = [startLng, startLat];
    const routeSourceId = `route-line-${requestId}`;

    if (!map.getSource(routeSourceId)) {
      map.addSource(routeSourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [startCoords, destinationCoords],
          },
          properties: {},
        },
      });
      map.addLayer({
        id: `${routeSourceId}-layer`,
        type: 'line',
        source: routeSourceId,
        paint: {
          'line-color': '#2563eb',
          'line-width': 4,
          'line-dasharray': [1, 1.8],
          'line-opacity': 0.7,
        },
      });
    }

    if (!destinationMarkerRef.current) {
      destinationMarkerRef.current = new mapModule.Marker({ color: '#22c55e' })
        .setLngLat(destinationCoords)
        .setPopup(new mapModule.Popup({ closeButton: false }).setHTML('<strong>Destination</strong>'));
      destinationMarkerRef.current.addTo(map);
    } else {
      destinationMarkerRef.current.setLngLat(destinationCoords);
    }

    if (!technicianMarkerRef.current) {
      technicianMarkerRef.current = new mapModule.Marker({
        color: '#f97316',
        scale: 1.2,
      })
        .setLngLat(technicianCoords)
        .setPopup(
          new mapModule.Popup({ closeButton: false }).setHTML(
            `<strong>${technicianName}</strong><br/>On the way`,
          ),
        );
      technicianMarkerRef.current.addTo(map);
    } else {
      technicianMarkerRef.current.setLngLat(technicianCoords);
    }

    if (!hasFitBoundsRef.current) {
      hasFitBoundsRef.current = true;
      const bounds = new mapModule.LngLatBounds(technicianCoords, technicianCoords);
      bounds.extend(destinationCoords);
      bounds.extend(startCoords);
      map.fitBounds(bounds, { padding: 60, duration: 800 });
    } else {
      map.easeTo({
        center: technicianCoords,
        duration: 800,
        zoom: Math.max(map.getZoom(), 13),
      });
    }
  }, [location, mapModule, requestId, technicianName]);

  const statusCopy = useMemo(() => {
    if (!location) return 'Locating technician...';
    if (location.progress > 0.95) {
      return 'Technician is arriving now.';
    }
    if (location.trafficDelayMinutes > 0) {
      return `Technician en route • traffic +${location.trafficDelayMinutes} min`;
    }
    return 'Technician en route with no reported delays.';
  }, [location]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              Technician Live Location
            </CardTitle>
            <CardDescription>
              Tracking {technicianName} for request <span className="font-medium">{requestId}</span>
            </CardDescription>
          </div>
          <Badge variant="secondary" className="uppercase tracking-wide">
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <div
            ref={mapContainerRef}
            className={cn(
              'h-[340px] w-full rounded-md border border-border bg-muted',
              isInitializing && 'animate-pulse',
            )}
          />
          {isInitializing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-md bg-background/70 backdrop-blur-sm">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Connecting to FieldAssist Live Tracking…</p>
            </div>
          )}
          {location && (
            <div className="absolute left-4 top-4 space-y-2">
              <div className="rounded-lg bg-background/95 px-3 py-2 shadow">
                <p className="text-xs uppercase text-muted-foreground">ETA</p>
                <p className="text-lg font-semibold">{location.etaMinutes} minutes</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Navigation className="h-3.5 w-3.5" />
                  Heading {Math.round(location.headingDegrees)}°
                </p>
              </div>
              <div className="rounded-lg bg-background/95 px-3 py-2 shadow">
                <p className="flex items-center gap-1 text-xs font-medium">
                  <TrafficCone className="h-3.5 w-3.5 text-amber-500" />
                  Traffic
                </p>
                <p className="text-sm text-muted-foreground">
                  {location.trafficDelayMinutes > 0
                    ? `+${location.trafficDelayMinutes} min delay`
                    : 'No current delays'}
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground">{statusCopy}</p>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
