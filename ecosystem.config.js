// PM2 配置文件 - 海马体抽奖项目
// 如果你需要运行后端服务，可以使用此配置

module.exports = {
  apps: [
    {
      name: 'hippocampus-lottery-backend',
      script: 'server.js', // 如果有后端服务器
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: '/var/log/pm2/hippocampus-lottery-error.log',
      out_file: '/var/log/pm2/hippocampus-lottery-out.log',
      log_file: '/var/log/pm2/hippocampus-lottery-combined.log',
      time: true
    }
  ],

  deploy: {
    production: {
      user: 'ubuntu', // 你的服务器用户名
      host: 'your-server-ip', // 你的服务器IP
      ref: 'origin/main',
      repo: 'git@github.com:yourusername/hippocampus-lottery.git', // 你的Git仓库
      path: '/var/www/hippocampus-lottery',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
