import { useEffect, useRef } from 'react';
import TypeIt from 'typeit';

interface TypeItTextProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  nextStringDelay?: number;
  className?: string;
  loop?: boolean;
}

export function TypeItText({
  texts,
  speed = 50,
  deleteSpeed = 30,
  nextStringDelay = 2000,
  className = '',
  loop = true,
}: TypeItTextProps) {
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (elementRef.current && texts.length > 0) {
      new TypeIt(elementRef.current, {
        strings: texts,
        speed,
        breakLines: false,
        loop,
        waitUntilVisible: true,
        deleteSpeed,
        nextStringDelay,
      }).go();
    }
  }, [texts, speed, deleteSpeed, nextStringDelay, loop]);

  return (
    <span ref={elementRef} className={className}>
      {texts[0] || ''}
    </span>
  );
}
