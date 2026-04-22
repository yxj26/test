import { useState, useEffect } from 'react';

/**
 * 自定义 Hook：useDebounce
 * 对传入值进行防抖处理，延迟指定时间后才更新返回值
 * 适用于搜索框实时筛选，避免每输入一个字符就立刻触发搜索逻辑
 *
 * @param {*} value - 需要防抖的值
 * @param {number} delay - 防抖延迟时间（毫秒），默认 300ms
 * @returns {*} - 防抖后的值
 */
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 设置定时器，delay 毫秒后更新 debouncedValue
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清理函数：每次 value 或 delay 变化时，取消上一个定时器
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
