import {
    Configuration,
    SuppliersDetailsApi,
    SuppliersApi,
    SuppliersGroupsApi,
    SuppliersBankInfoApi,
} from "@salut-mercado/octo-client";

const config = new Configuration({
    basePath: import.meta.env.API_URL || "http://localhost:8000",
});

export const api = {
    suppliers: new SuppliersApi(config),
    suppliersDetails: new SuppliersDetailsApi(config),
    suppliersGroups: new SuppliersGroupsApi(config),
    suppliersBankInfo: new SuppliersBankInfoApi(config),
};
