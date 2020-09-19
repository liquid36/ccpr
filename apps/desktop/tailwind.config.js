module.exports = {
    future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
    },
    purge: {
        enabled: false,
        content: ['./**/*.tsx']
    },
    theme: {
        extend: {},
        screens: {
            'sm': '640px', 
            'md': '768px', 
            'lg': '1024px',
            'xl': '1367px', 
        }
    },
    variants: {},
    plugins: [],
};
