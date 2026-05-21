# Amazon-Type E-commerce Website Development Prompt

## Project Overview
Create a modern, Amazon-style e-commerce website using the existing RBAC backend with Stripe payment integration. The website should provide a complete shopping experience with product browsing, cart management, checkout process, and user account features.

## Current Backend Architecture Summary

### ✅ Available Backend Features:
- **User Management**: RBAC with roles (admin, user, etc.)
- **Product Management**: CRUD operations with categories, stock, pricing
- **Order Management**: Complete order lifecycle with status tracking
- **Payment Integration**: Stripe checkout with webhooks
- **Authentication**: JWT-based auth with refresh tokens
- **Permissions**: Granular permission system
- **API Endpoints**: RESTful API with Zod validation

### 📋 Backend API Endpoints Available:
```
Authentication:
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout

Products:
- GET /api/products (with search, filters, pagination)
- POST /api/products (create)
- PUT /api/products/:id (update)
- DELETE /api/products/:id (soft delete)

Orders:
- GET /api/orders (user orders, admin management)
- GET /api/orders/:id (order details)
- PUT /api/orders/:id/status (status updates)
- POST /api/orders/:id/refund (refund processing)

Payments:
- POST /api/payments/create-checkout-session
- GET /api/payments/verify-session/:sessionId
- POST /api/payments/webhook (Stripe webhooks)

Users:
- GET /api/users/profile
- PUT /api/users/profile
- POST /api/users/profile-picture
```

## 🎯 Website Requirements

### 1. Homepage & Landing
- **Hero Section**: Featured products, promotions, search bar
- **Product Categories**: Grid of main categories with images
- **Featured Products**: Carousel/grid of highlighted items
- **Deals Section**: Special offers and discounts
- **Newsletter Signup**: Email capture
- **Trust Indicators**: Security badges, customer reviews

### 2. Product Discovery
- **Product Listing Page**: Grid/list view with filters
- **Advanced Search**: Full-text search with autocomplete
- **Category Browsing**: Hierarchical category navigation
- **Product Filters**: Price range, brand, rating, in-stock
- **Sorting Options**: Price, popularity, rating, new arrivals
- **Pagination**: Infinite scroll or traditional pagination

### 3. Product Details
- **Product Gallery**: Multiple images, zoom functionality
- **Product Information**: Description, specifications, reviews
- **Pricing & Stock**: Current price, discounts, stock status
- **Variations**: Size, color, quantity selectors
- **Customer Reviews**: Rating system, user reviews
- **Related Products**: Similar items, frequently bought together
- **Add to Cart**: Quick add, wishlist functionality

### 4. Shopping Cart
- **Cart Management**: Add/remove items, quantity updates
- **Cart Summary**: Subtotal, shipping, taxes, total
- **Saved Items**: Move to wishlist, save for later
- **Cart Persistence**: Maintain cart across sessions
- **Promo Codes**: Discount code application
- **Checkout Button**: Clear CTA to payment

### 5. Checkout Process
- **Guest Checkout**: Option for non-registered users
- **User Authentication**: Login or create account
- **Shipping Information**: Address form, validation
- **Payment Method**: Stripe checkout integration
- **Order Review**: Final summary before payment
- **Order Confirmation**: Success page with order details

### 6. User Account
- **Dashboard**: Order history, quick actions
- **Profile Management**: Personal info, password change
- **Order History**: Detailed order tracking
- **Wishlist**: Saved products management
- **Addresses**: Shipping/billing addresses
- **Payment Methods**: Saved payment options
- **Settings**: Preferences, notifications

### 7. Order Management
- **Order Tracking**: Real-time status updates
- **Order Details**: Items, shipping, payment info
- **Order Actions**: Cancel, return, reorder
- **Invoice Generation**: Download receipts
- **Customer Support**: Contact options for issues

### 8. Admin Features (if needed)
- **Product Management**: Bulk operations, inventory
- **Order Management**: Fulfillment, status updates
- **Customer Management**: User accounts, support
- **Analytics Dashboard**: Sales, traffic, reports
- **Content Management**: Banners, promotions

## 🛠️ Technical Implementation

### Frontend Stack:
- **Framework**: React with Vite (current setup)
- **UI Library**: Material-UI (MUI) - already in use
- **State Management**: React Context or Redux
- **Routing**: React Router (already configured)
- **HTTP Client**: Axios (already configured)
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: MUI theme customization

