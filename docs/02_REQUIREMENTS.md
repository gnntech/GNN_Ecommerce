# Functional & Non-Functional Requirements

## Functional Requirements

### 1. User Management
- **FR1.1**: Users can browse products without registration
- **FR1.2**: Admin can login with username/password
- **FR1.3**: JWT-based authentication for admin sessions
- **FR1.4**: Session management with automatic logout on token expiry

### 2. Product Management
- **FR2.1**: Display three product categories (Gemstones, Trees, Bracelets)
- **FR2.2**: Each product shows: name, image, price, description, benefits
- **FR2.3**: Admin can Create, Read, Update, Delete (CRUD) products
- **FR2.4**: Image upload to Cloudinary for product images
- **FR2.5**: Search products by name, category, or description
- **FR2.6**: Filter products by price range

### 3. Shopping Cart
- **FR3.1**: Add products to cart
- **FR3.2**: Update quantity in cart
- **FR3.3**: Remove items from cart
- **FR3.4**: Cart persists in localStorage
- **FR3.5**: Display cart total with item count

### 4. Checkout & Payment
- **FR4.1**: Collect shipping information (name, email, phone, address)
- **FR4.2**: Form validation for all required fields
- **FR4.3**: Razorpay payment gateway integration
- **FR4.4**: Payment verification with signature validation
- **FR4.5**: Order creation after successful payment
- **FR4.6**: Store order details in database

### 5. Content Management
- **FR5.1**: Admin can manage hero sliders
- **FR5.2**: Admin can manage celebrity reviews/testimonials
- **FR5.3**: Admin can manage image gallery
- **FR5.4**: Admin can update craftsmanship section
- **FR5.5**: Admin can manage collections
- **FR5.6**: Admin can update marquee text

### 6. Contact & Communication
- **FR6.1**: Contact form with EmailJS integration
- **FR6.2**: Email notifications for inquiries
- **FR6.3**: Display business location on Google Maps

## Non-Functional Requirements

### 1. Performance
- **NFR1.1**: Page load time < 3 seconds
- **NFR1.2**: API response time < 500ms for GET requests
- **NFR1.3**: Image optimization with Cloudinary
- **NFR1.4**: Lazy loading for images
- **NFR1.5**: Code splitting for faster initial load

### 2. Security
- **NFR2.1**: HTTPS encryption for all communications
- **NFR2.2**: Password hashing with bcrypt (10 salt rounds)
- **NFR2.3**: JWT tokens with expiration (24 hours)
- **NFR2.4**: CORS configuration to prevent unauthorized access
- **NFR2.5**: Input validation and sanitization
- **NFR2.6**: Environment variables for sensitive data
- **NFR2.7**: Razorpay signature verification for payments

### 3. Scalability
- **NFR3.1**: MongoDB Atlas for cloud database
- **NFR3.2**: Cloudinary CDN for image delivery
- **NFR3.3**: Stateless backend for horizontal scaling
- **NFR3.4**: Render auto-scaling for backend
- **NFR3.5**: Vercel edge network for frontend

### 4. Usability
- **NFR4.1**: Responsive design (mobile, tablet, desktop)
- **NFR4.2**: Intuitive navigation with clear CTAs
- **NFR4.3**: Accessible UI (WCAG 2.1 guidelines)
- **NFR4.4**: Toast notifications for user feedback
- **NFR4.5**: Loading states for async operations

### 5. Reliability
- **NFR5.1**: 99.9% uptime for production
- **NFR5.2**: Error handling with meaningful messages
- **NFR5.3**: Database backup (MongoDB Atlas automated)
- **NFR5.4**: Graceful degradation on API failures

### 6. Maintainability
- **NFR6.1**: Clean code architecture (MVC pattern)
- **NFR6.2**: Modular component structure
- **NFR6.3**: Comprehensive error logging
- **NFR6.4**: Environment-based configuration
- **NFR6.5**: Version control with Git

### 7. Compatibility
- **NFR7.1**: Support modern browsers (Chrome, Firefox, Safari, Edge)
- **NFR7.2**: Mobile browsers (iOS Safari, Chrome Mobile)
- **NFR7.3**: Minimum screen size: 320px width

### 8. SEO & Analytics
- **NFR8.1**: Meta tags for social sharing
- **NFR8.2**: Semantic HTML structure
- **NFR8.3**: robots.txt for search engines
- **NFR8.4**: Fast Core Web Vitals scores

## Constraints

1. **Budget**: Free tier hosting (Vercel, Render, MongoDB Atlas)
2. **Timeline**: 4-6 weeks development
3. **Team**: Solo developer
4. **Technology**: Must use React, Node.js, MongoDB
