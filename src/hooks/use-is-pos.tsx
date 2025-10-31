import { useLocation } from "wouter";

export const useIsPos = (): [true, string] | [false, undefined] => {
  const [location] = useLocation();
  const isPos = location.endsWith("/pos");
  const storeId = location.split("/").at(-2);
  return [isPos, storeId] as [true, string] | [false, undefined];
};
