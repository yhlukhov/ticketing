module.exports = {
  webpack: (config) => {
    config.watchOptions.poll = 500
    return config
  }
}