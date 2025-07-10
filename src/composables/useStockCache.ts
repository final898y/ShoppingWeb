import { reactive, watch } from "vue";
import type { Ref } from "vue";
import type { ProductStoreType } from "@/stores/productStore";
import { debounce } from "@/utils/debounce";
// 快取有效時間（毫秒）: 5 分鐘
const CACHE_TTL = 5 * 60 * 1000;

type CacheEntry = {
  stock: number;
  timestamp: number;
};

export function useStockCache(productStore: ProductStoreType) {
  // 1. 快取商品庫存 + 時間戳記
  const productStockMap = reactive(new Map<number, CacheEntry>());

  // 2. 防抖函式表
  const debouncedFetchStockMap = new Map<number, () => void>();

  // 3. 判斷是否過期
  const isExpired = (entry: CacheEntry): boolean =>
    Date.now() - entry.timestamp > CACHE_TTL;

  // 5. 快取取得庫存（無資料或過期則回傳 0）
  const getStock = (id: number): number => {
    const entry = productStockMap.get(id);
    return entry && !isExpired(entry) ? entry.stock : 0;
  };

  // 6. 防抖抓取 + 記錄時間戳
  const fetchStock = (id: number): Promise<number> => {
    return new Promise((resolve) => {
      const cached = productStockMap.get(id);
      if (cached && !isExpired(cached)) {
        resolve(cached.stock);
        return;
      }

      if (!debouncedFetchStockMap.has(id)) {
        const fn = debounce(async () => {
          const product = await productStore.fetchProductById(id);
          const stock = product?.stock ?? 0;
          const entry: CacheEntry = {
            stock,
            timestamp: Date.now(),
          };
          productStockMap.set(id, entry);
          resolve(stock);
        }, 300);
        debouncedFetchStockMap.set(id, fn);
      }

      debouncedFetchStockMap.get(id)!();
    });
  };

  // 7. 批次預載（通常在 onMounted 用）
  const preloadStocks = async (ids: number[]) => {
    const promises = ids.map((id) =>
      fetchStock(id).then((stock) =>
        productStockMap.set(id, {
          stock,
          timestamp: Date.now(),
        })
      )
    );
    await Promise.all(promises);
  };

  // 8. 監聽購物車變化，自動補快取
  const watchAndFill = (items: Ref<{ id: number }[]>) => {
    watch(
      () => items.value.map((item) => item.id),
      async (ids) => {
        for (const id of ids) {
          const entry = productStockMap.get(id);
          if (!entry || isExpired(entry)) {
            const stock = await fetchStock(id);
            productStockMap.set(id, {
              stock,
              timestamp: Date.now(),
            });
          }
        }
      },
      { immediate: true }
    );
  };

  return {
    getStock,
    fetchStock,
    preloadStocks,
    watchAndFill,
  };
}
