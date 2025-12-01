'use client';
import { ProductList } from '@/components/menu/product-list';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/lib/types';
import { initialProducts } from '@/lib/initial-data';

export default function Home() {
  const menuItems: Product[] = initialProducts;
  const isLoading = false; // Data is loaded locally, so it's never loading

  const categories = menuItems ? [...new Set(menuItems.map((item) => item.category))] : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          {isLoading ? (
            <nav className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </nav>
          ) : (
            <nav className="space-y-2">
              {categories.map((category) => (
                <a
                  key={category}
                  href={`#${category.replace(/\s+/g, '-')}`}
                  className="block p-2 rounded-lg hover:bg-muted font-medium"
                >
                  {category}
                </a>
              ))}
            </nav>
          )}
        </aside>

        <main className="md:col-span-3">
           <h2 className="text-3xl font-headline font-semibold mb-8 border-b-4 border-primary pb-2">
            Our Menu
          </h2>
          {isLoading ? (
             <div className="space-y-12">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
             </div>
          ) : (
            <div className="space-y-12">
              {categories.map((category) => (
                <section key={category} id={category.replace(/\s+/g, '-')}>
                  <h3 className="text-2xl font-bold mb-6">{category}</h3>
                  <div className="grid grid-cols-1 gap-6">
                    {menuItems && menuItems
                      .filter((item) => item.category === category)
                      .map((item) => (
                        <ProductList key={item.id} item={item} />
                      ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}