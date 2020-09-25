module.exports = {
  apps: [
    {
      script: 'index.js',
      watch: '.'
    }
  ],

  deploy: {
    production: require('./ecosystem.deploy.production')
  }
}
