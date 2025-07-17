
# Ubuntu VPS Deployment Guide

## Prerequisites
- Ubuntu 20.04+ VPS
- Domain name pointed to your VPS IP
- Root or sudo access

## 1. Server Setup

### Update system
```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js (via NodeSource)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### Install Nginx
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Install SSL (Certbot)
```bash
sudo apt install certbot python3-certbot-nginx -y
```

## 2. Deploy Backend

### Create app directory
```bash
sudo mkdir -p /var/www/investment-platform
sudo chown $USER:$USER /var/www/investment-platform
cd /var/www/investment-platform
```

### Clone or upload your code
```bash
# Option 1: If using Git
git clone <your-repo-url> .

# Option 2: Upload files via SCP
# scp -r ./backend user@your-server-ip:/var/www/investment-platform/
```

### Install backend dependencies
```bash
cd backend
npm install
```

### Create production environment file
```bash
cp .env.example .env
nano .env
```

Edit the .env file:
```env
PORT=5000
JWT_SECRET=your-super-secret-production-jwt-key-make-this-very-long-and-random
DATABASE_PATH=/var/www/investment-platform/backend/database.sqlite
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

### Build and start backend
```bash
npm run build
pm2 start dist/server.js --name "investment-backend"
pm2 save
pm2 startup
```

## 3. Deploy Frontend

### Build frontend
```bash
cd ../frontend  # or wherever your frontend is
npm install
npm run build
```

### Copy build files to nginx directory
```bash
sudo cp -r dist/* /var/www/html/
```

## 4. Configure Nginx

### Create Nginx configuration
```bash
sudo nano /etc/nginx/sites-available/investment-platform
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Enable the site
```bash
sudo ln -s /etc/nginx/sites-available/investment-platform /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

## 5. Setup SSL Certificate

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 6. Setup Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

## 7. Database Management

### Create backup script
```bash
sudo nano /usr/local/bin/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp /var/www/investment-platform/backend/database.sqlite /var/backups/database_$DATE.sqlite
find /var/backups -name "database_*.sqlite" -mtime +7 -delete
```

```bash
sudo chmod +x /usr/local/bin/backup-db.sh
sudo mkdir -p /var/backups
```

### Setup daily backup cron
```bash
sudo crontab -e
```

Add:
```bash
0 2 * * * /usr/local/bin/backup-db.sh
```

## 8. Monitoring and Logs

### View backend logs
```bash
pm2 logs investment-backend
```

### View nginx logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Monitor PM2 processes
```bash
pm2 status
pm2 monit
```

## 9. Updates and Maintenance

### Update application
```bash
cd /var/www/investment-platform
git pull  # if using git
cd backend
npm install
npm run build
pm2 restart investment-backend

# Update frontend
cd ../frontend
npm install
npm run build
sudo cp -r dist/* /var/www/html/
```

## 10. Security Considerations

### Install fail2ban
```bash
sudo apt install fail2ban -y
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

### Regular security updates
```bash
sudo apt update && sudo apt upgrade -y
```

### Database permissions
```bash
sudo chown www-data:www-data /var/www/investment-platform/backend/database.sqlite
sudo chmod 640 /var/www/investment-platform/backend/database.sqlite
```

## Troubleshooting

### Check if services are running
```bash
sudo systemctl status nginx
pm2 status
```

### Check ports
```bash
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :5000
```

### Restart services
```bash
sudo systemctl restart nginx
pm2 restart investment-backend
```

## Your application should now be accessible at https://yourdomain.com
