import {
  OutflowEnum,
  type AddOutflowSpoiledApiOutflowsSpoiledPostRequest,
  type AddOutflowStoreSalesApiOutflowsStoreSalesPostRequest,
  type AddOutflowTheftApiOutflowsTheftPostRequest,
} from "@salut-mercado/octo-client";
import { useMutation } from "@tanstack/react-query";
import { api } from "~/lib/api";

export const outflows = {
  useCreateSpoiled: () =>
    useMutation({
      mutationKey: ["outflows", "create", "spoiled"],
      mutationFn: (
        outflow: Omit<
          AddOutflowSpoiledApiOutflowsSpoiledPostRequest["spoiledOutflowSchema"],
          "outflow_type"
        >
      ) =>
        api.outflows.addOutflowSpoiledApiOutflowsSpoiledPost({
          spoiledOutflowSchema: {
            ...outflow,
            outflowType: OutflowEnum.spoiled,
          },
        }),
    }),
  useCreateTheft: () =>
    useMutation({
      mutationKey: ["outflows", "create", "theft"],
      mutationFn: (
        outflow: Omit<
          AddOutflowTheftApiOutflowsTheftPostRequest["theftOutflowSchema"],
          "outflow_type"
        >
      ) =>
        api.outflows.addOutflowTheftApiOutflowsTheftPost({
          theftOutflowSchema: {
            ...outflow,
            outflowType: OutflowEnum.theft,
          },
        }),
    }),
  useCreateStoreSale: () =>
    useMutation({
      mutationKey: ["outflows", "create", "storeSale"],
      mutationFn: (
        outflow: Omit<
          AddOutflowStoreSalesApiOutflowsStoreSalesPostRequest["storeSalesOutflowSchema"],
          "outflow_type"
        >
      ) =>
        api.outflows.addOutflowStoreSalesApiOutflowsStoreSalesPost({
          storeSalesOutflowSchema: {
            ...outflow,
            outflowType: OutflowEnum.storesales,
          },
        }),
    }),
};
