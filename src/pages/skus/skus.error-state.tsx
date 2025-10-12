import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

export const SkusErrorState = ({ message }: { message: string }) => {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>Unable to load SKUs.</AlertTitle>
      <AlertDescription>
        <p>{message}</p>
      </AlertDescription>
    </Alert>
  );
};


