export type tempSuppliersTableData = {
    id: string,
    code: string,
    name: string,
    agent: string,
    phone: string,
    taxID: string,
    delayDays: number,
    analytics: boolean,
    comments: string,
    blocked: boolean,
  }
  export interface tempTableUpdateData {
    code: string;
      name: string;
      agent: string;
      phone: string;
      delayDays: number;
      taxID: string;
      blocked: boolean;
      analytics: boolean;
      comments: string;
  }
