import { IconSpeakerphone } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { APP_VERSION, FEEDBACK_URL_BASE } from "~/consts";
import { api } from "~/hooks/api";
import { cn } from "~/lib/utils";
import { useTenantStore } from "~/store/tenant.store";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const FeedbackButton = ({
  variant = "outline",
  size = "default",
  className,
  ...props
}: React.ComponentProps<typeof Button>) => {
  const { t } = useTranslation();
  const userInfo = api.auth.useMe();
  const selectedTenantId = useTenantStore((s) => s.tenantId);

  const feedbackData = {
    user: userInfo.data?.user?.id,
    tenant: selectedTenantId,
    appVersion: APP_VERSION,
    os: navigator.userAgent,
  };

  const message = `\`\`\`${JSON.stringify(feedbackData, null, 2)}\`\`\`\n${t("common.feedback.message")}:\n`;

  const feedbackUrl = `${FEEDBACK_URL_BASE}${encodeURIComponent(message)}`;

  return (
    <Tooltip open={size?.startsWith("icon") ? undefined : false}>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size={size}
          {...props}
          className={cn("text-muted-foreground", className)}
          asChild
        >
          <a href={feedbackUrl} target="_blank" rel="noopener noreferrer">
            <IconSpeakerphone className="size-4" />
            {size?.startsWith("icon") ? null : t("common.feedback.title")}
          </a>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{t("common.feedback.title")}</TooltipContent>
    </Tooltip>
  );
};
