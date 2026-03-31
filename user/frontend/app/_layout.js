import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(booking)" />
    <Stack.Screen 
        name="report" 
        options={{ 
          presentation: 'modal', // Makes it feel like a sub-page
          animation: 'slide_from_right' 
        }} 
      />
    </Stack>
  );
}