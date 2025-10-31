import type {
  AddOutflowSpoiledApiOutflowsSpoiledPostRequest,
  AddOutflowStoreSalesApiOutflowsStoreSalesPostRequest,
  AddOutflowTheftApiOutflowsTheftPostRequest,
} from "@salut-mercado/octo-client";
import { useMutation } from "@tanstack/react-query";
import { api } from "~/lib/api";

export const outflows = {
  useCreateSpoiled: () =>
    useMutation({
      mutationKey: ["outflows", "create", "spoiled"],
      mutationFn: (outflow: AddOutflowSpoiledApiOutflowsSpoiledPostRequest) =>
        api.outflows.addOutflowSpoiledApiOutflowsSpoiledPost(outflow),
    }),
  useCreateTheft: () =>
    useMutation({
      mutationKey: ["outflows", "create", "theft"],
      mutationFn: (outflow: AddOutflowTheftApiOutflowsTheftPostRequest) =>
        api.outflows.addOutflowTheftApiOutflowsTheftPost(outflow),
    }),
  useCreateStoreSale: () =>
    useMutation({
      mutationKey: ["outflows", "create", "storeSale"],
      mutationFn: (
        outflow: AddOutflowStoreSalesApiOutflowsStoreSalesPostRequest
      ) => api.outflows.addOutflowStoreSalesApiOutflowsStoreSalesPost(outflow),
    }),
};
