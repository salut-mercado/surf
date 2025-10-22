import { useLocation, useSearchParams } from "wouter";
import { Button } from "~/components/ui/button";
import { useGlobalStore } from "~/store/global.store";

export function ViewModeToggle(
  props: Omit<React.ComponentProps<typeof Button>, "onClick">
) {
  const viewMode = useGlobalStore((s) => s.viewMode);
  const setViewMode = useGlobalStore((s) => s.setViewMode);

  const [location, navigate] = useLocation();
  const [params] = useSearchParams();
  return (
    <Button
      variant="outline"
      onClick={() => {
        const newViewMode = viewMode === "pos" ? "manager" : "pos";
        setViewMode(newViewMode);
        if (newViewMode === "pos") {
          navigate(`~/?prev=${location}`);
        } else {
          const prevParam = params.get("prev");
          if (prevParam) {
            navigate(`~${prevParam}`);
          } else {
            navigate(`~/`);
          }
        }
      }}
      {...props}
    >
      <span className="sr-only">Toggle view mode</span>
      <span>Switch to {viewMode === "pos" ? "Manager" : "POS"}</span>
    </Button>
  );
}
