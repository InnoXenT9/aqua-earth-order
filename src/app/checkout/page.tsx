import { CheckoutForm } from '@/components/checkout/checkout-form';
import { PrivatePage } from '@/components/auth/private-page';

export default function CheckoutPage() {
  return (
    <PrivatePage>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-headline font-bold mb-8 text-center">
            Checkout
          </h1>
          <CheckoutForm />
        </div>
      </div>
    </PrivatePage>
  );
}