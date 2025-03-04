# Boilerplate Project

A full-stack TypeScript application with React frontend and Node.js backend.

## 🚀 Features

- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express and TypeScript
- **Authentication**: User authentication system
- **Error Handling**: Global error handling middleware
- **Type Safety**: Full TypeScript support across the stack

## 📁 Project Structure

```
boilerplate/
├── client/              # React frontend
│   └── src/
│       └── App.tsx
└── server/              # Node.js backend
    ├── controllers/     # Request handlers
    ├── middleware/      # Custom middleware
    ├── models/          # Database models
    └── routes/          # API routes
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd boilerplate
```

2. Install dependencies:

For backend:
```bash
cd server
npm install
```

For frontend:
```bash
cd client
npm install
```

3. Set up environment variables:
   - Create `.env` file in the server directory
   - Add necessary environment variables

### Running the Application

#### Backend
```bash
cd server
npm run dev
```

#### Frontend
```bash
cd client
npm start
```

## 🔒 Environment Variables

Create a `.env` file in the server directory with the following variables:
```
PORT=5000
NODE_ENV=development
# Add other environment variables
```

## 📝 API Documentation

The backend API includes the following endpoints:

- User Routes (`/api/users`):
  - User authentication endpoints
  - User management endpoints

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License.
