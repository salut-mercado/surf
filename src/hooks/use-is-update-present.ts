import { useRegisterSW } from "virtual:pwa-register/react";
import { useEffect, useState } from "react";

export const useIsUpdatePresent = () => {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) setRegistration(r);
    },
  });

  useEffect(() => {
    if (!registration) return;
    const interval = setInterval(
      () => {
        registration.update();
      },
      60 * 60 * 1000
    );
    return () => clearInterval(interval);
  }, [registration]);

  return { hasUpdate: needRefresh, update: () => updateServiceWorker(true) };
};
