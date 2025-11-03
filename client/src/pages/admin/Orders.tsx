import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Search, Package } from "lucide-react";

export default function AdminOrders() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      toast({
        title: "Unauthorized",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }
  }, [user, authLoading, toast]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["/api/admin/orders"],
    enabled: !!user?.isAdmin,
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      await apiRequest("PUT", `/api/admin/orders/${orderId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({
        title: "Order updated",
        description: "Order status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    },
  });

  if (authLoading || !user?.isAdmin) {
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

  const filteredOrders = orders?.filter((order: any) => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <h1 className="text-4xl font-bold mb-2">Manage Orders</h1>
            <p className="text-lg text-muted-foreground">
              View and manage all customer orders
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by order ID or customer email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-orders"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48" data-testid="select-status-filter">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : filteredOrders && filteredOrders.length > 0 ? (
            <div className="space-y-6">
              {filteredOrders.map((order: any) => (
                <Card key={order.id} className="p-6" data-testid={`order-${order.id}`}>
                  <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold" data-testid={`text-order-id-${order.id}`}>
                          Order #{order.id.slice(0, 8)}
                        </h3>
                        <Badge className={statusColors[order.status] || statusColors.pending}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Customer: {order.user?.email || "Unknown"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-2xl font-bold text-primary mb-2" data-testid={`text-total-${order.id}`}>
                        ${parseFloat(order.totalAmount).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.orderItems?.length || 0} item{order.orderItems?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-6 mb-6">
                    <h4 className="font-semibold mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {order.orderItems?.map((item: any) => (
                        <div key={item.id} className="flex gap-4" data-testid={`order-item-${item.id}`}>
                          <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm line-clamp-1">{item.productName}</p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity} × ${parseFloat(item.productPrice).toFixed(2)}
                            </p>
                          </div>
                          <p className="font-semibold text-sm">${parseFloat(item.subtotal).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-6 flex flex-col sm:flex-row gap-4">
                    <Select
                      value={order.status}
                      onValueChange={(newStatus) =>
                        updateOrderStatusMutation.mutate({ orderId: order.id, status: newStatus })
                      }
                    >
                      <SelectTrigger className="w-full sm:w-48" data-testid={`select-status-${order.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" asChild data-testid={`button-view-details-${order.id}`}>
                      <a href={`/order-confirmation/${order.id}`}>View Details</a>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                {searchQuery || statusFilter !== "all" ? "No orders found" : "No orders yet"}
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
