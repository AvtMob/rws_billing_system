import { Tabs } from 'expo-router';
import { Home, Receipt, Users, BarChart3, Settings } from 'lucide-react-native';
import { StyleSheet, View, Text } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import Colors from '@/constants/Colors';


export default function TabLayout() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray[400],
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bills/index"
        options={{
          title: 'Bills',
          tabBarIcon: ({ color, size }) => (
            <Receipt size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bills/[id]"
        options={{
          href:null,
        }}
      />
      {isAdmin && (
        <Tabs.Screen
          name="residents"
          options={{
            title: 'Residents',
            tabBarIcon: ({ color, size }) => (
              <Users size={size} color={color} />
            ),
          }}
        />
      )}
      {isAdmin && (
        <Tabs.Screen
          name="reports"
          options={{
            title: 'Reports',
            tabBarIcon: ({ color, size }) => (
              <BarChart3 size={size} color={color} />
            ),
          }}
        />
      )}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),0
        }}
      />
    </Tabs>
  );
}


const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
  },
  tabLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
});