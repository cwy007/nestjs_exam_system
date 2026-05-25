module.exports = function (options) {
  return {
    ...options,
    resolve: {
      ...options.resolve,
      extensionAlias: {
        ...(options.resolve && options.resolve.extensionAlias),
        '.js': ['.ts', '.js'],
        '.mjs': ['.mts', '.mjs'],
        '.cjs': ['.cts', '.cjs'],
      },
    },
  };
};