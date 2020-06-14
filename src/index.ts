import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { setupCache } from 'axios-cache-adapter';

enum Order {
  ASC,
  DESC,
}

/**
 * REQUESTS
 */
interface BaseRequest {
  start: number;
  limit: number;
  order_direction: Order;
  order_field: string;
  query: string;
  metadata: boolean;
}

interface AlegraItemsQueryParams extends BaseRequest {
  idWarehouse: number;
}

interface AlegraConstactsQueryParams extends BaseRequest {
  type: number;
  name: string;
  identification: string;
}

/** ---------------------------
 * RESPONSE TYPES
 * ---------------------------- 
 * */

/** ---------------------------
 * Items
 * ---------------------------- 
 * */
export interface AlegraItemCategory {
  id: string;
  name: string;
  description: string;
  status: string;
}

export interface AlegraWarehouse {
  id: string;
  name: string;
  observations?: any;
  isDefault: boolean;
  address: string;
  status: string;
  initialQuantity: string;
  availableQuantity: string;
  minQuantity: string;
  maxQuantity: string;
}

export interface AlegraInventory {
  unit: string;
  availableQuantity: number;
  unitCost: number;
  initialQuantity: number;
  warehouses: AlegraWarehouse[];
}

export interface AlegraTax {
  id: number;
  name: string;
  percentage: number;
  description: string;
  status: string;
}

export interface AlegraCategory {
  id: number;
  name: string;
}

export interface AlegraPrice {
  idPriceList: number;
  name: string;
  price: number;
}

export interface AlegraItem {
  id: number;
  name: string;
  description: string;
  reference: string;
  status: string;
  itemCategory: AlegraItemCategory;
  inventory: AlegraInventory;
  tax: AlegraTax[];
  category: AlegraCategory;
  price: AlegraPrice[];
}

/** ---------------------------
 * Contacts
 * ---------------------------- 
 * */

export interface AlegraIdentificationObject {
  type: string;
  number: string;
  dv: string;
}

export interface AlegraAddress {
  address: string;
  city: string;
  department: string;
  country: string;
  zipCode: string;
}

export interface AlegraTerm {
  id: string;
  name: string;
  days: string;
}

export interface AlegraPriceList {
  id: number;
  name: string;
}

export interface AlegraContact {
  id: string;
  name: string;
  identification: string;
  email: string;
  phonePrimary: string;
  phoneSecondary: string;
  fax: string;
  mobile: string;
  observations: string;
  kindOfPerson: string;
  regime: string;
  identificationObject: AlegraIdentificationObject;
  address: AlegraAddress;
  type: any[];
  seller?: any;
  term: AlegraTerm;
  priceList: AlegraPriceList;
  internalContacts: any[];
}

export default class Alegra {
  public client: AxiosInstance;

  constructor(user: string, key: string) {
    if (typeof window !== 'undefined') {
      // tslint:disable
      console.warn(
        `
        ---------------------------------------------------------
        ❌ WARNING: It seems you are trying to use Alegra's api in the browser. You should not be using Alegra's credentials in the browser. 
        They can easily get stolen and cause real damage!
        You should not be using Alegra's credentials in the browser. They can easily get stolen and cause real damage!,
        This package should be used only in a node environment. Use at your own risk!
        ---------------------------------------------------------
        `,
      );
      // tslint:enable
    }
    const auth = Buffer.from(`${user}:${key}`).toString('base64');

    const cache = setupCache({
      maxAge: 15 * 60 * 1000,
    });
    const axiosInstance = axios.create({
      baseURL: 'https://api.alegra.com/api/v1/',
      adapter: cache.adapter,
    });
    axiosInstance.defaults.headers.common.Authorization = `Basic ${auth}`;
    this.client = axiosInstance;
  }

  items = {
    getById: (id: number): Promise<AxiosResponse<AlegraItem>> => {
      return this.client.get(`/items/${id}`);
    },
    get: (params?: AlegraItemsQueryParams): Promise<AxiosResponse<AlegraItem[]>> => {
      return this.client.get(`/items`, { params });
    },
  };

  contacts = {
    getById: (id: number): Promise<AxiosResponse<AlegraContact>> => {
      return this.client.get(`/contacts/${id}`);
    },
    get: (params?: AlegraConstactsQueryParams): Promise<AxiosResponse<AlegraContact[]>> => {
      return this.client.get(`/contacts`, { params });
    },
  };
}
