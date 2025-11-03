import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Package } from "lucide-react";

export default function OrderHistory() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  if (authLoading || isLoading) {
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

  const statusColors: Record<string, string> = {
    pending: "bg-muted text-muted-foreground",
    processing: "bg-secondary text-secondary-foreground",
    shipped: "bg-primary text-primary-foreground",
    delivered: "bg-accent text-accent-foreground",
    cancelled: "bg-destructive text-destructive-foreground",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Order History</h1>
            <p className="text-lg text-muted-foreground">
              View and track all your orders
            </p>
          </div>

          {!orders || orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">
                Start shopping to see your orders here!
              </p>
              <Button asChild data-testid="button-shop-now">
                <a href="/products">Start Shopping</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order: any) => (
                <Card key={order.id} className="p-6" data-testid={`order-${order.id}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">
                          Order #{order.id.slice(0, 8)}
                        </h3>
                        <Badge className={statusColors[order.status] || statusColors.pending}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-2xl font-bold text-primary" data-testid={`text-total-${order.id}`}>
                        ${parseFloat(order.totalAmount).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.orderItems?.length || 0} item{order.orderItems?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="space-y-4">
                      {order.orderItems?.map((item: any) => (
                        <div key={item.id} className="flex gap-4" data-testid={`order-item-${item.id}`}>
                          <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                            <Package className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium line-clamp-1">{item.productName}</p>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity} × ${parseFloat(item.productPrice).toFixed(2)}
                            </p>
                          </div>
                          <p className="font-semibold">${parseFloat(item.subtotal).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t mt-6 pt-6 flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" asChild data-testid={`button-view-details-${order.id}`}>
                      <a href={`/order-confirmation/${order.id}`}>View Details</a>
                    </Button>
                    {order.status === 'delivered' && (
                      <Button variant="outline" data-testid={`button-reorder-${order.id}`}>
                        Reorder
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
