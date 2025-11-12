import { useEffect, useRef } from 'react';
import TypeIt from 'typeit';

interface TypeItTextProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  nextStringDelay?: number;
  className?: string;
  loop?: boolean;
  html?: boolean; // Nueva prop para indicar si el contenido tiene HTML
}

export function TypeItText({
  texts,
  speed = 50,
  deleteSpeed = 30,
  nextStringDelay = 2000,
  className = '',
  loop = true,
  html = false,
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
        html, // Habilitar HTML si la prop está activada
      }).go();
    }
  }, [texts, speed, deleteSpeed, nextStringDelay, loop, html]);

  return (
    <span ref={elementRef} className={className}>
      {/** biome-ignore lint/security/noDangerouslySetInnerHtml: HTML content is controlled by the component props */}
      {html ? <span dangerouslySetInnerHTML={{ __html: texts[0] || '' }} /> : texts[0] || ''}
    </span>
  );
}
