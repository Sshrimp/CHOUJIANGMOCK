#!/bin/bash

# 海马体抽奖项目部署脚本
# 适用于Ubuntu服务器

set -e

echo "🚀 开始部署海马体抽奖项目..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 项目配置
PROJECT_NAME="hippocampus-lottery"
PROJECT_DIR="/var/www/$PROJECT_NAME"
NGINX_CONFIG="/etc/nginx/sites-available/$PROJECT_NAME"
NGINX_ENABLED="/etc/nginx/sites-enabled/$PROJECT_NAME"

# 函数：打印彩色消息
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查是否为root用户
check_root() {
    if [ "$EUID" -ne 0 ]; then
        print_error "请使用sudo运行此脚本"
        exit 1
    fi
}

# 更新系统
update_system() {
    print_message "更新系统包..."
    apt update && apt upgrade -y
}

# 安装Node.js和npm
install_nodejs() {
    print_message "安装Node.js和npm..."
    
    # 检查是否已安装Node.js
    if command -v node &> /dev/null; then
        print_warning "Node.js已安装，版本: $(node --version)"
    else
        # 安装Node.js 18.x LTS
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        apt-get install -y nodejs
    fi
    
    print_message "Node.js版本: $(node --version)"
    print_message "npm版本: $(npm --version)"
}

# 安装Nginx
install_nginx() {
    print_message "安装Nginx..."
    
    if command -v nginx &> /dev/null; then
        print_warning "Nginx已安装"
    else
        apt install -y nginx
    fi
    
    systemctl start nginx
    systemctl enable nginx
    print_message "Nginx已启动并设置为开机自启"
}

# 安装PM2（可选，用于进程管理）
install_pm2() {
    print_message "安装PM2..."
    
    if command -v pm2 &> /dev/null; then
        print_warning "PM2已安装"
    else
        npm install -g pm2
    fi
}

# 创建项目目录
create_project_dir() {
    print_message "创建项目目录..."
    mkdir -p $PROJECT_DIR
    chown -R www-data:www-data $PROJECT_DIR
}

# 构建项目
build_project() {
    print_message "构建React项目..."
    
    # 假设项目代码已经上传到服务器
    if [ ! -f "package.json" ]; then
        print_error "未找到package.json文件，请确保在项目根目录运行此脚本"
        exit 1
    fi
    
    # 安装依赖
    print_message "安装项目依赖..."
    npm install
    
    # 构建生产版本
    print_message "构建生产版本..."
    npm run build
    
    # 复制构建文件到项目目录
    print_message "复制构建文件..."
    cp -r build/* $PROJECT_DIR/
    
    # 设置权限
    chown -R www-data:www-data $PROJECT_DIR
    chmod -R 755 $PROJECT_DIR
}

# 配置Nginx
configure_nginx() {
    print_message "配置Nginx..."
    
    # 创建Nginx配置文件
    cat > $NGINX_CONFIG << EOF
server {
    listen 80;
    server_name localhost;  # 替换为你的域名或服务器IP
    
    root $PROJECT_DIR;
    index index.html index.htm;
    
    # 启用gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
    
    # 处理React Router的路由
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOF
    
    # 启用站点
    ln -sf $NGINX_CONFIG $NGINX_ENABLED
    
    # 测试Nginx配置
    nginx -t
    
    # 重新加载Nginx
    systemctl reload nginx
    
    print_message "Nginx配置完成"
}

# 配置防火墙
configure_firewall() {
    print_message "配置防火墙..."
    
    if command -v ufw &> /dev/null; then
        ufw allow 'Nginx Full'
        ufw allow ssh
        print_message "防火墙规则已添加"
    else
        print_warning "未找到ufw，请手动配置防火墙"
    fi
}

# 主函数
main() {
    print_message "开始部署海马体抽奖项目..."
    
    check_root
    update_system
    install_nodejs
    install_nginx
    install_pm2
    create_project_dir
    build_project
    configure_nginx
    configure_firewall
    
    print_message "🎉 部署完成！"
    print_message "项目已部署到: $PROJECT_DIR"
    print_message "可以通过浏览器访问: http://你的服务器IP"
    print_message ""
    print_message "常用命令："
    print_message "  - 重启Nginx: sudo systemctl restart nginx"
    print_message "  - 查看Nginx状态: sudo systemctl status nginx"
    print_message "  - 查看Nginx日志: sudo tail -f /var/log/nginx/error.log"
}

# 运行主函数
main "$@"