### Key Components to Create:
```
Frontend Structure:
src/
├── components/
│   ├── common/           # Reusable UI components
│   ├── product/          # Product-related components
│   ├── cart/            # Shopping cart components
│   ├── checkout/        # Checkout flow components
│   ├── user/            # User account components
│   └── layout/          # Layout components
├── pages/
│   ├── Home/            # Homepage
│   ├── Products/        # Product listing/details
│   ├── Cart/            # Shopping cart
│   ├── Checkout/        # Checkout process
│   ├── Account/         # User account
│   └── Orders/          # Order management
├── hooks/               # Custom React hooks
├── context/             # React contexts
├── utils/               # Helper functions
└── services/            # API service functions
```

### Integration Points:
- **Authentication**: Use existing auth system
- **Product API**: Connect to `/api/products`
- **Order API**: Connect to `/api/orders`
- **Payment API**: Use Stripe integration
- **User API**: Connect to user management endpoints

## 🎨 Design Requirements

### Visual Design:
- **Modern & Clean**: Amazon-inspired layout
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Fast loading, optimized images
- **Brand Consistency**: Cohesive color scheme and typography

### User Experience:
- **Intuitive Navigation**: Clear menu structure
- **Search Functionality**: Fast, relevant results
- **Smooth Checkout**: Minimal friction, guest option
- **Mobile Experience**: Touch-friendly, app-like feel
- **Loading States**: Skeleton screens, progress indicators

## 📦 Features to Implement

### Phase 1 - Core Features:
1. Homepage with hero section
2. Product listing with filters
3. Product detail pages
4. Shopping cart functionality
5. Basic checkout flow
6. User authentication

### Phase 2 - Enhanced Features:
1. Advanced search and filtering
2. User account dashboard
3. Order tracking
4. Wishlist functionality
5. Product reviews and ratings
6. Related products recommendations

### Phase 3 - Advanced Features:
1. Admin dashboard
2. Analytics and reporting
3. Email notifications
4. Social login integration
5. Multi-language support
6. Progressive Web App (PWA)

## 🔧 Development Guidelines

### Code Quality:
- **TypeScript**: Strong typing for better code quality
- **Component Architecture**: Reusable, testable components
- **Error Handling**: Graceful error boundaries
- **Performance**: Code splitting, lazy loading
- **Testing**: Unit tests for critical components

### Security:
- **Input Validation**: Zod schemas for all forms
- **XSS Protection**: Sanitize user inputs
- **CSRF Protection**: Implement CSRF tokens
- **Secure Cookies**: HttpOnly, SameSite settings
- **Rate Limiting**: Prevent abuse

### SEO & Performance:
- **Meta Tags**: Proper title, description tags
- **Structured Data**: JSON-LD for products
- **Image Optimization**: WebP format, lazy loading
- **Caching Strategy**: Browser and server caching
- **Core Web Vitals**: Optimize LCP, FID, CLS

## 🚀 Deployment & DevOps

### Environment Setup:
- **Development**: Local development with hot reload
- **Staging**: Pre-production testing environment
- **Production**: Optimized, secure deployment

### Monitoring & Analytics:
- **Error Tracking**: Sentry or similar
- **Performance Monitoring**: Web Vitals tracking
- **User Analytics**: Google Analytics or privacy-focused alternative
- **A/B Testing**: Feature flags for experimentation

## 📋 API Integration Checklist

### Required API Calls:
- [ ] Product listing with pagination
- [ ] Product search and filtering
- [ ] Product details retrieval
- [ ] Cart management (local storage + API sync)
- [ ] User authentication
- [ ] Order creation and tracking
- [ ] Payment processing with Stripe
- [ ] User profile management

### Error Handling:
- [ ] Network error handling
- [ ] API error response handling
- [ ] Retry mechanisms for failed requests
- [ ] User-friendly error messages

## 🎯 Success Metrics

### Key Performance Indicators:
- **Conversion Rate**: Purchase completion rate
- **Cart Abandonment**: Reduce checkout friction
- **Page Load Speed**: < 3 seconds initial load
- **Mobile Usability**: High mobile conversion rate
- **Search Effectiveness**: Relevant search results
- **User Engagement**: Time on site, bounce rate

## 📝 Next Steps

1. **Setup Project Structure**: Create component and page directories
2. **Design System**: Establish MUI theme and design tokens
3. **Core Components**: Build reusable UI components
4. **Homepage**: Implement landing page
5. **Product Pages**: Create listing and detail views
6. **Cart System**: Implement shopping cart functionality
7. **Checkout Flow**: Build complete checkout process
8. **User Account**: Add account management features
9. **Testing**: Comprehensive testing and optimization
10. **Deployment**: Production-ready deployment

This prompt provides a comprehensive roadmap for building an Amazon-type e-commerce website using your existing RBAC backend with Stripe payment integration. The architecture is scalable, maintainable, and follows modern web development best practices.
