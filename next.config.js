export default {
  basePath: '/crawler',
  compress: true,
  poweredByHeader: false,
  distDir: 'dist',
  styledComponents: true,
  generateBuildId: async () => {
    // You can, for example, get the latest git commit hash here
    return 'my-build-id'
  },
  trailingSlash: false,
}