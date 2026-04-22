import { useState, useEffect } from 'react';

/**
 * 自定义 Hook：useLocalStorage
 * 将状态同步到 localStorage，实现数据持久化
 *
 * @param {string} key - localStorage 存储键名
 * @param {*} initialValue - 初始默认值
 * @returns {[any, Function]} - [当前值, 设置值的函数]
 */
function useLocalStorage(key, initialValue) {
  // 初始化时从 localStorage 读取，若不存在则使用 initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`useLocalStorage: 读取 "${key}" 失败`, error);
      return initialValue;
    }
  });

  // 当 storedValue 变化时，同步写入 localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`useLocalStorage: 写入 "${key}" 失败`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
