import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { setupCache } from 'axios-cache-adapter';

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
    getById: (id: number): Promise<AxiosResponse<Item>> => {
      return this.client.get(`/items/${id}`);
    },
    get: (params?: IItemsGet): Promise<AxiosResponse<Item[]>> => {
      return this.client.get('/items', { params });
    },
  };

  contacts = {
    get: (params?: IItemsGet): Promise<AxiosResponse<any>> => {
      return this.client.get('/contacts', { params });
    },
  };
}
