import { CornerDownLeftIcon, DeleteIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "~/components/ui/button";

interface NumpadProps {
  onNumberClick?: (num: string) => void;
  onBackspace?: () => void;
  onEnter?: () => void;
}

const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
export function Numpad({
  onNumberClick,
  onBackspace,
  onEnter,
  className,
}: NumpadProps & ComponentProps<"div">) {
  return (
    <div className={className}>
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {/* Numbers 1-9 */}
        {numbers.slice(0, 9).map((num) => (
          <Button
            key={num}
            variant="outline"
            size="lg"
            className="h-16 text-xl font-semibold bg-transparent"
            onClick={() => onNumberClick?.(num)}
          >
            {num}
          </Button>
        ))}

        {/* Bottom row: Backspace, 0, Enter */}
        <Button
          variant="outline"
          size="lg"
          className="h-16 bg-transparent"
          onClick={onBackspace}
          aria-label="Backspace"
        >
          <DeleteIcon className="size-4" />
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="h-16 text-xl font-semibold bg-transparent"
          onClick={() => onNumberClick?.("0")}
        >
          0
        </Button>

        <Button
          variant="default"
          size="lg"
          className="h-16"
          onClick={onEnter}
          aria-label="Enter"
        >
          <CornerDownLeftIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
