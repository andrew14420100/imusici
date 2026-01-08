import React from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

function RootLayoutNav() {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    if (!isInitialized || isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && inAuthGroup) {
      // L'utente non è autenticato ma sta cercando di accedere alle tabs
      // Redirect alla pagina di login SOLO se non ci siamo già
      router.replace('/');
    } else if (isAuthenticated && !inAuthGroup && segments[0] !== '(tabs)') {
      // L'utente è autenticato ma è sulla pagina di login
      // Questo caso è gestito dal login stesso
    }
  }, [isAuthenticated, segments, isInitialized, isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <RootLayoutNav />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
