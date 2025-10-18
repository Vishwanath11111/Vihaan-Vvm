# Vihaan Care Nest - Baby & Mother Care Service Platform

Founded by **Vishwanath V M & Megha V M**

A comprehensive platform for professional baby and mother care services serving Bangalore & Dharwad, Karnataka.

## 🎯 Project Overview

Vihaan Care Nest provides professional care services for newborns and new mothers through a subscription-based model. The platform includes both **mobile app** (Expo/React Native) and **web application** (React) versions with comprehensive backend API.

## 📱 Available Versions

### 1. Mobile App (`/frontend/`)
- **Technology**: Expo (React Native)
- **Platform**: iOS & Android
- **Port**: 3000
- **Features**: Mobile-optimized interface, touch-friendly navigation

### 2. Web Application (`/web-frontend/`)
- **Technology**: React.js
- **Platform**: Web browsers
- **Port**: 3001
- **Features**: Responsive web interface, desktop & mobile compatible

### 3. Backend API (`/backend/`)
- **Technology**: FastAPI (Python)
- **Database**: MongoDB
- **Port**: 8001
- **Features**: RESTful API, role-based authentication

## 🚀 Features

### Core Services
- **Newborn Baby Care**: Gentle oil massage, warm water bath, development exercises
- **Postpartum Mother Care**: Therapeutic massage, recovery guidance, lactation support

### Subscription Plans

#### Baby Care Packages
- **Basic**: ₹6,000/month - 2 visits per week
- **Standard**: ₹10,000/month - 4 visits per week  
- **Premium**: ₹14,000/month - Daily visits

#### Mother Care Packages
- **Basic**: ₹5,000/month - 2 visits per week
- **Standard**: ₹9,000/month - 4 visits per week
- **Premium**: ₹12,000/month - Daily visits

### User Roles & Features

#### Customers
- Browse and subscribe to care packages
- Schedule and manage visits
- Rate and review team members
- Track subscription and payment history
- Access customer dashboard

#### Team Members
- View assigned visit schedule
- Log service visits with details
- Track performance metrics
- View customer ratings and feedback

#### Administrators
- Business analytics and reports
- Team member management
- Customer management
- Visit scheduling and assignment
- Subscription and payment tracking
- System configuration

## 🛠 Technical Stack

### Frontend Technologies
- **Mobile**: Expo Router, React Native, Expo Vector Icons
- **Web**: React.js, React Router DOM, React Icons, Styled Components

### Backend Technologies
- **API**: FastAPI (Python)
- **Database**: MongoDB with Motor (async driver)
- **Authentication**: JWT with password hashing
- **Validation**: Pydantic models

### Key Features
- **Payment Integration**: UPI & Bank transfer support
- **Real-time Updates**: Visit logging and status tracking
- **Performance Analytics**: Team member metrics and ratings
- **Role-based Access**: Secure user authentication
- **Responsive Design**: Mobile-first approach

## 📋 API Endpoints

### User Management
- `POST /api/users` - Create user account
- `POST /api/users/login` - User authentication
- `GET /api/users/{user_id}` - Get user details

### Package Management
- `POST /api/packages` - Create care packages
- `GET /api/packages` - List packages (with filtering)
- `GET /api/packages/{package_id}` - Get package details

### Subscription Management
- `POST /api/subscriptions` - Create subscription
- `GET /api/subscriptions/customer/{customer_id}` - Customer subscriptions
- `GET /api/subscriptions/{subscription_id}` - Subscription details

### Visit Management
- `POST /api/visits` - Schedule visit
- `GET /api/visits/customer/{customer_id}` - Customer visits
- `GET /api/visits/team-member/{team_member_id}` - Team member visits
- `PUT /api/visits/{visit_id}/log` - Log visit completion
- `PUT /api/visits/{visit_id}/rate` - Rate visit

### Analytics & Admin
- `GET /api/team-members/{team_member_id}/performance` - Performance metrics
- `GET /api/admin/dashboard` - Admin dashboard data

## 🏃‍♂️ Quick Start

### Running the Mobile App
```bash
cd frontend
yarn install
expo start
```

### Running the Web App
```bash
cd web-frontend
yarn install
npm start
```

### Running the Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

## 📞 Contact Information

- **Phone**: +91 97405 17671
- **Email**: vihaancarenest@gmail.com
- **Service Areas**: Bangalore & Dharwad, Karnataka
- **Visit Duration**: 1-2 hours per session

## 💝 Benefits of Our Care

### For Babies
- **Promotes Healthy Skin** - Oil massage keeps skin soft and protected
- **Strengthens Muscles & Bones** - Improves circulation and growth
- **Better Sleep** - Peaceful nights for babies and parents
- **Enhances Bonding** - Skin-to-skin emotional connection
- **Boosts Immunity** - Stimulates nerve endings and metabolism

### For Mothers
- **Recovery Support** - Professional postpartum care
- **Stress Relief** - Therapeutic massage and relaxation
- **Lactation Support** - Guidance for breastfeeding
- **Mental Wellness** - Emotional support during recovery

## 📊 Business Model

- **Subscription-based** service with flexible monthly plans
- **Professional team** of trained care specialists
- **Quality assurance** through customer ratings and reviews
- **Scalable platform** supporting multiple cities
- **Comprehensive tracking** of visits and performance

## 🔒 Security & Privacy

- Secure password hashing (SHA-256)
- Role-based access control
- Data validation and sanitization
- MongoDB secure connections
- CORS protection enabled

---

**Built with ❤️ for families in Karnataka**

*Vihaan Care Nest - Where professional care meets family love*
