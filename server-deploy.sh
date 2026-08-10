#!/bin/bash
# 瓜豆旅游网站 - 服务器一键部署脚本
# 在Ubuntu服务器上执行：bash <(curl -sL https://raw.githubusercontent.com/lzy-061022/guadou-travel/main/server-deploy.sh)
# 或者直接复制此脚本内容到服务器执行

set -e
echo "========================================="
echo "  瓜豆旅游网站 - 服务器部署"
echo "========================================="

# 1. 安装依赖
echo "[1/4] 安装 Nginx 和 Git..."
apt-get update -y
apt-get install -y nginx git

# 2. 从GitHub拉取网站文件
echo "[2/4] 从GitHub拉取网站文件..."
rm -rf /tmp/guadou-travel
git clone --depth 1 -b gh-pages https://github.com/lzy-061022/guadou-travel.git /tmp/guadou-travel

# 3. 部署到Nginx目录
echo "[3/4] 部署网站文件..."
rm -rf /var/www/guadou-travel
mkdir -p /var/www/guadou-travel
cp -r /tmp/guadou-travel/*.html /tmp/guadou-travel/*.js /tmp/guadou-travel/*.jpg /var/www/guadou-travel/ 2>/dev/null || true
cp -r /tmp/guadou-travel/images /var/www/guadou-travel/
rm -rf /tmp/guadou-travel

# 4. 配置Nginx
echo "[4/4] 配置Nginx..."
cat > /etc/nginx/sites-available/guadou-travel << 'NGINX'
server {
    listen 80;
    server_name _;
    root /var/www/guadou-travel;
    index index.html;

    gzip on;
    gzip_types text/html text/css application/javascript image/svg+xml application/json;
    gzip_min_length 256;

    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    location ~* \.(css|js)$ {
        expires 7d;
        add_header Cache-Control "public";
    }
    location / {
        try_files $uri $uri/ $uri.html =404;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/guadou-travel /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable nginx
systemctl reload nginx

echo ""
echo "========================================="
echo "  部署完成！"
echo "  访问: http://8.217.55.150"
echo "========================================="
