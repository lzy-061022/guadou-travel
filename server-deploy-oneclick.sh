#!/bin/bash
# ============================================
# 瓜豆旅游网站 - 阿里云服务器一键部署脚本
# 在阿里云控制台 Workbench 远程连接中执行
# ============================================

set -e

echo "=========================================="
echo "  瓜豆旅游网站 - 服务器部署脚本"
echo "=========================================="

# 1. 检测系统类型
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
    echo "系统: $PRETTY_NAME"
else
    echo "无法检测系统类型"
    exit 1
fi

# 2. 安装 Nginx 和 Git
echo ""
echo "[1/6] 安装 Nginx 和 Git..."
if [ "$OS" = "centos" ] || [ "$OS" = "rhel" ] || [ "$OS" = "alibaba" ] || [ "$OS" = "aliyun" ]; then
    yum install -y epel-release
    yum install -y nginx git
elif [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
    apt-get update
    apt-get install -y nginx git
else
    echo "不支持的系统: $OS"
    exit 1
fi
echo "✓ Nginx 和 Git 安装完成"

# 3. 启动 Nginx
echo ""
echo "[2/6] 启动 Nginx..."
systemctl start nginx
systemctl enable nginx
echo "✓ Nginx 已启动"

# 4. 清空并准备网站目录
echo ""
echo "[3/6] 准备网站目录..."
WEB_DIR="/usr/share/nginx/html"
rm -rf $WEB_DIR/*
echo "✓ 目录已清空: $WEB_DIR"

# 5. 从 GitHub 拉取最新代码
echo ""
echo "[4/6] 从 GitHub 拉取代码..."
cd /tmp
rm -rf guadou-travel
git clone --depth 1 -b gh-pages https://github.com/lzy-061022/guadou-travel.git
cp -r guadou-travel/* $WEB_DIR/
# 复制隐藏文件（如 .nojekyll）
cp -r guadou-travel/.nojekyll $WEB_DIR/ 2>/dev/null || true
cp -r guadou-travel/.gitattributes $WEB_DIR/ 2>/dev/null || true
rm -rf guadou-travel
echo "✓ 代码已拉取并复制"

# 6. 设置权限
echo ""
echo "[5/6] 设置权限..."
chmod -R 755 $WEB_DIR
chown -R nginx:nginx $WEB_DIR 2>/dev/null || chown -R www-data:www-data $WEB_DIR 2>/dev/null || true
echo "✓ 权限设置完成"

# 7. 配置并重载 Nginx
echo ""
echo "[6/6] 配置 Nginx..."
cat > /etc/nginx/conf.d/guadou.conf << 'NGINXCONF'
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # 图片缓存
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # CSS/JS 缓存
    location ~* \.(css|js)$ {
        expires 7d;
        add_header Cache-Control "public, no-transform";
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 1000;
}
NGINXCONF

# 移除默认冲突配置
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

# 检查并重载
nginx -t && systemctl reload nginx
echo "✓ Nginx 配置完成并已重载"

# 8. 验证
echo ""
echo "=========================================="
echo "  部署完成！"
echo "=========================================="
echo ""
echo "网站目录: $WEB_DIR"
echo "网站文件:"
ls -la $WEB_DIR | head -20
echo ""
echo "Nginx 状态:"
systemctl status nginx | head -5
echo ""
echo "验证 HTTP 响应:"
curl -s -o /dev/null -w "HTTP状态码: %{http_code}\n" http://localhost/
echo ""
echo "=========================================="
echo "  请访问 http://8.217.55.150/ 查看网站"
echo "=========================================="
