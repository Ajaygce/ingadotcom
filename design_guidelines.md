# Design Guidelines for Ingaa Baby Products E-commerce

## Design Approach

**Reference-Based Approach**: Drawing inspiration from premium baby product retailers like Babylist and The Honest Company, combined with modern e-commerce patterns from Shopify and Etsy. The design prioritizes emotional connection, trust-building, and gentle aesthetics that resonate with parents.

**Core Principles:**
- Nurturing & Safe: Every element conveys warmth, safety, and care
- Trust-First: Prominent safety certifications, reviews, and transparent information
- Parent-Friendly: Intuitive navigation for busy parents shopping on mobile
- Product-Focused: Large, beautiful imagery that showcases products clearly

## Typography System

**Font Families:**
- Primary (Headings): 'Quicksand' or 'Nunito' - rounded, friendly sans-serif
- Secondary (Body): 'Inter' or 'Open Sans' - clean, readable
- Accent (Special elements): Inherit primary but italic for emphasis

**Type Scale:**
- Hero Headlines: text-5xl to text-7xl, font-bold
- Section Headers: text-3xl to text-4xl, font-semibold
- Product Titles: text-2xl, font-medium
- Body Text: text-base to text-lg for readability
- Captions/Labels: text-sm
- Mobile: Scale down by one level (text-4xl becomes text-3xl)

**Line Height:**
- Headlines: leading-tight (1.1-1.2)
- Body: leading-relaxed (1.75) for comfortable reading
- Product descriptions: leading-loose (2.0)

## Layout System

**Spacing Primitives:**
Core spacing units: **2, 4, 8, 12, 16, 24** (Tailwind units)
- Micro spacing (icons, badges): space-2, gap-2
- Component internal padding: p-4, p-6
- Section spacing: py-16, py-24, py-32
- Container max-widths: max-w-7xl for main content, max-w-6xl for product grids

**Grid System:**
- Home Page Category Grid: grid-cols-2 md:grid-cols-3 lg:grid-cols-4
- Product Catalog: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Featured Products: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Review Cards: grid-cols-1 md:grid-cols-2
- Admin Dashboard: grid-cols-1 lg:grid-cols-3 (for metrics/stats)

**Container Strategy:**
- Full-width hero sections with inner max-w-7xl
- Content sections: max-w-6xl mx-auto px-4
- Product detail: max-w-5xl for optimal viewing
- Forms/Checkout: max-w-4xl for focus

## Component Library

### Navigation Header
**Desktop:**
- Sticky header with subtle shadow on scroll
- Logo left (150-180px width), centered navigation, right-aligned cart/wishlist/account icons
- Search bar prominent in center (max-w-2xl)
- Icon badges showing cart item count (rounded-full, -top-2, -right-2)
- Secondary navigation bar below: Category links with hover dropdown mega-menus

**Mobile:**
- Hamburger menu (left), logo (center), cart icon (right)
- Search bar expands on tap below header
- Full-screen slide-in navigation menu with category accordion

### Home Page Structure (7 Sections)

**1. Hero Section (80vh):**
- Large hero image (1920x1080) showing happy baby/parent moment
- Overlaid headline (text-5xl md:text-7xl) with subheadline
- Dual CTA buttons: "Shop Now" (primary) + "New Arrivals" (secondary)
- Buttons with backdrop-blur-sm background treatment
- Trust indicators below: "Free Shipping Over $50 | 30-Day Returns | Safety Certified"

**2. Category Navigation Grid:**
- 8 category cards in grid-cols-2 md:grid-cols-4 layout
- Each card: rounded-2xl, aspect-square, image with gradient overlay
- Category name in text-xl, font-semibold
- Hover effect: subtle lift (scale-105 transition)

**3. Featured Products Carousel:**
- Horizontal scrollable carousel of 8-12 featured items
- Each product card: image, title, price, rating stars, quick-add button
- "View All Featured" link at end

**4. Trust/Safety Section:**
- grid-cols-2 md:grid-cols-4 for safety certifications
- Large icons (h-16 w-16) for: Safety Tested, Non-Toxic, Organic, BPA-Free
- Short description under each (text-sm)

**5. Bestsellers Grid:**
- Title "Parent Favorites" (text-4xl)
- grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- 8 products with full card treatment

**6. Reviews/Testimonials:**
- "What Parents Say" header
- grid-cols-1 md:grid-cols-2 with 4 review cards
- Each card: quote, star rating, parent name, photo (rounded-full, h-12 w-12)
- Overall rating display: "4.8 stars from 2,500+ happy parents"

**7. Newsletter Signup Section:**
- Split layout: Left side compelling copy, right side form
- Heading: "Join Our Community" (text-3xl)
- Input field + subscribe button
- Small benefit bullets below: "Exclusive deals | Parenting tips | New arrivals first"

