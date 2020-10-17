# Installation

```shell
npm install --unsafe-perm=true
```

# Usage

```shell
npm start
```

# Development

## Obtain telegram token

Via [@BotFather](https://t.me/botfather)

## Create .env-file

(Don't forget to replace `BOT_TOKEN` to one obtained at previous step)

```shell
echo "NODE_ENV=development
BOT_TOKEN=BOT_TOKEN
DATABASE=sqlite::db.sqlite3
PUPPETEER_HEADLESS=no
ZONE=Europe/Moscow
USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36" > .env
```

## Run

```shell
npm start
```

# Deploy

## Buy a VDS

Buy a VDS (netangels, e.g.) and copy Your public `~/.ssh/id_rsa` into it.

## Install pm2 on local machine

```shell
sudo npm install -g pm2
```

## Install everythong on remote machine

(Don't forget to replace `REMOTE_IP` to real one)

### Install node.js

```shell
ssh root@REMOTE_IP 'apt-get update -y'
ssh root@REMOTE_IP 'apt-get upgrade -y'
ssh root@REMOTE_IP 'curl -sL https://deb.nodesource.com/setup_14.x | bash'
ssh root@REMOTE_IP  'apt-get install nodejs -y'
```

### Install pm2

```shell
ssh root@REMOTE_IP 'npm install -g pm2 -y'
ssh root@REMOTE_IP 'pm2 startup systemd'
```

### Generate key pair and copy to local

```shell
ssh root@REMOTE_IP 'ssh-keygen -b 2048 -t rsa -f /root/.ssh/id_rsa -q -N ""'
scp root@REMOTE_IP:/root/.ssh/id_rsa.pub  remote_rsa.pub
```

Open github [Deploy keys](https://github.com/YChebotaev/re-store-discount-parser/settings/keys) and add `remote_rsa.pub` deploy key.

Then, remove `remote_rsa.pub` from local machine:

```shell
rm remote_rsa.pub
```

### Install libraries needed for chromium

([Actual](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#chrome-headless-doesnt-launch-on-unix) for Ubuntu 18.04 Bionic).

```shell
ssh root@REMOTE_IP 'apt-get install -y ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils'
```

## Create ecosystem for deployment

(Don't forget to replace `SSH_HOSTNAME`, `BOT_TOKEN`, `repo` and `DATABASE` to actual values)

```shell
echo "module.exports = {
  user: 'root',
  host: SSH_HOSTMACHINE,
  ref: 'origin/master',
  repo: 'https://github.com/YChebotaev/re-store-discount-parser.git',
  path: '/var/apps/re-store-discount-parser',
  ssh_options: ['StrictHostKeyChecking=no', 'PasswordAuthentication=no'],
  'pre-setup': 'apt-get install git',
  'pre-deploy-local': '',
  'post-deploy':
    'npm install && touch ecosystem.deploy.production.js && pm2 reload ecosystem.config.js --env production',
  'pre-setup': '',
  env: {
    NODE_ENV: 'production',
    BOT_TOKEN: BOT_TOKEN,
    DATABASE: 'sqlite:db.sqlite3',
    PUPPETEER_HEADLESS: 'yes',
    ZONE: 'Europe/Moscow',
    USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36'
  }
}" > ecosystem.deploy.production.js
```

## Deploy with pm2

### First time:

```shell
pm2 deploy ecosystem.config.js production setup
pm2 deploy ecosystem.config.js production
```

Save pm2 process list

```shell
ssh root@REMOTE_IP 'pm2 save'
```

### Rest of the time:

```shell
pm2 deploy ecosystem.config.js production update
pm2 deploy ecosystem.config.js production
```
