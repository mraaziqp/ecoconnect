# Nexus Hub - Deployment & Operations Guide

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Production build succeeds
- [ ] Environment variables configured
- [ ] API keys secured
- [ ] Database backups recent
- [ ] Monitoring alerts configured
- [ ] Rollback plan documented

## Local Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start dev server (with hot reload)
npm run dev

# Visit http://localhost:3000
```

## Production Build

```bash
# Build frontend + backend
npm run build

# Creates dist/ folder with:
# - Vite-optimized frontend (React)
# - Compiled server (Node.js)

# Test production build locally
node dist/server.cjs  # Runs on port 3000
```

## Docker Deployment

### Build Image
```bash
docker build -t nexus-hub:latest .
```

### Run Container
```bash
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=${GEMINI_API_KEY} \
  -e NODE_ENV=production \
  --name nexus-hub \
  --restart unless-stopped \
  nexus-hub:latest
```

### Using Docker Compose
```bash
# Set environment variables
export GEMINI_API_KEY=your_key_here
export APP_URL=https://yourdomain.com

# Start services
docker-compose up -d

# View logs
docker-compose logs -f nexus-hub

# Stop services
docker-compose down
```

## Cloud Deployment (AWS/GCP/Azure)

### Google Cloud Run
```bash
# Authenticate
gcloud auth login

# Build and push to Container Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT/nexus-hub

# Deploy
gcloud run deploy nexus-hub \
  --image gcr.io/YOUR_PROJECT/nexus-hub \
  --platform managed \
  --region us-central1 \
  --memory 512Mi \
  --set-env-vars="GEMINI_API_KEY=${GEMINI_API_KEY},APP_URL=https://nexus-hub.your-domain.com" \
  --allow-unauthenticated
```

### AWS ECS/Fargate
```bash
# Push to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

docker tag nexus-hub:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/nexus-hub:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/nexus-hub:latest

# Deploy via AWS Console or CDK
```

## Environment Variables

### Required
```
GEMINI_API_KEY=     # Your Google Gemini API key
NODE_ENV=production # Set to production for deployments
```

### Optional
```
APP_URL=https://nexus-hub.your-domain.com
PORT=3000                                       # Default port
```

### From .env.production
```
VITE_API_BASE=https://api.nexus-hub.app
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CRASH_REPORTING=true
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_SECURE_COOKIES=true
VITE_SECURE_HEADERS=true
```

## Database Setup (Future)

```bash
# When adding persistent storage
docker-compose up -d postgres  # Uncomment in docker-compose.yml
```

## Monitoring & Observability

### Health Check Endpoint
```bash
curl http://localhost:3000/health
# Expected: 200 OK
```

### Logs
```bash
# Docker logs
docker logs nexus-hub -f --tail 100

# Docker Compose
docker-compose logs -f nexus-hub
```

### Performance Monitoring
```bash
# Check container stats
docker stats nexus-hub

# Expected:
# CPU: < 10%
# Memory: < 200MB
# Network: Varies
```

## Rollback Procedure

```bash
# If deployment fails, rollback to previous version
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=${GEMINI_API_KEY} \
  nexus-hub:previous

# Or with Docker Compose
docker-compose down
git checkout previous-commit
docker-compose up -d
```

## SSL/TLS Setup

### Using nginx as reverse proxy
```nginx
server {
    listen 443 ssl http2;
    server_name nexus-hub.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/nexus-hub.your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nexus-hub.your-domain.com/privkey.pem;

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

### Using Let's Encrypt
```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d nexus-hub.your-domain.com

# Auto-renew
sudo systemctl enable certbot.timer
```

## Performance Optimization

### Caching Headers
Set in reverse proxy:
```nginx
# Static assets (1 year)
location ~ \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# HTML (1 hour)
location ~ \.html$ {
    expires 1h;
    add_header Cache-Control "public, must-revalidate";
}
```

### CDN Setup
Use Cloudflare or similar:
1. Point domain DNS to CDN
2. Configure origin: `nexus-hub.your-domain.com`
3. Enable caching for static assets
4. Enable DDoS protection

## Scaling Considerations

### Horizontal Scaling
```bash
# Run multiple instances behind load balancer
docker run -p 3001:3000 nexus-hub:latest
docker run -p 3002:3000 nexus-hub:latest
docker run -p 3003:3000 nexus-hub:latest

# Configure load balancer (nginx, HAProxy, etc.)
```

### Rate Limiting
```bash
# In nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=100r/s;

location /api/ {
    limit_req zone=api burst=200 nodelay;
    proxy_pass http://backend;
}
```

## Backup & Recovery

```bash
# Backup container
docker commit nexus-hub nexus-hub:backup-$(date +%Y%m%d)

# Backup volumes (when added)
docker run --rm -v nexus-hub-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/nexus-hub-data.tar.gz -C /data .

# Restore from backup
docker run --rm -v nexus-hub-data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/nexus-hub-data.tar.gz -C /data
```

## Incident Response

### App Crashes
```bash
# Check logs
docker logs nexus-hub

# Restart container
docker restart nexus-hub

# If persistent, rollback
# (See Rollback Procedure above)
```

### High Memory Usage
```bash
# Check memory
docker stats nexus-hub

# Increase container memory limit
docker run --memory 1g nexus-hub:latest

# Investigate memory leaks in app
# See TESTING.md - Memory Leaks section
```

### Performance Degradation
```bash
# Check system resources
docker stats nexus-hub

# Check network latency
curl -w '@curl-format.txt' http://localhost:3000

# Monitor real-time metrics
docker stats --no-stream
```

## Maintenance Windows

Schedule weekly:
- [ ] Review logs for errors
- [ ] Check performance metrics
- [ ] Update dependencies: `npm audit fix`
- [ ] Test disaster recovery procedures
- [ ] Review monitoring dashboards

Schedule monthly:
- [ ] Security scan
- [ ] Dependency updates
- [ ] Database optimization
- [ ] Backup verification

Schedule quarterly:
- [ ] Full security audit
- [ ] Load testing
- [ ] Capacity planning
- [ ] Documentation update

## Success Metrics

**Application Health**
- Uptime: > 99.9%
- Response time: < 200ms (p95)
- Error rate: < 0.1%

**User Experience**
- Page load (TTI): < 2s
- Core Web Vitals: All green
- User satisfaction: > 4.5/5

**System Performance**
- CPU utilization: 10-30%
- Memory usage: < 300MB
- Disk I/O: < 10% utilization

## Support & Troubleshooting

See [TESTING.md](./TESTING.md) for comprehensive testing guide.

For issues:
1. Check logs: `docker logs nexus-hub`
2. Verify environment variables
3. Test health endpoint
4. Review recent changes
5. Consult rollback procedures
