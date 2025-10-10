import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "~/lib/api.ts";
import type { UpdateFirmProducerHandlerApiFirmsProducerIdPutRequest } from "@salut-mercado/octo-client";

export const useUpdateProducer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateFirmProducerHandlerApiFirmsProducerIdPutRequest) =>
      api.producers.updateFirmProducerHandlerApiFirmsProducerIdPut(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["producers"] });
    },
  });
};
