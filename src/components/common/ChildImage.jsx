import React from 'react';
import { useChildImageUrl } from '../../lib/childImages';

export default function ChildImage({ src, className = '', ...imageProps }) {
  const imageUrl = useChildImageUrl(src);

  if (!imageUrl) {
    return <span aria-hidden="true" className={className} />;
  }

  return <img {...imageProps} src={imageUrl} className={className} />;
}