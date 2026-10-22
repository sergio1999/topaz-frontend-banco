import { Link } from 'expo-router';
import { Text, View } from 'react-native';

import { DEFAULT_ROUTE } from './routes';

export default function NotFound() {
  return (
    <View>
      <Text>Esta ruta no existe</Text>
      <Link href={DEFAULT_ROUTE}>Volver al inicio</Link>
    </View>
  );
}