### Product Card (Reusable)
- aspect-square image container with rounded-lg
- Wishlist heart icon (top-right, absolute positioning)
- Badge overlay for "New" or "Sale" (top-left)
- Product name (text-lg, font-medium, line-clamp-2)
- Star rating + review count (text-sm)
- Price display (text-xl, font-bold)
- "Add to Cart" button (w-full, rounded-lg, h-12)
- Quick view icon on hover (eye icon)

### Product Detail Page Layout

**Image Gallery (Left, 60% width on desktop):**
- Main image: aspect-square, w-full, max-h-screen
- Thumbnail strip below: flex gap-4, overflow-x-auto
- Video thumbnail if available (play icon overlay)
- Zoom on hover/tap functionality
- Image navigation dots

**Product Info Panel (Right, 40% width):**
- Breadcrumb navigation (text-sm)
- Product title (text-3xl, font-bold)
- Star rating + "1,234 reviews" link (text-lg)
- Price (text-4xl, font-bold)
- Safety certification badges row (flex gap-2, mb-8)
- Size/variant selector (if applicable): rounded-lg buttons, h-12
- Quantity selector: input with +/- buttons (h-12)
- "Add to Cart" CTA (w-full, h-14, text-lg)
- "Add to Wishlist" secondary button (w-full, h-12)
- Accordion sections (mt-12):
  - Description (text-lg, leading-loose)
  - Safety & Certifications (bullet list with icons)
  - Care Instructions
  - Shipping & Returns

**Reviews Section (Below, full-width):**
- Heading: "Customer Reviews" (text-3xl)
- Rating summary bar chart (5 stars to 1 star distribution)
- Filter/sort controls
- Review cards in grid-cols-1 md:grid-cols-2 gap-8
- Load more button

**Related Products:**
- "You Might Also Love" (text-3xl)
- Horizontal scroll of 8 product cards

### Shopping Cart (Slide-over Panel)
- Right-side slide-in (w-full md:w-96)
- Header: "Your Cart" + close button
- Cart items: image (h-20 w-20), title, price, quantity selector, remove button
- Subtotal calculation
- "Continue Shopping" link
- "Checkout" button (w-full, h-14)
- Free shipping progress bar if applicable

### Checkout Flow (Multi-step)
**Layout:** max-w-6xl, grid-cols-1 lg:grid-cols-3
- Left column (col-span-2): Form steps
- Right column: Order summary sticky sidebar

**Steps:**
1. Shipping Information (form fields with labels, h-12 inputs)
2. Payment Method (Stripe/PayPal tabs)
3. Review Order

### Admin Panel

**Dashboard Layout:**
- Sidebar navigation (w-64, fixed on desktop)
- Main content area with top metrics row: grid-cols-1 md:grid-cols-4
- Metric cards: p-6, rounded-xl, with icon, number (text-4xl), label

**Product Management Table:**
- Search/filter bar at top
- Responsive table with: thumbnail, name, category, price, stock, actions
- Pagination at bottom
- "Add Product" floating action button

**Product Form:**
- Two-column layout on desktop
- Left: Image upload area (drag-drop zone)
- Right: Form fields (all h-12 inputs, mb-6 spacing)
- WYSIWYG editor for description
- Tag input for categories

## Images

**Hero Image:**
Large, professional lifestyle photography (1920x1080 minimum) showing:
- Happy parent holding/playing with baby
- Warm, natural lighting
- Products subtly integrated in scene
- Soft focus background

**Category Images:**
Square format (800x800), showing:
- Representative product from category
- Clean, minimal background
- Consistent lighting across all categories

**Product Images:**
- Primary: Square format (1200x1200)
- Multiple angles (4-6 images)
- Lifestyle shot showing product in use
- Detail shots of safety features
- Size comparison if relevant

**Trust/Review Section:**
- Parent headshots: circular crops (300x300)
- Safety certification logos: SVG or high-res PNG

## Animations

**Minimal, Purposeful Animations:**
- Navigation: transition-transform duration-200 for hovers
- Product cards: scale-105 on hover (transform transition-200)
- Cart slide-in: translate-x animation (duration-300)
- Accordion: max-height transition (duration-200)
- Image carousel: smooth scroll (scroll-smooth)

**No animations for:**
- Text appearance
- Background effects
- Complex scroll-triggered effects

## Accessibility

- All images have descriptive alt text
- Form inputs have associated labels (not just placeholders)
- Focus states clearly visible (ring-2 ring-offset-2)
- Minimum touch target: h-12 (48px)
- Sufficient contrast maintained throughout
- Keyboard navigation fully supported
- ARIA labels for icon-only buttons
- Skip navigation link at top