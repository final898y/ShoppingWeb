export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timer !== null) {
      clearTimeout(timer); // 清除前一次計時
    }
    timer = setTimeout(() => {
      fn(...args); // 延遲執行真正的函式
    }, delay);
  };
}
