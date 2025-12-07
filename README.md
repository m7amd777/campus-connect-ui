# Campus Connect

A full-stack web application for campus marketplace built with React (Vite) frontend and FastAPI backend with MongoDB database.

## Prerequisites

Before running the application, make sure you have the following installed:

- **Node.js** (v16 or higher) and **npm**
- **Python** (v3.8 or higher)
- **MongoDB Community Server** (v5.0 or higher)
- **Git**

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd campus-connect-ui
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On macOS/Linux
pip install -r requirements.txt
```

### 3. Database Setup

#### Start MongoDB

1. **Install MongoDB Community Server** from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

2. **Start MongoDB Service:**

   **Windows:**
   - Start MongoDB as a service (usually starts automatically after installation)
   - Or manually start: `net start MongoDB`

   **macOS/Linux:**
   ```bash
   # Using Homebrew (macOS)
   brew services start mongodb-community
   
   # Or manually
   mongod --dbpath /usr/local/var/mongodb
   ```

3. **Verify MongoDB is Running:**
   ```bash
   mongosh
   # Should connect to MongoDB shell
   # Type 'exit' to leave the shell
   ```

#### Database Configuration

The application uses the following default MongoDB settings:
- **URL:** `mongodb://localhost:27017`
- **Database Name:** `campusConnect`

The database and collections will be created automatically when the backend starts.

### 4. Environment Configuration

#### Backend Environment
Create a `.env` file in the `backend` directory (optional, as defaults are provided):

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=campusConnect
HOST=0.0.0.0
PORT=8000
```

## Running the Application

### Method 1: Run Everything Together (Recommended)

From the root directory:
```bash
npm run dev:full
```

This will start both frontend and backend simultaneously.

### Method 2: Run Components Separately

#### Start the Backend
```bash
cd backend
python run.py
```
The backend will be available at:
- **API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

#### Start the Frontend
In a new terminal, from the root directory:
```bash
npm run dev
```
The frontend will be available at: http://localhost:8080

### Method 3: Using Batch File (Windows Only)

For the backend, you can also use:
```bash
cd backend
start.bat
```

## Adding Sample Data

Once the backend is running and connected to MongoDB, you can populate the database with sample data:

```bash
# From the root directory
python add_sample_data.py
```

This script will add:
- Sample user accounts
- Sample product listings
- Sample categories
- Test data for development

**Note:** Make sure MongoDB is running and the backend has been started at least once before running the sample data script.

## Database Collections

The application automatically creates the following MongoDB collections:

- **users** - User accounts and profiles
- **products** - Marketplace listings (also referenced as listings in the code)
- **categories** - Product categories
- **chats** - Chat conversations
- **messages** - Individual chat messages
- **reports** - User reports
- **ratings** - User ratings and reviews

## Development Scripts

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend Scripts
- `python run.py` - Start development server with auto-reload
- `start.bat` - Windows batch file to setup and start backend

### Combined Scripts
- `npm run dev:full` - Start both frontend and backend
- `npm run setup` - Install all dependencies (frontend + backend)

## Project Structure

```
campus-connect-ui/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Application pages
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and API
│   └── contexts/          # React contexts
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── models/        # Pydantic models
│   │   ├── routers/       # API route handlers
│   │   ├── schemas/       # Request/response schemas
│   │   └── database.py    # Database connection
│   ├── requirements.txt   # Python dependencies
│   └── run.py            # Development server
├── public/               # Static assets
├── add_sample_data.py   # Sample data script
└── package.json         # Node.js dependencies
```

## API Documentation

When the backend is running, you can access:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## Features

### Frontend (React + TypeScript)
- **Modern UI**: Built with React 18, TypeScript, and Tailwind CSS
- **Component Library**: shadcn/ui components for consistent design
- **State Management**: TanStack Query for server state management
- **Responsive Design**: Mobile-first responsive design
- **Authentication**: JWT-based authentication with protected routes

### Backend (FastAPI + MongoDB)
- **Fast API**: High-performance Python web framework
- **MongoDB**: NoSQL database with Motor async driver
- **Authentication**: JWT tokens with bcrypt password hashing
- **Real-time Chat**: Chat system for buyer-seller communication
- **Content Moderation**: Reporting system for inappropriate content
- **File Upload**: Image upload support for product listings

### Core Functionality
- **User Management**: Registration, login, profile management with university ID verification
- **Product Listings**: Create, read, update, delete product listings with images
- **Search & Filter**: Advanced search with category and price filtering
- **Chat System**: Real-time messaging between buyers and sellers
- **Reporting**: Report inappropriate content or users
- **Featured Products**: Homepage with featured and trending items
- **Categories**: Organized product categories for easy browsing

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB service is running
   - Check if port 27017 is available
   - Verify MongoDB installation

2. **Port Already in Use**
   - Frontend (8080): Change port in `vite.config.ts`
   - Backend (8000): Change port in `.env` file or `run.py`

3. **Python Virtual Environment Issues**
   - Make sure virtual environment is activated
   - Reinstall dependencies: `pip install -r requirements.txt`

4. **Node.js Dependencies Issues**
   - Delete `node_modules` and run `npm install` again
   - Clear npm cache: `npm cache clean --force`

### Database Reset

To reset the database:
1. Connect to MongoDB shell: `mongosh`
2. Drop the database: `use campusConnect` then `db.dropDatabase()`
3. Restart the backend to recreate collections
4. Run sample data script again if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Add your license information here]
