import { useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api.ts";
import type { GetFirmsProducerHandlerApiFirmsProducerGetRequest } from "@salut-mercado/octo-client";

export const useProducers = (
  params: GetFirmsProducerHandlerApiFirmsProducerGetRequest
) => {
  return useQuery({
    queryKey: ["producers", JSON.stringify(params)],
    queryFn: () =>
      api.producers.getFirmsProducerHandlerApiFirmsProducerGet(params),
  });
};
