import { Button } from "~/components/ui/button";
import { useGlobalStore } from "~/store/global.store";

export function ViewModeToggle(
  props: Omit<React.ComponentProps<typeof Button>, "onClick">
) {
  const viewMode = useGlobalStore((s) => s.viewMode);
  const setViewMode = useGlobalStore((s) => s.setViewMode);

  return (
    <Button
      variant="outline"
      onClick={() => setViewMode(viewMode === "pos" ? "manager" : "pos")}
      {...props}
    >
      <span className="sr-only">Toggle view mode</span>
      <span>Switch to {viewMode === "pos" ? "Manager" : "POS"}</span>
    </Button>
  );
}
