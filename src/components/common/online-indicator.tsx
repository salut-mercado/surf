import { useIsOnline } from "~/hooks/use-is-online";
import { Badge } from "~/components/ui/badge";
import { CircleCheck, CircleX } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const OnlineIndicator = ({
  ...props
}: React.ComponentProps<typeof Badge>) => {
  const isOnline = useIsOnline();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant={isOnline ? "outline" : "destructive"} {...props}>
          {isOnline ? (
            <CircleCheck className="size-4" />
          ) : (
            <CircleX className="size-4" />
          )}
        </Badge>
      </TooltipTrigger>
      <TooltipContent variant={isOnline ? "ghost" : "destructive"}>
        {isOnline ? "Online" : "Offline"}
      </TooltipContent>
    </Tooltip>
  );
};
