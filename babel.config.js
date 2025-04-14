module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // 'react-native-reanimated/plugin',
    ['react-native-reanimated/plugin', { disableInlineStylesWarning: true }],
    ['module:react-native-dotenv', {
      'moduleName': '@env', // Alias for importing environment variables
      'path': '.env', // Path to your .env file
      'safe': true, // Ensures all required env variables are defined
      'allowUndefined': false,
    }]
  ],

};
