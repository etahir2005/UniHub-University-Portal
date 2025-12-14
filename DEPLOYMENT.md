# UniHub Deployment Guide

## Prerequisites

Before deploying UniHub, ensure you have:

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- Git installed
- Vercel account (for Vercel deployment) OR server with Node.js support

---

## Local Development Setup

### 1. Install Dependencies

```bash
cd exo-perseverance
npm install
```

### 2. Configure Environment Variables

Create `.env.local` file:

```env
MONGODB_URI=mongodb://localhost:27017/unihub
JWT_SECRET=generate-a-random-secret-key-here
NEXT_PUBLIC_API_URL=http://localhost:3000
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./public/uploads
```

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Create Upload Directories

```bash
mkdir -p public/uploads/lectures
mkdir -p public/uploads/assignments
mkdir -p public/uploads/submissions
mkdir -p public/uploads/resources
```

### 4. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas** (recommended for production)

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## Production Deployment

### Option 1: Deploy to Vercel (Recommended)

#### Step 1: Prepare MongoDB Atlas

1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier available)
3. Create database user with password
4. Whitelist IP addresses (0.0.0.0/0 for Vercel)
5. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/unihub?retryWrites=true&w=majority
   ```

#### Step 2: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - UniHub"
git branch -M main
git remote add origin https://github.com/yourusername/unihub.git
git push -u origin main
```

#### Step 3: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-generated-secret
   NEXT_PUBLIC_API_URL=https://your-app.vercel.app
   MAX_FILE_SIZE=10485760
   UPLOAD_DIR=./public/uploads
   ```

6. Click "Deploy"

#### Step 4: Configure Domain (Optional)

- Add custom domain in Vercel dashboard
- Update `NEXT_PUBLIC_API_URL` to your custom domain

---

### Option 2: Deploy to VPS/Server

#### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2 for process management
sudo npm install -g pm2
```

#### Step 2: Deploy Application

```bash
# Clone repository
git clone https://github.com/yourusername/unihub.git
cd unihub

# Install dependencies
npm install

# Create .env.local
nano .env.local
# Add your environment variables

# Create upload directories
mkdir -p public/uploads/{lectures,assignments,submissions,resources}

# Build application
npm run build

# Start with PM2
pm2 start npm --name "unihub" -- start
pm2 save
pm2 startup
```

#### Step 3: Configure Nginx (Optional)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/unihub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 4: SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Database Backup Setup

### Automated Daily Backups

#### On Linux/Mac (Cron):

```bash
# Edit crontab
crontab -e

# Add this line (runs daily at 2 AM)
0 2 * * * cd /path/to/unihub && node scripts/backup.js >> /var/log/unihub-backup.log 2>&1
```

#### On Windows (Task Scheduler):

1. Open Task Scheduler
2. Create Basic Task
3. Set trigger: Daily at 2:00 AM
4. Action: Start a program
5. Program: `node`
6. Arguments: `C:\path\to\unihub\scripts\backup.js`

### Manual Backup

```bash
# Create backup
mongodump --uri="mongodb://localhost:27017/unihub" --out="./backup-$(date +%Y%m%d)"

# Restore from backup
mongorestore --uri="mongodb://localhost:27017/unihub" --drop ./backup-20240101/unihub
```

---

## File Storage Options

### Option 1: Local Storage (Default)

Files stored in `public/uploads/`

**Pros:** Simple, no external dependencies
**Cons:** Not scalable for multiple servers

### Option 2: AWS S3

1. Create S3 bucket
2. Install AWS SDK: `npm install aws-sdk`
3. Update `src/app/api/uploads/route.ts` to use S3
4. Add environment variables:
   ```env
   AWS_ACCESS_KEY_ID=your-key
   AWS_SECRET_ACCESS_KEY=your-secret
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=unihub-uploads
   ```

### Option 3: Cloudinary

1. Create Cloudinary account
2. Install SDK: `npm install cloudinary`
3. Update upload route
4. Add environment variables:
   ```env
   CLOUDINARY_CLOUD_NAME=your-cloud
   CLOUDINARY_API_KEY=your-key
   CLOUDINARY_API_SECRET=your-secret
   ```

---

## Monitoring & Maintenance

### Health Checks

Create `/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    return NextResponse.json({ status: 'unhealthy', error: error.message }, { status: 500 });
  }
}
```

### Logging

Use PM2 logs:
```bash
pm2 logs unihub
```

### Performance Monitoring

- Use Vercel Analytics (if on Vercel)
- Set up Sentry for error tracking
- Monitor MongoDB with MongoDB Atlas monitoring

---

## Security Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Use HTTPS in production
- [ ] Enable MongoDB authentication
- [ ] Whitelist IP addresses in MongoDB Atlas
- [ ] Implement rate limiting
- [ ] Validate all file uploads
- [ ] Set up CORS properly
- [ ] Regular security updates: `npm audit fix`
- [ ] Backup database daily
- [ ] Use environment variables for secrets

---

## Scaling Considerations

### Horizontal Scaling

- Use MongoDB Atlas for managed database
- Deploy to multiple Vercel regions
- Use CDN for static assets
- Implement Redis for session management

### Vertical Scaling

- Increase server resources
- Optimize database queries
- Add database indexes
- Implement caching

---

## Troubleshooting

### Build Fails

```bash
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues

- Check MongoDB is running
- Verify connection string
- Check network/firewall settings
- Whitelist IP in MongoDB Atlas

### File Upload Issues

- Check directory permissions
- Verify MAX_FILE_SIZE setting
- Check disk space

---

## Support

For deployment issues:
1. Check logs: `pm2 logs` or Vercel deployment logs
2. Review environment variables
3. Test database connection
4. Check file permissions

---

**Deployment Complete! 🎉**

Your UniHub instance should now be running in production.
