import {
    Configuration as OctoConfiguration,
    SuppliersDetailsApi,
    SuppliersApi,
    SuppliersGroupsApi,
    SuppliersBankInfoApi,
} from "@salut-mercado/octo-client";

import {
    Configuration as LocalConfiguration,
    FirmsProducerApi,
} from "~/lib/.generated/client";

const apiUrl = import.meta.env.API_URL || "http://localhost:8000";

const octoConfig = new OctoConfiguration({ basePath: apiUrl });
const localConfig = new LocalConfiguration({ basePath: apiUrl });

export const api = {
    suppliers: new SuppliersApi(octoConfig),
    suppliersDetails: new SuppliersDetailsApi(octoConfig),
    suppliersGroups: new SuppliersGroupsApi(octoConfig),
    suppliersBankInfo: new SuppliersBankInfoApi(octoConfig),
    producers: new FirmsProducerApi(localConfig),
};
