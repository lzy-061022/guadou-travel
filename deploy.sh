#!/bin/bash
# ========================================
# 瓜豆旅游网站 - 一键部署脚本
# 适用于 Ubuntu 服务器
# ========================================

set -e

echo "========================================="
echo "  瓜豆旅游网站 一键部署脚本"
echo "========================================="

# 1. 更新系统并安装 Nginx
echo ""
echo "[1/5] 安装 Nginx..."
apt-get update -y
apt-get install -y nginx

# 2. 启动 Nginx 并设置开机自启
echo ""
echo "[2/5] 启动 Nginx..."
systemctl start nginx
systemctl enable nginx

# 3. 创建网站目录
echo ""
echo "[3/5] 创建网站目录..."
rm -rf /var/www/guadou-travel
mkdir -p /var/www/guadou-travel

# 4. 配置 Nginx
echo ""
echo "[4/5] 配置 Nginx..."
cat > /etc/nginx/sites-available/guadou-travel << 'NGINX_CONF'
server {
    listen 80;
    server_name _;

    root /var/www/guadou-travel;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/html text/css application/javascript image/svg+xml;
    gzip_min_length 256;

    # 缓存静态资源
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
NGINX_CONF

# 启用站点配置
ln -sf /etc/nginx/sites-available/guadou-travel /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 测试配置
nginx -t

# 重载 Nginx
systemctl reload nginx

# 5. 配置防火墙
echo ""
echo "[5/5] 配置防火墙..."
if command -v ufw &> /dev/null; then
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 22/tcp
    echo "UFW 防火墙规则已添加"
else
    echo "UFW 未安装，跳过防火墙配置"
fi

echo ""
echo "========================================="
echo "  Nginx 安装配置完成！"
echo "========================================="
echo ""
echo "下一步：请将网站文件上传到服务器"
echo "  在你的本地电脑执行以下命令："
echo ""
echo "  scp -r ./index.html ./doudou.html ./dianyue.html ./coffee.html ./batiaoban.html ./i18n.js ./logo.jpg root@8.217.55.150:/var/www/guadou-travel/"
echo "  scp -r ./images/ root@8.217.55.150:/var/www/guadou-travel/"
echo ""
echo "上传完成后访问: http://8.217.55.150"
echo "========================================="
