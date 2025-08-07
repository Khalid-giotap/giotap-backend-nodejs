# GIOTAP Backend Node.js

Smart School Transportation MVP API built with Node.js, Express.js, TypeScript, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (for database)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd giotap-backend-nodejs

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration
```

### Development
```bash
# Start development server with hot reload
npm run dev

# Or use nodemon
npm run dev:watch
```

### Production
```bash
# Build the project
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
giotap-backend-nodejs/
├── app.ts              # Main application entry point
├── dist/               # Compiled JavaScript files
├── node_modules/       # Dependencies
├── package.json        # Project configuration
├── tsconfig.json       # TypeScript configuration
├── nodemon.json        # Nodemon configuration
└── README.md          # This file
```

## 🔧 Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Start development server with ts-node-dev
- `npm run dev:watch` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (to be implemented)

## 🛠️ TypeScript Configuration

The project uses TypeScript with the following key configurations:

- **Target**: ES2020
- **Module**: CommonJS
- **Strict Mode**: Enabled
- **Source Maps**: Enabled
- **Declaration Files**: Generated

## 📝 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/giotap

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🎯 API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check endpoint

## 🔍 How to Create a TypeScript Node.js Project from Scratch

### Step 1: Initialize Project
```bash
mkdir my-typescript-project
cd my-typescript-project
npm init -y
```

### Step 2: Install TypeScript Dependencies
```bash
npm install --save-dev typescript @types/node ts-node ts-node-dev nodemon
npm install express cors dotenv
npm install --save-dev @types/express @types/cors
```

### Step 3: Create TypeScript Configuration
Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "./",
    "outDir": "dist",
    "strict": true,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "sourceMap": true
  },
  "include": ["**/*.ts"],
  "exclude": ["dist", "node_modules", "**/*.test.ts"]
}
```

### Step 4: Update package.json Scripts
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/app.js",
    "dev": "ts-node-dev --respawn --transpile-only app.ts",
    "dev:watch": "nodemon --exec ts-node app.ts"
  }
}
```

### Step 5: Create Nodemon Configuration
Create `nodemon.json`:
```json
{
  "watch": ["**/*.ts"],
  "exec": "ts-node app.ts",
  "ext": "ts,json",
  "ignore": ["dist", "node_modules"]
}
```

### Step 6: Create Your First TypeScript File
Create `app.ts`:
```typescript
import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello TypeScript!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

## 🐛 Common Issues and Solutions

### TypeScript Compilation Errors
- Ensure all dependencies have proper `@types` packages installed
- Check `tsconfig.json` configuration
- Verify import/export syntax

### Module Resolution Issues
- Make sure `moduleResolution` is set to "node" in `tsconfig.json`
- Use proper import paths
- Check if `esModuleInterop` is enabled

### Development Server Issues
- Ensure `ts-node` is installed
- Check if `ts-node-dev` is properly configured
- Verify file paths in scripts

## 📚 Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.
