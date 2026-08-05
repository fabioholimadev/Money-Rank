import { useEffect, useState } from 'react';
import { fetchPublishedActivityCatalog } from '../services/publishedEditorialService';

export function usePublishedActivityCatalog(activityKey, fallbackPayload) {
  const [payload, setPayload] = useState(fallbackPayload);

  useEffect(() => {
    let active = true;
    fetchPublishedActivityCatalog(activityKey)
      .then((result) => {
        if (
          active &&
          result?.activityKey === activityKey &&
          result?.payload?.id === activityKey
        ) {
          setPayload(result.payload);
        }
      })
      .catch(() => {
        if (active) setPayload(fallbackPayload);
      });
    return () => {
      active = false;
    };
  }, [activityKey, fallbackPayload]);

  return payload;
}
