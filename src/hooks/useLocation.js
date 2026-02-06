import { useEffect, useState } from "react";

const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [canFetch, setCanFetch] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude, //
          lng: pos.coords.longitude, //
        });
        setCanFetch(true);
      },
      (err) => {
        setError(err);
        setCanFetch(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }, []);

  return { location, error, canFetch };
};

export default useLocation;
