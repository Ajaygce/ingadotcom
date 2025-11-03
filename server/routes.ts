import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import * as oidc from "openid-client";
import {
  insertProductSchema,
  insertCategorySchema,
  insertReviewSchema,
  insertCartItemSchema,
  insertWishlistItemSchema,
  type User,
} from "@shared/schema";

const PgSession = ConnectPgSimple(session);

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// Auth middleware
function requireAuth(req: Request, res: Response, next: Function) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

function requireAdmin(req: Request, res: Response, next: Function) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Forbidden - Admin access required" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session setup
  app.use(
    session({
      store: new PgSession({ pool }),
      secret: process.env.SESSION_SECRET || "ingaa-baby-store-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        secure: process.env.NODE_ENV === "production",
      },
    })
  );

  // Replit Auth setup
  let oidcClient: oidc.Client | null = null;
  const hasAuthConfig = process.env.CLIENT_ID && process.env.CLIENT_SECRET;

  if (hasAuthConfig) {
    try {
      const issuerUrl = process.env.ISSUER_URL || "https://replit.com/oidc";
      const replitIssuer = await oidc.discovery(new URL(issuerUrl), process.env.CLIENT_ID);
      oidcClient = new replitIssuer.Client({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uris: [
          `${process.env.REPLIT_DEPLOYMENT === "1" ? "https" : "http"}://${process.env.REPL_SLUG || "localhost"}.${process.env.REPL_OWNER || "localhost"}.repl.co/api/auth/callback`,
        ],
        response_types: ["code"],
      });
      console.log("✓ Replit Auth configured successfully");
    } catch (error) {
      console.warn("OIDC client setup failed:", error);
    }
  } else {
    console.warn("⚠ Auth environment variables not configured. Using development mode.");
    console.warn("  Set CLIENT_ID, CLIENT_SECRET, and ISSUER_URL for production auth.");
  }

  // User middleware to attach user to request
  app.use(async (req, _res, next) => {
    if ((req.session as any).userId) {
      const user = await storage.getUser((req.session as any).userId);
      if (user) {
        req.user = user;
      }
    }
    next();
  });

  // Auth Routes
  app.get("/api/login", async (req, res) => {
    // Development mode: Create a test user for development
    if (!hasAuthConfig) {
      try {
        const testUser = await storage.upsertUser({
          id: "dev-user-123",
          email: "test@ingaa.com",
          firstName: "Test",
          lastName: "User",
          profileImageUrl: null,
          isAdmin: true, // Make test user an admin for easy testing
        });
        (req.session as any).userId = testUser.id;
        console.log("✓ Development user logged in (admin access)");
        return res.redirect("/");
      } catch (error) {
        console.error("Failed to create dev user:", error);
        return res.status(500).json({ message: "Failed to authenticate" });
      }
    }

    // Production mode: Use Replit Auth
    if (!oidcClient) {
      return res.status(500).json({ message: "Auth not configured" });
    }
    const authUrl = oidcClient.authorizationUrl({
      scope: "openid profile email",
    });
    res.redirect(authUrl);
  });

  app.get("/api/auth/callback", async (req, res) => {
    if (!oidcClient) {
      return res.status(500).json({ message: "Auth not configured" });
    }

    try {
      const params = oidcClient.callbackParams(req);
      const tokenSet = await oidcClient.oauthCallback(
        oidcClient.redirect_uris[0],
        params,
        {}
      );
      const userInfo = await oidcClient.userinfo(tokenSet.access_token!);

      const user = await storage.upsertUser({
        id: userInfo.sub,
        email: userInfo.email as string,
        firstName: (userInfo.given_name as string) || null,
        lastName: (userInfo.family_name as string) || null,
        profileImageUrl: (userInfo.picture as string) || null,
      });

      (req.session as any).userId = user.id;
      res.redirect("/");
    } catch (error) {
      console.error("Auth callback error:", error);
      res.redirect("/?error=auth_failed");
    }
  });

  app.get("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });

  app.get("/api/auth/user", (req, res) => {
    if (req.user) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Categories Routes
  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Products Routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category, featured, bestseller, limit } = req.query;
      const filters = {
        category: category as string,
        featured: featured === "true",
        bestseller: bestseller === "true",
        limit: limit ? parseInt(limit as string) : undefined,
      };
      const products = await storage.getAllProducts(filters);
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const reviews = await storage.getProductReviews(req.params.id);
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/products/:id/reviews", requireAuth, async (req, res) => {
    try {
      const validated = insertReviewSchema.parse({
        ...req.body,
        productId: req.params.id,
        userId: req.user!.id,
      });
      const review = await storage.createReview(validated);
      res.json(review);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Cart Routes
  app.get("/api/cart", requireAuth, async (req, res) => {
    try {
      const cart = await storage.getUserCart(req.user!.id);
      res.json(cart);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/cart", requireAuth, async (req, res) => {
    try {
      const validated = insertCartItemSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      const cartItem = await storage.addToCart(validated);
      res.json(cartItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/cart/:id", requireAuth, async (req, res) => {
    try {
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItem(req.params.id, quantity);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json(cartItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/cart/:id", requireAuth, async (req, res) => {
    try {
      await storage.removeFromCart(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Wishlist Routes
  app.get("/api/wishlist", requireAuth, async (req, res) => {
    try {
      const wishlist = await storage.getUserWishlist(req.user!.id);
      res.json(wishlist);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/wishlist/toggle", requireAuth, async (req, res) => {
    try {
      const { productId } = req.body;
      const isInWishlist = await storage.isInWishlist(req.user!.id, productId);

      if (isInWishlist) {
        await storage.removeFromWishlist(req.user!.id, productId);
        res.json({ removed: true });
      } else {
        const validated = insertWishlistItemSchema.parse({
          userId: req.user!.id,
          productId,
        });
        await storage.addToWishlist(validated);
        res.json({ added: true });
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Orders Routes
  app.get("/api/orders", requireAuth, async (req, res) => {
    try {
      const orders = await storage.getUserOrders(req.user!.id);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/orders/:id", requireAuth, async (req, res) => {
    try {
      const order = await storage.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      // Check if user owns this order or is admin
      if (order.userId !== req.user!.id && !req.user!.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/orders", requireAuth, async (req, res) => {
    try {
      const { paymentMethod, shippingAddress } = req.body;

      // Get user's cart
      const cart = await storage.getUserCart(req.user!.id);
      if (!cart || cart.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      // Calculate total
      const subtotal = cart.reduce((sum, item: any) => {
        return sum + parseFloat(item.product.price) * item.quantity;
      }, 0);
      const shipping = subtotal >= 50 ? 0 : 5.99;
      const tax = subtotal * 0.08;
      const totalAmount = subtotal + shipping + tax;

      // Create order items
      const orderItems = cart.map((item: any) => ({
        productId: item.product.id,
        productName: item.product.name,
        productPrice: item.product.price,
        quantity: item.quantity,
        subtotal: (parseFloat(item.product.price) * item.quantity).toFixed(2),
      }));

      // Create order
      const order = await storage.createOrder(
        {
          userId: req.user!.id,
          totalAmount: totalAmount.toFixed(2),
          status: "pending",
          paymentMethod,
          paymentStatus: "pending",
          shippingAddress,
        },
        orderItems
      );

      // Clear cart
      await storage.clearCart(req.user!.id);

      res.json({ orderId: order.id, order });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Admin Routes
  app.get("/api/admin/stats", requireAdmin, async (_req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/orders", requireAdmin, async (req, res) => {
    try {
      const { limit } = req.query;
      let orders = await storage.getAllOrders();
      if (limit) {
        orders = orders.slice(0, parseInt(limit as string));
      }
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/admin/orders/:id", requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/admin/products", requireAdmin, async (req, res) => {
    try {
      const validated = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validated);
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/categories", requireAdmin, async (req, res) => {
    try {
      const validated = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validated);
      res.json(category);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
