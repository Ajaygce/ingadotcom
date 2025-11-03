import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { CheckCircle, Package } from "lucide-react";

export default function OrderConfirmation() {
  const [, params] = useRoute("/order-confirmation/:orderId");
  const orderId = params?.orderId;

  const { data: order, isLoading } = useQuery({
    queryKey: [`/api/orders/${orderId}`],
    enabled: !!orderId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl text-muted-foreground">Order not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="mb-8">
            <CheckCircle className="h-24 w-24 text-accent mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-xl text-muted-foreground">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
          </div>

          <Card className="p-8 text-left mb-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="font-semibold text-lg mb-4">Order Details</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Number:</span>
                    <span className="font-medium" data-testid="text-order-id">#{order.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="capitalize">{order.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-semibold text-primary" data-testid="text-order-total">
                      ${parseFloat(order.totalAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-semibold text-lg mb-4">Shipping Address</h2>
                <div className="text-sm">
                  <p>{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="font-semibold text-lg mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.orderItems?.map((item: any) => (
                  <div key={item.id} className="flex gap-4" data-testid={`order-item-${item.id}`}>
                    <Package className="h-12 w-12 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">${parseFloat(item.subtotal).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild data-testid="button-continue-shopping">
              <a href="/products">Continue Shopping</a>
            </Button>
            <Button size="lg" variant="outline" asChild data-testid="button-view-orders">
              <a href="/orders">View All Orders</a>
            </Button>
          </div>

          <div className="mt-12 p-6 bg-card rounded-lg">
            <h3 className="font-semibold text-lg mb-2">What's Next?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We'll send you a confirmation email with tracking information once your order ships.
            </p>
            <p className="text-sm text-muted-foreground">
              Expected delivery: 3-5 business days
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
