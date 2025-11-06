import {
  OutflowEnum,
  type OutflowsApiAddOutflowSpoiledApiOutflowsSpoiledPostRequest,
  type OutflowsApiAddOutflowTheftApiOutflowsTheftPostRequest,
  type OutflowsApiAddOutflowStoreSalesApiOutflowsStoreSalesPostRequest,
} from "@salut-mercado/octo-client";
import { useMutation } from "@tanstack/react-query";
import { api } from "~/lib/api";

export const outflows = {
  useCreateSpoiled: () =>
    useMutation({
      mutationKey: ["outflows", "create", "spoiled"],
      mutationFn: (
        outflow: Omit<
          OutflowsApiAddOutflowSpoiledApiOutflowsSpoiledPostRequest["spoiledOutflowSchema"],
          "outflow_type"
        >
      ) =>
        api.outflows.addOutflowSpoiledApiOutflowsSpoiledPost({
          spoiledOutflowSchema: {
            ...outflow,
            outflow_type: OutflowEnum.spoiled,
          },
        }),
    }),
  useCreateTheft: () =>
    useMutation({
      mutationKey: ["outflows", "create", "theft"],
      mutationFn: (
        outflow: Omit<
          OutflowsApiAddOutflowTheftApiOutflowsTheftPostRequest["theftOutflowSchema"],
          "outflow_type"
        >
      ) =>
        api.outflows.addOutflowTheftApiOutflowsTheftPost({
          theftOutflowSchema: {
            ...outflow,
            outflow_type: OutflowEnum.theft,
          },
        }),
    }),
  useCreateStoreSale: () =>
    useMutation({
      mutationKey: ["outflows", "create", "storeSale"],
      mutationFn: (
        outflow: Omit<
          OutflowsApiAddOutflowStoreSalesApiOutflowsStoreSalesPostRequest["storeSalesOutflowSchema"],
          "outflow_type"
        >
      ) =>
        api.outflows.addOutflowStoreSalesApiOutflowsStoreSalesPost({
          storeSalesOutflowSchema: {
            ...outflow,
            outflow_type: OutflowEnum.storesales,
          },
        }),
    }),
};
