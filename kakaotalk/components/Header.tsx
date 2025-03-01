import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

export default function Header() {
  return (
    <View style={styles.headierContainer}>
      <Text style={styles.title}>친구</Text>

      <View style={{ flexDirection: "row" }}>
        <IconButton name="search-outline" />
        <IconButton name="person-add-outline" />
        <IconButton name="musical-note-outline" />
        <IconButton name="settings-outline" />
      </View>
    </View>
  );
}

function IconButton({ name }: { name: IoniconsName }) {
  return (
    <View style={{ paddingHorizontal: 6 }}>
      <Ionicons name={name} size={24} color="black" />
    </View>
  );
}

const styles = StyleSheet.create({
  headierContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
