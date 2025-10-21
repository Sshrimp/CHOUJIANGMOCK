#!/bin/bash

# 海马体抽奖项目更新脚本
# 用于快速更新已部署的项目

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 项目配置
PROJECT_NAME="hippocampus-lottery"
PROJECT_DIR="/var/www/$PROJECT_NAME"

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

# 检查是否在项目目录
check_project_dir() {
    if [ ! -f "package.json" ]; then
        print_error "未找到package.json文件，请在项目根目录运行此脚本"
        exit 1
    fi
}

# 备份当前版本
backup_current() {
    if [ -d "$PROJECT_DIR" ]; then
        print_message "备份当前版本..."
        sudo cp -r $PROJECT_DIR ${PROJECT_DIR}_backup_$(date +%Y%m%d_%H%M%S)
        print_message "备份完成"
    fi
}

# 拉取最新代码
pull_latest() {
    print_message "拉取最新代码..."
    
    if [ -d ".git" ]; then
        git pull origin main
        print_message "代码更新完成"
    else
        print_warning "不是Git仓库，跳过代码拉取"
    fi
}

# 安装依赖
install_dependencies() {
    print_message "检查并安装依赖..."
    
    # 检查package-lock.json是否有变化
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    print_message "依赖安装完成"
}

# 构建项目
build_project() {
    print_message "构建项目..."
    
    # 清理之前的构建
    if [ -d "build" ]; then
        rm -rf build
    fi
    
    # 构建生产版本
    npm run build
    
    print_message "项目构建完成"
}

# 部署到生产环境
deploy_to_production() {
    print_message "部署到生产环境..."
    
    # 检查构建目录
    if [ ! -d "build" ]; then
        print_error "构建目录不存在，请先运行构建"
        exit 1
    fi
    
    # 复制文件到生产目录
    sudo cp -r build/* $PROJECT_DIR/
    
    # 设置权限
    sudo chown -R www-data:www-data $PROJECT_DIR
    sudo chmod -R 755 $PROJECT_DIR
    
    print_message "部署完成"
}

# 重启服务
restart_services() {
    print_message "重启相关服务..."
    
    # 测试Nginx配置
    sudo nginx -t
    
    # 重新加载Nginx
    sudo systemctl reload nginx
    
    print_message "服务重启完成"
}

# 验证部署
verify_deployment() {
    print_message "验证部署..."
    
    # 检查Nginx状态
    if systemctl is-active --quiet nginx; then
        print_message "✅ Nginx运行正常"
    else
        print_error "❌ Nginx未运行"
        exit 1
    fi
    
    # 检查项目文件
    if [ -f "$PROJECT_DIR/index.html" ]; then
        print_message "✅ 项目文件部署成功"
    else
        print_error "❌ 项目文件部署失败"
        exit 1
    fi
    
    print_message "✅ 部署验证通过"
}

# 清理旧备份（保留最近5个）
cleanup_old_backups() {
    print_message "清理旧备份..."
    
    # 查找并删除7天前的备份
    find /var/www/ -name "${PROJECT_NAME}_backup_*" -type d -mtime +7 -exec sudo rm -rf {} + 2>/dev/null || true
    
    print_message "旧备份清理完成"
}

# 显示部署信息
show_deployment_info() {
    print_message "🎉 更新部署完成！"
    print_message ""
    print_message "项目信息："
    print_message "  - 项目名称: $PROJECT_NAME"
    print_message "  - 部署路径: $PROJECT_DIR"
    print_message "  - 访问地址: http://$(curl -s ifconfig.me 2>/dev/null || echo 'your-server-ip')"
    print_message ""
    print_message "常用命令："
    print_message "  - 查看Nginx状态: sudo systemctl status nginx"
    print_message "  - 查看Nginx日志: sudo tail -f /var/log/nginx/error.log"
    print_message "  - 重启Nginx: sudo systemctl restart nginx"
}

# 主函数
main() {
    print_message "🚀 开始更新海马体抽奖项目..."
    
    check_project_dir
    backup_current
    pull_latest
    install_dependencies
    build_project
    deploy_to_production
    restart_services
    verify_deployment
    cleanup_old_backups
    show_deployment_info
}

# 错误处理
trap 'print_error "更新过程中发生错误，请检查日志"; exit 1' ERR

# 运行主函数
main "$@"
