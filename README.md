# GioTap Backend API

A comprehensive Node.js backend API for GioTap - Smart School Transportation Management System.

## 🚀 Features

- **Multi-role Authentication**: Admin, Driver, Aide, Site Manager, Mechanic, Parent
- **Real-time Communication**: Socket.io integration
- **Email & SMS Notifications**: Automated alerts and notifications
- **GPS Tracking**: Vehicle location tracking
- **RFID Integration**: Student attendance tracking
- **Route Management**: Smart route optimization
- **Vehicle Management**: Fleet management system

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io
- **Email**: Nodemailer
- **SMS**: Twilio
- **Validation**: Express-validator
- **Rate Limiting**: Express-rate-limit

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Khalid-giotap/giotap-backend-nodejs.git
   cd giotap-backend-nodejs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000

   # Database
   MONGODB_URI=mongodb://localhost:27017/giotap

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d

   # Email Configuration (Gmail)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=GioTap <noreply@giotap.com>

   # Twilio Configuration
   TWILIO_ACCOUNT_SID=your-twilio-account-sid
   TWILIO_AUTH_TOKEN=your-twilio-auth-token
   TWILIO_FROM_NUMBER=whatsapp:+14155238886

   # Frontend URL
   FRONTEND_URL=http://localhost:3000

   # CORS Origins
   CORS_ORIGIN=http://localhost:3000,http://localhost:3050
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Express-validator for data validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Environment Variables**: Secure credential management

## 📚 API Documentation

### Authentication Endpoints

#### Admin Authentication
- `POST /api/v1/admin/auth/sign-up` - Register new admin
- `POST /api/v1/admin/auth/sign-in` - Admin login
- `DELETE /api/v1/admin/auth/sign-out` - Admin logout
- `GET /api/v1/admin/auth/me` - Get admin profile
- `PUT /api/v1/admin/auth/change-password` - Change password
- `POST /api/v1/admin/auth/forgot-password` - Request password reset
- `PUT /api/v1/admin/auth/reset-password` - Reset password

#### Driver Authentication
- `POST /api/v1/driver/auth/sign-in` - Driver login
- `DELETE /api/v1/driver/auth/sign-out` - Driver logout
- `GET /api/v1/driver/auth/me` - Get driver profile

#### Aide Authentication
- `POST /api/v1/aide/auth/sign-in` - Aide login
- `DELETE /api/v1/aide/auth/sign-out` - Aide logout
- `GET /api/v1/aide/auth/me` - Get aide profile

### Management Endpoints

#### Vehicle Management
- `GET /api/v1/admin/vehicle` - Get all vehicles
- `POST /api/v1/admin/vehicle` - Create new vehicle
- `GET /api/v1/admin/vehicle/:id` - Get vehicle by ID
- `PUT /api/v1/admin/vehicle/:id` - Update vehicle
- `DELETE /api/v1/admin/vehicle/:id` - Delete vehicle

#### Route Management
- `GET /api/v1/admin/route` - Get all routes
- `POST /api/v1/admin/route` - Create new route
- `GET /api/v1/admin/route/:id` - Get route by ID
- `PUT /api/v1/admin/route/:id` - Update route
- `DELETE /api/v1/admin/route/:id` - Delete route

#### Driver Management
- `GET /api/v1/admin/driver` - Get all drivers
- `POST /api/v1/admin/driver` - Create new driver
- `GET /api/v1/admin/driver/:id` - Get driver by ID
- `PUT /api/v1/admin/driver/:id` - Update driver
- `DELETE /api/v1/admin/driver/:id` - Delete driver

## 🔄 Real-time Features

The API includes Socket.io integration for real-time features:

- **Live GPS Tracking**: Real-time vehicle location updates
- **Attendance Alerts**: Instant notifications for student attendance
- **Emergency Alerts**: Real-time emergency notifications
- **Status Updates**: Live status updates for vehicles and routes

## 📧 Notification System

### Email Notifications
- Login alerts
- Password reset links
- System notifications
- Emergency alerts

### SMS Notifications
- Login confirmations
- Emergency alerts
- Attendance notifications
- Route updates

## 🗄️ Database Schema

### Core Models
- **Admin**: System administrators
- **Driver**: Vehicle drivers
- **Aide**: Transportation aides
- **SiteManager**: School site managers
- **Mechanic**: Vehicle maintenance staff
- **Parent**: Student parents
- **Student**: School students
- **Vehicle**: Transportation vehicles
- **Route**: Transportation routes
- **School**: Educational institutions
- **TransportCompany**: Transportation companies

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch
```

## 📦 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure production database
- [ ] Set up SSL certificates
- [ ] Configure production email/SMS services
- [ ] Set up monitoring and logging
- [ ] Configure backup strategies

### Docker Deployment
```bash
# Build image
docker build -t giotap-backend .

# Run container
docker run -p 5000:5000 giotap-backend
```

## 🔍 Monitoring

### Health Check
- `GET /health` - Server health status

### Logging
- Application logs
- Error tracking
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🔄 Changelog

### v1.0.0
- Initial release
- Multi-role authentication
- Vehicle and route management
- Real-time GPS tracking
- Email and SMS notifications

---

**Note**: This is a production-ready backend API for the GioTap school transportation management system. Ensure all environment variables are properly configured before deployment.
