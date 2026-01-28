
// Product data is managed in data.js and exposed here for the React application with TypeScript support.
import { Product } from './types';
// @ts-ignore
import { PRODUCTS as DATA } from './data.js';

/**
 * Global product catalog sourced from the central data.js file.
 * We cast the plain JS data to the Product interface for better IDE support and type checking.
 */
export const PRODUCTS: Product[] = DATA as Product[];
