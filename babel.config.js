module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./api'],
          alias: {
            '@api': './api',
          },
        },
      ],
      // 'react-native-reanimated/plugin', 
    ],
  };
};