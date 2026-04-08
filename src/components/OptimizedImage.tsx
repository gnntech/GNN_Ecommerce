interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  loading?: "lazy" | "eager";
}

const OptimizedImage = ({ 
  src, 
  alt, 
  className = "", 
  onError,
  loading = "lazy" 
}: OptimizedImageProps) => {
  // Convert PNG/JPG to WebP path
  const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  
  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img 
        src={src} 
        alt={alt} 
        className={className}
        onError={onError}
        loading={loading}
      />
    </picture>
  );
};

export default OptimizedImage;
