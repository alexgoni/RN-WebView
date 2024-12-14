import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function ShoppingScreen() {
  return (
    <View>
      <Text>Shopping</Text>
      <TouchableOpacity
        onPress={() => {
          router.navigate({ pathname: "browser" });
        }}>
        <Text>Go to Browser</Text>
      </TouchableOpacity>
    </View>
  );
}
