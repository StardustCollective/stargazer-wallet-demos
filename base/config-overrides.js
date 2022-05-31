const path = require('path');
const {
  override,
  addWebpackModuleRule,
  addWebpackAlias,
  addWebpackResolve
} = require('customize-cra');

module.exports = override(
  addWebpackModuleRule({
    test: /\.scss$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: true
        }
      },
      'sass-loader'
    ]
  }),
  addWebpackModuleRule({
    test: /\.text\..+$/,
    type: 'asset/source'
  }),
  addWebpackAlias({'@': path.resolve(__dirname)})
);
