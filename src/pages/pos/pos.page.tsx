import { DashboardPage } from "~/components/dashboard-page";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const PosPage = () => {
  return (
    <DashboardPage>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Temporarily Disabled
          </CardTitle>
          <CardDescription>
            This feature is currently under maintenance and will be available
            soon.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            Please check back later for updates.
          </p>
        </CardContent>
      </Card>
    </DashboardPage>
  );
};

export default PosPage;
