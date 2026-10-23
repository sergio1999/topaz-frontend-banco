jest.mock('@expo/vector-icons/MaterialCommunityIcons', () => {
  const { Text } = require('react-native');
  return {
    __esModule: true,
    default: function MockIcon() {
      return <Text />;
    },
  };
});
