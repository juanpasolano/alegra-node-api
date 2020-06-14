import axios, { AxiosInstance, AxiosResponse } from "axios";
import { setupCache } from "axios-cache-adapter";

enum Order {
  ASC,
  DESC,
}

interface IItemsGet {
  start: number;
  limit: number;
  order_direction: Order;
  order_field: string;
  query: string;
  metadata: boolean;
  idWarehouse: number;
}

export declare module AlegraResponses {
  export interface ItemCategory {
    id: string;
    name: string;
    description: string;
    status: string;
  }

  export interface Warehouse {
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

  export interface Inventory {
    unit: string;
    availableQuantity: number;
    unitCost: number;
    initialQuantity: number;
    warehouses: Warehouse[];
  }

  export interface Tax {
    id: number;
    name: string;
    percentage: number;
    description: string;
    status: string;
  }

  export interface Category {
    id: number;
    name: string;
  }

  export interface Price {
    idPriceList: number;
    name: string;
    price: number;
  }

  export interface Item {
    id: number;
    name: string;
    description: string;
    reference: string;
    status: string;
    itemCategory: ItemCategory;
    inventory: Inventory;
    tax: Tax[];
    category: Category;
    price: Price[];
  }
}

export default class Alegra {
  public client: AxiosInstance;

  constructor(user: string, key: string) {
    const auth = btoa(`${user}:${key}`);

    const cache = setupCache({
      maxAge: 15 * 60 * 1000,
    });
    const axiosInstance = axios.create({
      baseURL: "https://api.alegra.com/api/v1/",
      adapter: cache.adapter,
    });
    axiosInstance.defaults.headers.common["Authorization"] = `Basic ${auth}`;
    this.client = axiosInstance;
  }

  items = {
    getById: (id: number): Promise<AxiosResponse<AlegraResponses.Item>> => {
      return this.client.get(`/items/${id}`);
    },
    get: (params?: IItemsGet): Promise<AxiosResponse<AlegraResponses.Item[]>> => {
      return this.client.get("/items", { params });
    },
  };

  contacts = {
    get: (params?: IItemsGet): Promise<AxiosResponse<any>> => {
      return this.client.get("/contacts", { params });
    },
  }
}
