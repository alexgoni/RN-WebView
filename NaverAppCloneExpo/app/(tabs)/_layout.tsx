import { Tabs } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: "black" },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "홈",
          tabBarIcon: HomeIcon,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="shopping"
        options={{
          tabBarLabel: "쇼핑",
          tabBarIcon: ShoppingIcon,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

function HomeIcon({ focused, color }: { focused: boolean; color: string }) {
  const iconName = focused ? "home" : "home-outline";

  return <MaterialCommunityIcons name={iconName} color={color} size={26} />;
}

function ShoppingIcon({ focused, color }: { focused: boolean; color: string }) {
  const iconName = focused ? "shopping" : "shopping-outline";

  return <MaterialCommunityIcons name={iconName} color={color} size={26} />;
}
