import { Stack } from 'expo-router';
import { AuthProvider } from '../auth/AuthContext';

const linking = {
  prefixes: ['exp://192.168.195.57:8081', 'biznest://'],
  config: {
    screens: {
      ProductDetails: 'product/:product_id',
      Home: 'home',
      ViewShop: 'shop/:seller_id',
    },
  },
};

export default function Layout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{ headerShown: false }}
        linking={linking}
      />
    </AuthProvider>
  );
}
