import { ref } from "vue";
import { defineStore } from "pinia";

// 定義商品的 TypeScript 介面
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  image: string;
  categoryId: number;
  subCategoryId: number;
}

// 定義分類的 TypeScript 介面
interface Category {
  id: number;
  name: string;
  subCategories: { id: number; name: string }[];
}

// 定義商品狀態的介面
interface ProductState {
  products: Product[];
  categories: Category[];
  selectedCategoryId: number | null;
  selectedSubCategoryId: number | null;
}

export const useProductStore = defineStore("product", () => {
  // 狀態
  const products = ref<Product[]>([
    {
      id: 1,
      name: "手機",
      price: 599,
      description: "一款高性能的智能手機，配備最新處理器和高清螢幕。",
      stock: 10,
      image: "/products/phone.jpg",
      categoryId: 1,
      subCategoryId: 11,
    },
    {
      id: 2,
      name: "T恤",
      price: 29,
      description: "舒適的棉質T恤，適合日常穿著，多種顏色可選。",
      stock: 50,
      image: "/products/tshirt.jpg",
      categoryId: 2,
      subCategoryId: 21,
    },
    {
      id: 3,
      name: "書",
      price: 15,
      description: "一本暢銷小說，適合所有年齡層閱讀。",
      stock: 100,
      image: "/products/book.jpg",
      categoryId: 3,
      subCategoryId: 31,
    },
    {
      id: 4,
      name: "筆電",
      price: 999,
      description: "高效能筆記型電腦，適合工作和娛樂。",
      stock: 5,
      image: "/NoImage.png",
      categoryId: 1,
      subCategoryId: 12,
    },
    {
      id: 5,
      name: "耳機",
      price: 89,
      description: "無線藍牙耳機，音質清晰，續航長。",
      stock: 30,
      image: "/NoImage.png",
      categoryId: 1,
      subCategoryId: 13,
    },
    {
      id: 6,
      name: "牛仔褲",
      price: 49,
      description: "時尚耐穿的牛仔褲，適合各種場合。",
      stock: 40,
      image: "/NoImage.png",
      categoryId: 2,
      subCategoryId: 22,
    },
    {
      id: 7,
      name: "數學教材",
      price: 25,
      description: "高中數學教材，內容詳盡，適合自學。",
      stock: 60,
      image: "/NoImage.png",
      categoryId: 3,
      subCategoryId: 32,
    },
    {
      id: 8,
      name: "沙發",
      price: 499,
      description: "舒適的現代風格沙發，適合客廳使用。",
      stock: 8,
      image: "/NoImage.png",
      categoryId: 4,
      subCategoryId: 41,
    },
    {
      id: 9,
      name: "廚房刀具組",
      price: 79,
      description: "高品質不銹鋼刀具組，適合家庭料理。",
      stock: 20,
      image: "/NoImage.png",
      categoryId: 4,
      subCategoryId: 42,
    },
  ]);

  const categories = ref<Category[]>([
    {
      id: 1,
      name: "電子產品",
      subCategories: [
        { id: 11, name: "手機" },
        { id: 12, name: "筆電" },
        { id: 13, name: "配件" },
      ],
    },
    {
      id: 2,
      name: "服飾",
      subCategories: [
        { id: 21, name: "上衣" },
        { id: 22, name: "褲子" },
        { id: 23, name: "鞋子" },
      ],
    },
    {
      id: 3,
      name: "書籍",
      subCategories: [
        { id: 31, name: "小說" },
        { id: 32, name: "教材" },
        { id: 33, name: "漫畫" },
      ],
    },
    {
      id: 4,
      name: "家居用品",
      subCategories: [
        { id: 41, name: "家具" },
        { id: 42, name: "廚具" },
        { id: 43, name: "裝飾" },
      ],
    },
  ]);

  // 篩選狀態
  const selectedCategoryId = ref<number | null>(null);
  const selectedSubCategoryId = ref<number | null>(null);

  // 獲取所有商品
  const getProducts = () => products.value;

  // 根據 ID 獲取單一商品
  const getProductById = (id: number) =>
    products.value.find((product) => product.id === id);

  // 根據分類 ID 獲取商品
  const getProductsByCategory = (categoryId: number) =>
    products.value.filter((product) => product.categoryId === categoryId);

  // 根據子分類 ID 獲取商品
  const getProductsBySubCategory = (subCategoryId: number) =>
    products.value.filter((product) => product.subCategoryId === subCategoryId);

  // 獲取當前篩選的商品
  const getFilteredProducts = () => {
    if (selectedSubCategoryId.value !== null) {
      return getProductsBySubCategory(selectedSubCategoryId.value);
    }
    if (selectedCategoryId.value !== null) {
      return getProductsByCategory(selectedCategoryId.value);
    }
    return products.value;
  };

  // 獲取所有分類
  const getCategories = () => categories.value;

  // 設置篩選
  const setFilter = (
    categoryId: number | null,
    subCategoryId: number | null = null
  ) => {
    selectedCategoryId.value = categoryId;
    selectedSubCategoryId.value = subCategoryId;
  };

  // 重置篩選
  const resetFilter = () => {
    selectedCategoryId.value = null;
    selectedSubCategoryId.value = null;
  };

  // 儲存到 localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem("products", JSON.stringify(products.value));
    localStorage.setItem("categories", JSON.stringify(categories.value));
  };

  // 從 localStorage 載入
  const loadFromLocalStorage = () => {
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      products.value = JSON.parse(savedProducts);
    }
    const savedCategories = localStorage.getItem("categories");
    if (savedCategories) {
      categories.value = JSON.parse(savedCategories);
    }
  };

  return {
    products,
    categories,
    selectedCategoryId,
    selectedSubCategoryId,
    getProducts,
    getProductById,
    getProductsByCategory,
    getProductsBySubCategory,
    getFilteredProducts,
    getCategories,
    setFilter,
    resetFilter,
    saveToLocalStorage,
    loadFromLocalStorage,
  };
});
