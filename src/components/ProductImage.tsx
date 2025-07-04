import React from 'react';

interface ProductImageProps {
  image: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  stylesCustom?: React.CSSProperties;
}

const ProductImage: React.FC<ProductImageProps> = ({ image, alt, className, style, stylesCustom }) => {
  if (image.startsWith('<svg')) {
    // É um SVG
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: image }}
        className={className}
        style={{...style, ...stylesCustom}}
      />
    );
  } else {
    // É uma URL
    return <img src={image} alt={alt} className={className} style={style} />;
  }
};

export default ProductImage; 