import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from 'react-router';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';
import heroImage from '~/assets/image1.webp';

export const meta: MetaFunction = () => {
  return [{title: 'Toy Store | Playful Adventures Await'}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero h-[70vh] flex items-center w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Toy Store Hero" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full text-center px-4 relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold uppercase mb-6 text-white">
            TOYS & GAMES
          </h1>
          <p className="text-2xl md:text-4xl max-w-2xl mx-auto mb-8 text-white">
            ENDLESS FUN AWAITS
          </p>
          <Link 
            to="/collections" 
            className="inline-block bg-yellow-400 text-purple-800 font-bold py-4 px-10 text-xl uppercase tracking-wider hover:bg-yellow-300 transition-colors duration-300"
          >
            EXPLORE TOYS
          </Link>
        </div>
      </section>

      {/* Bar Below Hero */}
      <div className="promo-bar bg-amber-100 py-3">
        <div className="animate-marquee whitespace-nowrap inline-block">
          <span className="mx-4 text-sm font-bold text-amber-800">SAFE & FUN TOYS</span>
          <span className="mx-4 text-sm text-amber-600">•</span>
          <span className="mx-4 text-sm font-bold text-amber-800">EDUCATIONAL VALUE</span>
          <span className="mx-4 text-sm text-amber-600">•</span>
          <span className="mx-4 text-sm font-bold text-amber-800">EASY RETURNS</span>
          <span className="mx-4 text-sm text-amber-600">•</span>
          <span className="mx-4 text-sm font-bold text-amber-800">SAFE & FUN TOYS</span>
          <span className="mx-4 text-sm text-amber-600">•</span>
          <span className="mx-4 text-sm font-bold text-amber-800">EDUCATIONAL VALUE</span>
          <span className="mx-4 text-sm text-amber-600">•</span>
          <span className="mx-4 text-sm font-bold text-amber-800">EASY RETURNS</span>
        </div>
      </div>

      {/* Shop by Color Section */}
      <section className="py-16 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]" style={{background: 'linear-gradient(to right, #FFF8E1, #FFE0B2)'}}>
        <div className="text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-wide">
            Explore Our Toy Collections
          </h2>
          <p className="text-xl md:text-2xl mb-8 font-medium" style={{color: '#555'}}>
            Find the Perfect Toy for Every Child
          </p>
          
          {/* Category Cards - Placeholder */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10 px-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white rounded-xl p-6 shadow-md flex flex-col items-center justify-center"
              >
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-20 h-20 mb-4" />
                <h3 className="text-lg font-bold text-gray-800 text-center">Collection {item}</h3>
                <div className="mt-2 text-orange-500 font-medium text-sm">Shop Now</div>
              </div>
            ))}
          </div>
          
          <a 
            href="/collections" 
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 text-lg uppercase tracking-wider transition-colors duration-300 rounded-sm shadow-md hover:shadow-lg"
          >
            Shop All Toys
          </a>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="featured-collection-section py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 uppercase tracking-wide">Featured Collection</h2>
          <FeaturedCollection collection={data.featuredCollection} />
        </div>
      </section>

      {/* Recommended Products */}
      <section className="recommended-products-section py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 uppercase tracking-wide">Recommended Toys</h2>
          <RecommendedProducts products={data.recommendedProducts} />
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="brand-story-section py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 uppercase tracking-wide">Perfect For Playtime</h2>
            <p className="text-lg mb-6">
              Our toys are designed to spark creativity, encourage learning, and provide hours of fun for children of all ages. 
              We believe in the power of play to shape young minds and create lasting memories.
            </p>
            <p className="text-lg">
              Each toy in our collection is carefully selected for its quality, safety, and ability to inspire imaginative play.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 uppercase tracking-wide">Happy Families</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 border border-gray-200">
              <p className="text-gray-600 mb-4">
                "The wooden building blocks have kept my 5-year-old entertained for hours. 
                The quality is excellent and the design encourages creativity."
              </p>
              <p className="font-bold">— Sarah M.</p>
            </div>
            <div className="bg-white p-6 border border-gray-200">
              <p className="text-gray-600 mb-4">
                "My daughter loves her new art set! The variety of supplies has inspired her to create 
                amazing masterprises. Great value for the price."
              </p>
              <p className="font-bold">— James T.</p>
            </div>
            <div className="bg-white p-6 border border-gray-200">
              <p className="text-gray-600 mb-4">
                "Fast shipping and beautifully packaged. The educational games have made 
                learning math fun for my twins. Highly recommend!"
              </p>
              <p className="font-bold">— Maria L.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section py-16 bg-raspberry-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 uppercase tracking-wide">Toy Club Newsletter</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get <span className="font-bold">10% off</span> your first order + updates on new arrivals
          </p>
          <div className="max-w-md mx-auto flex">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 transition duration-300 uppercase tracking-wider">
              Sign Up
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection block border border-gray-200 p-6 bg-white hover:border-orange-300 transition-colors duration-300"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image aspect-[16/9] mb-4">
          <Image data={image} sizes="100vw" className="w-full h-full object-contain" />
        </div>
      )}
      <h3 className="text-2xl font-bold uppercase">{collection.title}</h3>
      <p className="text-orange-500 font-bold mt-2">SHOP COLLECTION</p>
    </Link>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="recommended-products">
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {response
                ? response.products.nodes.map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
