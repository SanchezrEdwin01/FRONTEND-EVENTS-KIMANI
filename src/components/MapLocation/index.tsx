import * as React from 'react';
import { useEffect, useState, useCallback, useRef } from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow
} from '@react-google-maps/api';
import { GOOGLE_MAPS_CONFIG } from '../../config/maps';
import './styles.scss';
import Loader from '../Loader';
import { GOOGLE_MAPS_API_KEY } from '@/utils/constants';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface MapLocationProps {
  coordinates?: Coordinates;
  address?: string;
  eventTitle?: string;
  city?: string;
  area?: string;
}

const DEFAULT_COORDINATES = { latitude: 0.0, longitude: -160.0 };
const DEFAULT_ZOOM = 15;
const AREA_ZOOM = 13;
const CITY_ZOOM = 11;
const LOADING_TIMEOUT_MS = 5000;
const LIBRARIES = ['places'];

const containerStyle = {
  width: '100%',
  height: '100%'
};

const loadingContainerStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f0f0f0',
  borderRadius: '8px'
};

const MapLocation: React.FC<MapLocationProps> = ({
  coordinates,
  address,
  eventTitle,
  city,
  area
}) => {
  const [mapCoordinates, setMapCoordinates] = useState<Coordinates>(
    coordinates || DEFAULT_COORDINATES
  );
  const [currentZoom, setCurrentZoom] = useState<number>(DEFAULT_ZOOM);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [showInfoWindow, setShowInfoWindow] = useState<boolean>(true);
  const [formattedAddress, setFormattedAddress] = useState<string>('');
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [locationAccuracy, setLocationAccuracy] = useState<
    'exact' | 'area' | 'city' | 'default'
  >('default');

  const isMounted = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const geocodeCity = useCallback(
    async (cityName: string): Promise<boolean> => {
      if (!cityName || !isMounted.current) return false;

      try {
        const encoded = encodeURIComponent(cityName);
        const geocodeUrl =
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}` +
          `&key=${GOOGLE_MAPS_API_KEY}`;

        const response = await fetch(geocodeUrl);
        const data = await response.json();

        if (
          data.status === 'OK' &&
          data.results &&
          data.results.length > 0 &&
          isMounted.current
        ) {
          const { lat, lng } = data.results[0].geometry.location;
          setMapCoordinates({ latitude: lat, longitude: lng });
          return true;
        }
      } catch (error) {
        console.error('Error geocoding city:', error);
      }
      return false;
    },
    []
  );

  const geocodeAddress = useCallback(
    async (addressToGeocode: string): Promise<boolean> => {
      if (!addressToGeocode || !isMounted.current) return false;

      try {
        const encoded = encodeURIComponent(addressToGeocode);
        const geocodeUrl =
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}` +
          `&key=${GOOGLE_MAPS_API_KEY}`;

        const response = await fetch(geocodeUrl);
        const data = await response.json();

        if (
          data.status === 'OK' &&
          data.results &&
          data.results.length > 0 &&
          isMounted.current
        ) {
          const { lat, lng } = data.results[0].geometry.location;
          setMapCoordinates({ latitude: lat, longitude: lng });

          setFormattedAddress(data.results[0].formatted_address);
          return true;
        } else if (isMounted.current) {
          console.warn('Geocoding failed or returned no results:', data.status);
          setFormattedAddress(addressToGeocode);
        }
      } catch (error) {
        console.error('Error geocoding address:', error);
        if (isMounted.current) {
          setLoadError(
            error instanceof Error
              ? error
              : new Error('Failed to geocode address')
          );
          setFormattedAddress(addressToGeocode);
        }
      }
      return false;
    },
    []
  );

  useEffect(() => {
    isMounted.current = true;

    timeoutRef.current = setTimeout(() => {
      if (isMounted.current && isLoading) {
        console.warn('Map loading timeout - forcing completion');
        setIsLoading(false);
      }
    }, LOADING_TIMEOUT_MS);

    return () => {
      isMounted.current = false;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (window.google && window.google.maps) {
        delete window.google.maps;
      }
    };
  }, [isLoading]);

  useEffect(() => {
    if (!isMounted.current) return;

    setMapLoaded(false);
    setIsLoading(true);
    setLoadError(null);

    const initializeMap = async () => {
      if (coordinates) {
        setMapCoordinates(coordinates);
        setCurrentZoom(DEFAULT_ZOOM);
        setLocationAccuracy('exact');
        setIsLoading(false);
        return;
      }

      if (address) {
        const success = await geocodeAddress(address);
        if (success && isMounted.current) {
          setCurrentZoom(DEFAULT_ZOOM);
          setLocationAccuracy('exact');
          setIsLoading(false);
          return;
        }
      }

      if (area) {
        const success = await geocodeAddress(area);
        if (success && isMounted.current) {
          setCurrentZoom(AREA_ZOOM);
          setLocationAccuracy('area');
          setIsLoading(false);
          return;
        }
      }

      if (city) {
        const success = await geocodeCity(city);
        if (success && isMounted.current) {
          setCurrentZoom(CITY_ZOOM);
          setLocationAccuracy('city');
          setIsLoading(false);
          return;
        }
      }

      if (isMounted.current) {
        setMapCoordinates(DEFAULT_COORDINATES);
        setCurrentZoom(2);
        setLocationAccuracy('default');
        setIsLoading(false);
      }
    };

    initializeMap();
  }, [address, area, city, coordinates, geocodeAddress, geocodeCity]);

  /**
   * Event Handlers
   */
  const handleMapLoad = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setMapLoaded(true);
    setIsLoading(false);
  }, []);

  const handleLoadError = useCallback((error: Error) => {
    console.error('Error loading Google Maps:', error);
    setLoadError(error);
    setIsLoading(false);
  }, []);

  const toggleInfoWindow = useCallback(() => {
    setShowInfoWindow(prev => !prev);
  }, []);

  if (loadError) {
    return (
      <div className="map-container" style={loadingContainerStyle}>
        <div>Failed to load map: {loadError.message}</div>
      </div>
    );
  }

  if (!GOOGLE_MAPS_API_KEY) {
    return null;
  }

  const mapInstanceKey = `map-instance-${address || city || (coordinates ? `${coordinates.latitude}-${coordinates.longitude}` : 'default')}-${Date.now()}`;

  return (
    <div className="map-container">
      {/* Loading state */}
      {isLoading ? (
        <Loader />
      ) : (
        <LoadScript
          googleMapsApiKey={GOOGLE_MAPS_API_KEY}
          onError={handleLoadError}
          key={mapInstanceKey}
          libraries={LIBRARIES as any}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{
              lat: mapCoordinates.latitude,
              lng: mapCoordinates.longitude
            }}
            zoom={currentZoom}
            onLoad={handleMapLoad}
            options={{
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
              zoomControl: true
            }}
          >
            <Marker
              position={{
                lat: mapCoordinates.latitude,
                lng: mapCoordinates.longitude
              }}
              onClick={toggleInfoWindow}
            >
              {showInfoWindow && (
                <InfoWindow
                  position={{
                    lat: mapCoordinates.latitude,
                    lng: mapCoordinates.longitude
                  }}
                  onCloseClick={toggleInfoWindow}
                >
                  <div className="info-window">
                    <h3 className="text-sm font-bold">
                      {eventTitle || 'Event Location'}
                    </h3>
                    <p className="text-xs">
                      {formattedAddress ||
                        address ||
                        area ||
                        city ||
                        'Location'}
                    </p>
                    {locationAccuracy === 'default' ? (
                      <div className="text-xs text-red-600 mt-1">
                        <p>Unable to map the provided location.</p>
                        <p>Please contact support for assistance.</p>
                      </div>
                    ) : (
                      locationAccuracy !== 'exact' && (
                        <div className="text-xs text-amber-600 mt-1">
                          <p>
                            {locationAccuracy === 'area'
                              ? `Unable to find exact address. Showing approximate location for: ${area}`
                              : locationAccuracy === 'city'
                                ? `Unable to find exact address or area. Showing city center of: ${city}`
                                : 'Location approximated.'}
                          </p>
                          <p className="mt-1">Location may not be exact.</p>
                        </div>
                      )
                    )}
                    <p className="text-xs mt-1 text-blue-600">
                      Click marker to toggle info
                    </p>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          </GoogleMap>
        </LoadScript>
      )}
    </div>
  );
};

export default MapLocation;
