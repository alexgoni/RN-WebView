import { Fontisto, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

export default function TabBar() {
  const [selectedTabIdx, setSelectedTabIdx] = useState(0);

  return (
    <View
      style={{
        width: "100%",
        height: 50,
        flexDirection: "row",
        borderTopWidth: 0.5,
        borderTopColor: "grey",
      }}
    >
      <TouchableOpacity
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Fontisto
          name={selectedTabIdx === 0 ? "person" : "persons"}
          onPress={() => setSelectedTabIdx(0)}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Ionicons
          name={selectedTabIdx === 1 ? "chatbubble" : "chatbubble-outline"}
          onPress={() => setSelectedTabIdx(1)}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Ionicons
          name={selectedTabIdx === 2 ? "pricetag" : "pricetag-outline"}
          onPress={() => setSelectedTabIdx(2)}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Ionicons
          name={selectedTabIdx === 3 ? "add-circle" : "add-circle-outline"}
          onPress={() => setSelectedTabIdx(3)}
        />
      </TouchableOpacity>
    </View>
  );
}
