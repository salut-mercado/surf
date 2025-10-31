import { useEffect } from "react";
import { useLocation } from "wouter";

declare global {
  interface Window {
    navigate?: (path: string) => void;
  }
}

export const useInjectNavigate = () => {
  const [, setLocation] = useLocation();
  useEffect(() => {
    window.navigate = setLocation;
    return () => {
      window.navigate = undefined;
    };
  }, [setLocation]);
  return null;
};
