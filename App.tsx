import { StatusBar } from 'expo-status-bar';
import './global.css';
import RootNavigator from '~/navigation/RootNavigator';
import { AuthProvider } from '~/context/AuthContext';
import { NetworkProvider } from '~/context/NetworkContext';

export default function App() {
  return (
    <NetworkProvider>
      <AuthProvider>
        <RootNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </NetworkProvider>
  );
}