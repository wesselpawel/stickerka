"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type CartLineImageProps = {
  item: {
    image_source?: string;
    image_thumbnail?: string;
    isCollectionBundle?: boolean;
    collectionImages?: string[];
    title?: string;
  };
  width: number;
  height: number;
  className: string;
};

export default function CartLineImage({ item, width, height, className }: CartLineImageProps) {
  const collectionImages = item.isCollectionBundle ? item.collectionImages : undefined;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!collectionImages || collectionImages.length < 2) return;
    const imageCount = collectionImages.length;
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % imageCount);
    }, 3000);
    return () => window.clearInterval(intervalId);
  }, [collectionImages]);

  const src =
    collectionImages?.[activeIndex % Math.max(collectionImages.length, 1)] ||
    item.image_thumbnail ||
    item.image_source;
  if (!src) return null;

  return <Image width={width} height={height} src={src} alt="" className={className} />;
}
