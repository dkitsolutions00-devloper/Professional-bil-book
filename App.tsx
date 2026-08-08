import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { initDatabase } from './src/database/db';
import { Dashboard } from './src/screens/Dashboard';
import { Invoices } from './src/screens/Invoices';
import { CreateInvoice } from './src/screens/CreateInvoice';
import { Customers } from './src/screens/Customers';
import { Products } from './src/screens/Products';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  const { isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';
          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Invoices') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Customers') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Products') {
            iconName = focused ? 'cube' : 'cube-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#7b2ffc',
        tabBarInactiveTintColor: isDark ? '#94a3b8' : '#94a3b8',
        tabBarStyle: {
          backgroundColor: isDark ? '#0f0e17' : '#ffffff',
          borderTopColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Invoices" component={Invoices} />
      <Tab.Screen name="Customers" component={Customers} />
      <Tab.Screen name="Products" component={Products} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="CreateInvoice" component={CreateInvoice} />
    </Stack.Navigator>
  );
}

function AppContent() {
  const { isDark } = useTheme();

  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
        }
