import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

export function ProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  return (
    <Link
      className="product-item bg-white border border-gray-200 p-4 hover:border-orange-300 transition-colors duration-300"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {image && (
        <div className="aspect-square mb-3">
          <Image
            alt={image.altText || product.title}
            data={image}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
            className="w-full h-full object-contain"
          />
        </div>
      )}
      <h4 className="font-medium mb-1">{product.title}</h4>
      <small className="text-orange-500 font-bold">
        <Money data={product.priceRange.minVariantPrice} />
      </small>
    </Link>
  );
}
