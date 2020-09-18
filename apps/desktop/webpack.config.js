const getConfig = require('@nrwl/react/plugins/webpack');
module.exports = (config) => {
    config = getConfig(config);
    config.module.rules.push({
        test: /\.css$/,
        loader: 'postcss-loader',
        options: {
            postcssOptions: {
                ident: 'postcss',
                plugins: [
                    require('tailwindcss')('./apps/desktop/tailwind.config.js'),
                    'autoprefixer'
                ],
            }
        }
    });
    return config;
};