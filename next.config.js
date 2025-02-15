/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: false,
  productionBrowserSourceMaps: process.env.NODE_ENV === 'production',
  compiler: {
    styledComponents: true,
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
};
