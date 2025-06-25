import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "@/utils/axios";

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  image_url: string;
  categoryId: number;
  subCategoryId: number;
}

export interface Category {
  id: number;
  name: string;
  subCategories: { id: number; name: string }[];
}

export const useProductStore = defineStore("product", () => {
  const products = ref<Product[]>([]);
  const categories = ref<Category[]>([]);
  const selectedCategoryId = ref<number | null>(null);
  const selectedSubCategoryId = ref<number | null>(null);

  const currentPage = ref(1);
  const pageSize = ref(10);
  const totalProducts = ref(0);
  const isLoading = ref(false);

  const fetchCategories = async () => {
    const response = await axios.get("/products/getcategories");
    categories.value = response.data;
  };

  const fetchProducts = async () => {
    isLoading.value = true;
    try {
      const response = await axios.get("/products/getallproducts", {
        params: {
          categoryId: selectedCategoryId.value,
          subCategoryId: selectedSubCategoryId.value,
          page: currentPage.value,
          pageSize: pageSize.value,
        },
      });
      products.value = response.data.data;
      totalProducts.value = response.data.total;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchProductById = async (id: number) => {
    try {
      const res = await axios.get<Product>(`/products/getproductbyid/${id}`);
      return res.data;
    } catch (error) {
      return null;
    }
  };

  const setFilter = async (
    categoryId: number | null,
    subCategoryId: number | null = null
  ) => {
    selectedCategoryId.value = categoryId;
    selectedSubCategoryId.value = subCategoryId;
    currentPage.value = 1;
    await fetchProducts();
  };

  const resetFilter = async () => {
    selectedCategoryId.value = null;
    selectedSubCategoryId.value = null;
    currentPage.value = 1;
    await fetchProducts();
  };

  const setPage = async (page: number) => {
    currentPage.value = page;
    await fetchProducts();
  };

  return {
    products,
    categories,
    selectedCategoryId,
    selectedSubCategoryId,
    currentPage,
    pageSize,
    totalProducts,
    isLoading,
    fetchCategories,
    fetchProducts,
    fetchProductById,
    setFilter,
    resetFilter,
    setPage,
  };
});
