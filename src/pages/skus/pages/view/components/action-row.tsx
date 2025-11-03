import type { SKUReturnSchema } from "@salut-mercado/octo-client";
import { IconHistory } from "@tabler/icons-react";
import {
  ArchiveIcon,
  ArrowLeftIcon,
  BarcodeIcon,
  EditIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export const ActionRow = ({ sku }: { sku: SKUReturnSchema }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <Link href="~/skus">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeftIcon className="size-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold mb-1 text-balance">
            {sku.name}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarcodeIcon className="size-3.5" />
              <span className="font-mono">{sku.barcode}</span>
            </div>
            <Badge variant="secondary">ID: {sku.id}</Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ButtonGroup>
          <Button size="sm" asChild>
            <Link href={`~/skus/${sku.id}/edit`}>
              <EditIcon className="size-4 mr-2" />
              {t("common.edit")}
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="More Options"
              >
                <MoreHorizontalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52" align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem disabled>
                  <IconHistory className="size-4" />
                  {t("common.history")}
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" disabled>
                  <ArchiveIcon className="size-4" />
                  {t("common.archive")}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </div>
    </div>
  );
};
