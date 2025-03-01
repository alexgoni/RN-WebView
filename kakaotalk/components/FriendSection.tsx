import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { friendProfiles } from "../assets/data.js";
import Profile from "./Profile";
import Margin from "./Margin";
import { useState } from "react";

export default function FriendSection() {
  const [isOpened, setIsOpened] = useState(true);

  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ color: "grey" }}>친구 {friendProfiles.length}</Text>
        <TouchableOpacity
          onPress={() => {
            setIsOpened((prev) => !prev);
          }}
        >
          {isOpened ? (
            <MaterialIcons
              name="keyboard-arrow-up"
              size={24}
              color="lightgrey"
            />
          ) : (
            <MaterialIcons
              name="keyboard-arrow-down"
              size={24}
              color="lightgrey"
            />
          )}
        </TouchableOpacity>
      </View>

      {isOpened && (
        <ScrollView>
          {friendProfiles.map((friendProfile, idx) => (
            <View key={idx}>
              <Profile
                image={friendProfile.uri}
                name={friendProfile.name}
                introduction={friendProfile.introduction}
              />
              <Margin height={13} />
            </View>
          ))}
        </ScrollView>
      )}
    </>
  );
}
