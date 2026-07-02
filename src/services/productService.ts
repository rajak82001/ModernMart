import axios from "axios";

import type { Product } from "../types/product";

const BASE_URL = "https://fakestoreapi.com";

export const getProducts = async (): Promise<Product[]> => {
    try {
        const { data } = await axios.get<Product[]>(
            `${BASE_URL}/products`
        );

        return data;
    } catch {
        throw new Error("Failed to fetch products");
    }
};