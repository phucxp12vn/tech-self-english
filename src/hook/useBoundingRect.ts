import { useCallback, useLayoutEffect, useRef, useState } from 'react';

type Rect = DOMRectReadOnly;

function debounce<T extends (...args: any[]) => void>(delay: number, fn: T) {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function useBoundingRect(delay = 100) {
  const nodeRef = useRef<HTMLElement | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    nodeRef.current = node;
  }, []);

  useLayoutEffect(() => {
    if (!nodeRef.current) return;

    const measure = () => {
      const node = nodeRef.current;
      if (!node) return;
      setRect(node.getBoundingClientRect());
    };

    const listener = debounce(delay, measure);

    measure();
    window.addEventListener('resize', listener);
    window.addEventListener('scroll', listener, true);

    return () => {
      window.removeEventListener('resize', listener);
      window.removeEventListener('scroll', listener, true);
    };
  }, [delay]);

  return [ref, rect] as const;
}
