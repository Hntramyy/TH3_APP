module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    // React Navigation dùng render-prop (tabBarIcon, headerTitle, headerRight...).
    'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
  },
};
