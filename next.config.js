module.exports = {
  basePath: '/crawler',
  compress: true,
  poweredByHeader: false,
  distDir: 'build',
  generateBuildId: async () => {
    // You can, for example, get the latest git commit hash here
    return 'my-build-id'
  },
  trailingSlash: false,
}