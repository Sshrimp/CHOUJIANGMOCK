# 海马体抽奖项目部署指南

## 项目概述
这是一个基于React的抽奖轮盘项目，包含轮播图和抽奖功能。项目使用Create React App构建，适合部署到Ubuntu服务器。

## 部署方式

### 方式一：自动化部署（推荐）

#### 1. 准备工作
```bash
# 连接到你的腾讯云服务器
ssh ubuntu@your-server-ip

# 更新系统
sudo apt update && sudo apt upgrade -y
```

#### 2. 上传项目文件
将项目文件上传到服务器，可以使用以下方式之一：

**方式A：使用Git（推荐）**
```bash
# 在服务器上克隆项目
git clone https://github.com/yourusername/hippocampus-lottery.git
cd hippocampus-lottery
```

**方式B：使用SCP上传**
```bash
# 在本地执行，将项目打包上传
tar -czf hippocampus-lottery.tar.gz .
scp hippocampus-lottery.tar.gz ubuntu@your-server-ip:~/

# 在服务器上解压
ssh ubuntu@your-server-ip
tar -xzf hippocampus-lottery.tar.gz
```

**方式C：使用SFTP工具**
使用FileZilla、WinSCP等工具上传项目文件夹

#### 3. 运行部署脚本
```bash
# 给部署脚本执行权限
chmod +x deploy.sh

# 运行部署脚本
sudo ./deploy.sh
```

#### 4. 访问项目
部署完成后，在浏览器中访问：`http://your-server-ip`

### 方式二：手动部署

#### 1. 安装Node.js和npm
```bash
# 安装Node.js 18.x LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version
npm --version
```

#### 2. 安装Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 3. 构建项目
```bash
# 在项目目录中
npm install
npm run build
```

#### 4. 部署到Nginx
```bash
# 创建项目目录
sudo mkdir -p /var/www/hippocampus-lottery

# 复制构建文件
sudo cp -r build/* /var/www/hippocampus-lottery/

# 设置权限
sudo chown -R www-data:www-data /var/www/hippocampus-lottery
sudo chmod -R 755 /var/www/hippocampus-lottery
```

#### 5. 配置Nginx
```bash
# 复制Nginx配置文件
sudo cp nginx.conf /etc/nginx/sites-available/hippocampus-lottery

# 启用站点
sudo ln -s /etc/nginx/sites-available/hippocampus-lottery /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重新加载Nginx
sudo systemctl reload nginx
```

#### 6. 配置防火墙
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
```

## 域名配置（可选）

### 1. 域名解析
在你的域名提供商处，添加A记录指向你的服务器IP：
```
类型: A
主机记录: @
记录值: your-server-ip
TTL: 600
```

### 2. 修改Nginx配置
编辑 `/etc/nginx/sites-available/hippocampus-lottery`，将 `server_name` 改为你的域名：
```nginx
server_name your-domain.com www.your-domain.com;
```

### 3. 重新加载Nginx
```bash
sudo systemctl reload nginx
```

## SSL证书配置（推荐）

### 使用Let's Encrypt免费SSL证书
```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx

# 获取SSL证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 设置自动续期
sudo crontab -e
# 添加以下行：
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## 项目更新

### 自动更新脚本
创建更新脚本 `update.sh`：
```bash
#!/bin/bash
echo "更新海马体抽奖项目..."

# 拉取最新代码
git pull origin main

# 安装依赖
npm install

# 构建项目
npm run build

# 复制文件
sudo cp -r build/* /var/www/hippocampus-lottery/

# 设置权限
sudo chown -R www-data:www-data /var/www/hippocampus-lottery

echo "更新完成！"
```

### 使用方法
```bash
chmod +x update.sh
./update.sh
```

## 监控和日志

### 查看Nginx日志
```bash
# 访问日志
sudo tail -f /var/log/nginx/hippocampus-lottery.access.log

# 错误日志
sudo tail -f /var/log/nginx/hippocampus-lottery.error.log

# 实时监控
sudo tail -f /var/log/nginx/error.log
```

### 系统状态检查
```bash
# 检查Nginx状态
sudo systemctl status nginx

# 检查磁盘空间
df -h

# 检查内存使用
free -h

# 检查CPU使用
top
```

## 常见问题解决

### 1. 403 Forbidden错误
```bash
# 检查文件权限
sudo chown -R www-data:www-data /var/www/hippocampus-lottery
sudo chmod -R 755 /var/www/hippocampus-lottery
```

### 2. 502 Bad Gateway错误
```bash
# 检查Nginx配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

### 3. 页面刷新404错误
确保Nginx配置中有以下配置：
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 4. 静态资源加载失败
检查文件路径和权限：
```bash
ls -la /var/www/hippocampus-lottery/
```

## 性能优化

### 1. 启用Gzip压缩
已在Nginx配置中启用，可以减少传输大小。

### 2. 设置缓存策略
静态资源设置了1年缓存，提高加载速度。

### 3. CDN加速（可选）
可以使用腾讯云CDN或其他CDN服务加速静态资源。

## 安全建议

### 1. 定期更新系统
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. 配置防火墙
```bash
sudo ufw enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
```

### 3. 定期备份
```bash
# 备份项目文件
tar -czf backup-$(date +%Y%m%d).tar.gz /var/www/hippocampus-lottery

# 备份Nginx配置
cp /etc/nginx/sites-available/hippocampus-lottery ~/nginx-backup-$(date +%Y%m%d).conf
```

## 联系支持
如果在部署过程中遇到问题，请检查：
1. 服务器系统版本和配置
2. 网络连接和防火墙设置
3. 域名解析配置
4. SSL证书配置

## 项目结构
```
hippocampus-lottery/
├── public/                 # 静态资源
├── src/                   # 源代码
│   ├── components/        # React组件
│   │   ├── Carousel.tsx   # 轮播组件
│   │   └── LotteryWheel.tsx # 抽奖轮盘组件
│   └── App.tsx           # 主应用组件
├── build/                # 构建输出（部署后生成）
├── deploy.sh            # 自动部署脚本
├── nginx.conf           # Nginx配置文件
├── ecosystem.config.js  # PM2配置文件
└── DEPLOYMENT.md        # 部署文档
```
