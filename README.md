完整部署流程
1. 后端部署
```bash
# 进入后端目录
cd server
# 安装依赖
npm install
# 启动服务（开发模式）
MONGODB_URI=mongodb://localhost:27017/bookdb PORT=3000 node server.js
# 生产环境使用 PM2
pm2 start server.js --name "book-api" --env MONGODB_URI=mongodb://your-mongo-uri
```
2. 前端部署
```bash
# 进入前端目录
cd client
# 安装依赖
npm install
# 开发模式运行
npm start
# 生产构建
npm run build
# 使用 Nginx 部署生产版本
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        root /path/to/client/build;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```
