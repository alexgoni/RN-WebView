import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useCallback, useState } from "react";
import { router } from "expo-router";

export default function LoginButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const onPress = useCallback(() => {
    if (!isLoggedIn) router.push({ pathname: "login" });
  }, []);

  return (
    <TouchableOpacity onPress={onPress}>
      <MaterialCommunityIcons
        name={isLoggedIn ? "logout" : "login"}
        color="white"
        size={24}
      />
    </TouchableOpacity>
  );
}
