import { Tabs } from 'expo-router';
import { Search, Settings, History, Bookmark } from 'lucide-react-native';
import { useColorScheme, View, Image, TouchableOpacity, Linking } from 'react-native';
import { BottomTabBar } from '@react-navigation/bottom-tabs';

const logo = require('../../assets/images/logotext_poweredby_360w.png');

const CustomTabBar = (props) => {
  const colorScheme = useColorScheme();
  return (
    <View
      style={{
        backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
        borderTopColor: colorScheme === 'dark' ? '#333333' : '#e5e5e5',
        borderTopWidth: 1,
      }}
    >
      <BottomTabBar {...props} />
      <View style={{ paddingBottom: 25, paddingTop: 10 }}>
        <TouchableOpacity onPress={() => Linking.openURL('https://bolt.new/')}>
          <Image
            source={logo}
            style={{
              width: 180,
              height: 25,
              resizeMode: 'contain',
              alignSelf: 'center',
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const tabBarStyle = {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    paddingBottom: 8,
    paddingTop: 8,
    height: 70,
    elevation: 0,
  };

  const tabBarActiveTintColor = colorScheme === 'dark' ? '#60a5fa' : '#3b82f6';
  const tabBarInactiveTintColor = colorScheme === 'dark' ? '#9ca3af' : '#6b7280';

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor,
        tabBarInactiveTintColor,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Search',
          tabBarIcon: ({ size, color }) => (
            <Search size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ size, color }) => (
            <History size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ size, color }) => (
            <Bookmark size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}
