import type { ProductVariantData } from "../types/product";

export const productVariants: Record<
    number,
    ProductVariantData
> = {
    1: {
        brand: "ModernMart Essentials",

        originalPrice: 139.99,

        colors: [
            {
                name: "Black",
                hexCode: "#000000",

                images: [
                    "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
                    "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
                ],

                sizes: [
                    {
                        value: "S",
                        stock: 10,
                        status: "available",
                    },
                    {
                        value: "M",
                        stock: 2,
                        status: "low-stock",
                    },
                    {
                        value: "L",
                        stock: 0,
                        status: "sold-out",
                    },
                ],
            },

            {
                name: "Brown",
                hexCode: "#8B4513",

                images: [
                    "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
                ],

                sizes: [
                    {
                        value: "S",
                        stock: 6,
                        status: "available",
                    },
                    {
                        value: "M",
                        stock: 0,
                        status: "sold-out",
                    },
                ],
            },
        ],
    },
};