# Render.com Deployment Guide for Campus Connect

This guide explains how to deploy your Campus Connect application to Render.com.

## Prerequisites

1. Git repository hosted on GitHub, GitLab, or Bitbucket
2. Render.com account
3. MongoDB database (MongoDB Atlas recommended for production)

## Deployment Options

### Option 1: Deploy using Blueprint (Recommended)

1. Commit and push all changes to your repository
2. Log into your Render.com dashboard
3. Click "New" → "Blueprint"
4. Connect your repository
5. Render will automatically detect the `render.yaml` file and deploy both services

### Option 2: Deploy Individual Services

#### Deploy Backend (API)

1. In Render dashboard, click "New" → "Web Service"
2. Connect your repository
3. Configure:
   - **Name**: campus-connect-api
   - **Runtime**: Python 3
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app`
   - **Instance Type**: Free tier or Starter ($7/month)

#### Deploy Frontend

1. In Render dashboard, click "New" → "Static Site"
2. Connect your repository
3. Configure:
   - **Name**: campus-connect-ui
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Instance Type**: Free tier

## Environment Variables

### Backend Environment Variables
Set these in your backend service settings:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret_key
JWT_ALGORITHM=HS256
HOST=0.0.0.0
PORT=10000
```

### Frontend Environment Variables
Set these in your frontend service settings:

```
VITE_API_URL=https://your-backend-service-name.onrender.com
```

## Database Setup

### Option 1: MongoDB Atlas (Recommended)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist Render's IP addresses (or allow all IPs for simplicity)
5. Get the connection string and set it as `MONGODB_URI`

### Option 2: Render PostgreSQL
If you want to migrate to PostgreSQL:
1. Create a PostgreSQL database in Render
2. Update your backend code to use PostgreSQL instead of MongoDB

## Post-Deployment Steps

1. **Update CORS settings**: Make sure your backend allows requests from your frontend domain
2. **Test the application**: Verify all features work in production
3. **Set up custom domains**: Configure custom domains if needed
4. **Monitor logs**: Check service logs for any issues

## Troubleshooting

### Common Issues:

1. **Build failures**: Check the build logs and ensure all dependencies are listed correctly
2. **Environment variables**: Make sure all required environment variables are set
3. **Database connection**: Verify MongoDB connection string is correct
4. **CORS errors**: Update CORS settings in your FastAPI backend

### Useful Commands for Local Testing:

```bash
# Test backend locally
cd backend
python run.py

# Test frontend build
npm run build
npx serve -s dist

# Test full app
npm run dev:full
```

## Cost Estimates

- **Free Tier**: Both services can run on free tier with limitations (sleeps after inactivity)
- **Paid Tier**: $7/month per service for always-on hosting
- **Database**: MongoDB Atlas free tier (512MB) or paid plans starting at $9/month

## Next Steps

1. Set up monitoring and alerts
2. Configure automatic deployments from your Git repository
3. Set up proper logging and error tracking
4. Consider implementing a CDN for static assets