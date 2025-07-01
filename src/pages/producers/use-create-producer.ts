
import {api} from "~/lib/api.ts";
import type {CreateFirmProducerHandlerApiFirmsProducerPostRequest} from "@salut-mercado/octo-client";
import {useMutation} from "@tanstack/react-query";


export const useCreateProducer = () => {
    return useMutation({
        mutationFn: (data: CreateFirmProducerHandlerApiFirmsProducerPostRequest) =>
            api.producers.createFirmProducerHandlerApiFirmsProducerPost(data),
    });
};