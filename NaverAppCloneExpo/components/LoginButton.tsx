import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useCallback, useEffect, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import useLogin from "../hooks/useLogin";

export default function LoginButton() {
  const { isLoggedIn, loadLoggedIn, logout } = useLogin();

  const onPress = useCallback(() => {
    if (!isLoggedIn) router.push({ pathname: "login" });
    else logout();
  }, [isLoggedIn, logout]);

  const [isFocused, setIsFocused] = useState(false);
  useFocusEffect(() => {
    setIsFocused(true);

    return () => {
      setIsFocused(false);
    };
  });

  useEffect(() => {
    if (isFocused) loadLoggedIn();
  }, [isFocused, loadLoggedIn]);

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
