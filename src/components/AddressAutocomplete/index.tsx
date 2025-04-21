import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo
} from 'react';
import styles from './styles.module.css';
import { GOOGLE_MAPS_API_KEY } from '../../utils/constants';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  onAreaChange: (area: string) => void;
  onCityChange: (city: string) => void;
  onCountryChange: (country: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  onAreaChange,
  onCityChange,
  onCountryChange,
  placeholder = 'Enter address',
  className = '',
  error
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [autocompleteElement, setAutocompleteElement] = useState<any>(null);
  const scriptLoadedRef = useRef(false);

  const loadGoogleMapsAPI = useCallback(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      setIsLoaded(true);
      return;
    }

    if (scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);
  }, []);

  const extractAddressComponents = useCallback((place: any) => {
    if (!place.address_components) return null;

    let streetNumber = '';
    let route = '';
    let area = '';
    let city = '';
    let country = '';

    for (const component of place.address_components) {
      const types = component.types;

      if (types.includes('street_number')) {
        streetNumber = component.long_name;
      } else if (types.includes('route')) {
        route = component.long_name;
      } else if (
        types.includes('sublocality_level_1') ||
        types.includes('neighborhood') ||
        types.includes('sublocality') ||
        types.includes('administrative_area_level_3')
      ) {
        area = component.long_name;
      } else if (types.includes('locality')) {
        city = component.long_name;
      } else if (types.includes('country')) {
        country = component.long_name;
      }
    }

    if (!area && place.formatted_address) {
      const addressParts = place.formatted_address.split(',');
      if (addressParts.length >= 2) {
        area = addressParts[1].trim();
      }
    }

    const formattedAddress =
      place.formatted_address || `${streetNumber} ${route}`.trim();

    return {
      formattedAddress,
      streetNumber,
      route,
      area,
      city,
      country
    };
  }, []);

  const handlePlaceChanged = useCallback(
    (place: any) => {
      const components = extractAddressComponents(place);
      if (!components) return;

      const { formattedAddress, area, city, country } = components;

      onChange(formattedAddress);
      if (area) onAreaChange(area);
      if (city) onCityChange(city);
      if (country) onCountryChange(country);
    },
    [
      onChange,
      onAreaChange,
      onCityChange,
      onCountryChange,
      extractAddressComponents
    ]
  );

  const autocompleteOptions = useMemo(
    () => ({
      componentRestrictions: { country: [] },
      fields: ['address_components', 'formatted_address']
    }),
    []
  );

  useEffect(() => {
    loadGoogleMapsAPI();
  }, [loadGoogleMapsAPI]);

  useEffect(() => {
    if (!isLoaded || !containerRef.current || !inputRef.current) return;

    try {
      const autocomplete =
        new window.google.maps.places.PlaceAutocompleteElement({
          input: inputRef.current,
          ...autocompleteOptions
        });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        handlePlaceChanged(place);
      });

      setAutocompleteElement(autocomplete);
    } catch (error) {
      if (window?.google?.maps?.places) {
        const fallbackAutocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          autocompleteOptions
        );

        fallbackAutocomplete.addListener('place_changed', () => {
          const place = fallbackAutocomplete.getPlace();
          handlePlaceChanged(place);
        });

        setAutocompleteElement(fallbackAutocomplete);
      }
    }

    return () => {
      if (autocompleteElement) {
        window.google.maps.event.clearInstanceListeners(autocompleteElement);
      }
    };
  }, [isLoaded, autocompleteOptions, handlePlaceChanged]);

  return (
    <div
      className={`${styles.addressAutocompleteContainer} ${className}`}
      ref={containerRef}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.addressInput}
      />
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default React.memo(AddressAutocomplete);
