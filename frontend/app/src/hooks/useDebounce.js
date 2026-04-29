import { useState, useEffect } from 'react';

/**
 * useDebounce: trả về giá trị debounced sau `delay` ms.
 */
export function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

/**
 * useClickOutside: gọi callback khi click ra ngoài ref.
 */
export function useClickOutside(ref, callback) {
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, callback]);
}
