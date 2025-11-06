import type {
  FirmsProducerApiGetFirmsProducerHandlerApiFirmsProducerGetRequest,
  FirmsProducerApiGetFirmProducerHandlerApiFirmsProducerIdGetRequest,
  FirmsProducerApiCreateFirmProducerHandlerApiFirmsProducerPostRequest,
  FirmsProducerApiUpdateFirmProducerHandlerApiFirmsProducerIdPutRequest,
} from "@salut-mercado/octo-client";
import { skipToken, useMutation, useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api";

export const producers = {
  // Queries
  useGetAll: (
    args:
      | FirmsProducerApiGetFirmsProducerHandlerApiFirmsProducerGetRequest
      | typeof skipToken
  ) =>
    useQuery({
      queryKey: ["producers", "getAll", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () => api.producers.getFirmsProducerHandlerApiFirmsProducerGet(args).then((res) => res.data)
          : skipToken,
    }),
  useGetById: (
    args:
      | FirmsProducerApiGetFirmProducerHandlerApiFirmsProducerIdGetRequest
      | typeof skipToken
  ) =>
    useQuery({
      queryKey: ["producers", "getById", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () =>
              api.producers.getFirmProducerHandlerApiFirmsProducerIdGet(args).then((res) => res.data)
          : skipToken,
    }),

  // Mutations
  useCreate: () =>
    useMutation({
      mutationKey: ["producers", "create"],
      mutationFn: (
        args: FirmsProducerApiCreateFirmProducerHandlerApiFirmsProducerPostRequest
      ) => api.producers.createFirmProducerHandlerApiFirmsProducerPost(args),
    }),
  useUpdate: () =>
    useMutation({
      mutationKey: ["producers", "update"],
      mutationFn: (
        args: FirmsProducerApiUpdateFirmProducerHandlerApiFirmsProducerIdPutRequest
      ) => api.producers.updateFirmProducerHandlerApiFirmsProducerIdPut(args),
    }),
};
