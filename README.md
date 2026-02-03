# 🌍 Wonderlust  
*A Full-Stack Travel Listing Platform*

Wonderlust is a full-stack web application inspired by Airbnb, where users can explore, create, review, and manage travel listings with map-based locations, image uploads, authentication, and search functionality.

This project demonstrates **real-world full-stack development practices**, including authentication, authorization, cloud services, validation, security, SEO, and performance optimization.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- User signup, login, and logout
- Secure password hashing (Passport Local Mongoose)
- Session-based authentication with MongoDB (`connect-mongo`)
- Authorization rules:
  - Only listing owners can edit/delete listings
  - Only review authors can delete reviews

### 🏡 Listings
- Full CRUD operations
- Image upload with **Cloudinary**
- Store image metadata (URL & filename) in MongoDB
- Categories, pricing, and detailed descriptions
- SEO-friendly listing pages

### 📍 Maps & Location
- **Mapbox** integration
- Location autocomplete while creating listings
- GeoJSON storage (`[longitude, latitude]`)
- Interactive map with markers on listing pages

### 🔍 Search
- Search listings by title, location, or country
- Case-insensitive MongoDB search
- SEO-friendly GET-based queries

### ⭐ Reviews & Ratings
- Add ratings and comments
- Average rating calculation
- Conditional UI for empty reviews
- Secure deletion with ownership checks

### 👤 User Profile
- User-specific listings
- Ownership-based actions
- Profile-level data handling

### 🧪 Validation & Error Handling
- Joi validation for users and listings
- Centralized error handling
- Flash messages for feedback
- Custom 404 and graceful error pages

### 🎨 UI & UX
- Responsive design with Bootstrap
- Password show/hide toggle
- Image preview before update
- Auto-dismiss alerts with animation
- Clean navigation for mobile & desktop

### ⚡ Performance & SEO
- Lighthouse SEO score: **90+**
- Optimized images (Cloudinary auto-format & quality)
- Lazy loading for images
- Semantic HTML structure

---

## 🛠️ Tech Stack

**Frontend**
- EJS
- Bootstrap
- Vanilla JavaScript
- Font Awesome

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose

**Authentication & Security**
- Passport.js
- Express Session
- MongoDB Session Store (`connect-mongo`)
- Joi Validation

**Cloud & APIs**
- Cloudinary (image storage)
- Mapbox (maps & geocoding)

---

## 🗂️ Project Structure

Wonderlust/
├── controllers/
├── routes/
├── models/
├── middlewares/
├── utils/
├── views/
│ ├── listings/
│ ├── users/
│ ├── reviews/
│ └── legal/
│ ├── privacy.ejs
│ └── terms.ejs
├── public/
│ ├── css/
│ ├── js/
│ └── images/
├── .env
├── app.js
└── README.md