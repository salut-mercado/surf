import type {
  CreateFirmProducerHandlerApiFirmsProducerPostRequest,
  GetFirmProducerHandlerApiFirmsProducerIdGetRequest,
  GetFirmsProducerHandlerApiFirmsProducerGetRequest,
  UpdateFirmProducerHandlerApiFirmsProducerIdPutRequest,
} from "@salut-mercado/octo-client";
import { skipToken, useMutation, useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api";

export const producers = {
  // Queries
  useGetAll: (
    args: GetFirmsProducerHandlerApiFirmsProducerGetRequest | typeof skipToken
  ) =>
    useQuery({
      queryKey: ["producers", "getAll", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () => api.producers.getFirmsProducerHandlerApiFirmsProducerGet(args)
          : skipToken,
    }),
  useGetById: (
    args: GetFirmProducerHandlerApiFirmsProducerIdGetRequest | typeof skipToken
  ) =>
    useQuery({
      queryKey: ["producers", "getById", JSON.stringify(args)],
      queryFn:
        args !== skipToken
          ? () =>
              api.producers.getFirmProducerHandlerApiFirmsProducerIdGet(args)
          : skipToken,
    }),

  // Mutations
  useCreate: () =>
    useMutation({
      mutationKey: ["producers", "create"],
      mutationFn: (
        args: CreateFirmProducerHandlerApiFirmsProducerPostRequest
      ) => api.producers.createFirmProducerHandlerApiFirmsProducerPost(args),
    }),
  useUpdate: () =>
    useMutation({
      mutationKey: ["producers", "update"],
      mutationFn: (
        args: UpdateFirmProducerHandlerApiFirmsProducerIdPutRequest
      ) => api.producers.updateFirmProducerHandlerApiFirmsProducerIdPut(args),
    }),
};
