const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Los tests viven junto al código (dentro de src/app); Metro no debe empaquetarlos como rutas.
config.resolver.blockList = [...(config.resolver.blockList ?? []), /.*\/__tests__\/.*/];

module.exports = config;
