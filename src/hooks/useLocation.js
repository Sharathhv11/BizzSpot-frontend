import { useEffect, useState } from "react";

const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.error(err);
        setError(err.message);
      },
      {
        enableHighAccuracy: true, 
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }, []);

  return { location, error };
};

export default useLocation;
