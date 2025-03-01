import Header from "@/components/Header";
import Profile from "@/components/Profile";
import { StyleSheet, View } from "react-native";
import Margin from "@/components/Margin";
import Division from "@/components/Division";
import FriendSection from "@/components/FriendSection";
import { myProfile } from "../assets/data.js";
import TabBar from "@/components/TabBar";

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, paddingHorizontal: 15 }}>
        <Header />
        <Margin height={10} />
        <Profile
          image={myProfile.uri}
          name={myProfile.name}
          introduction={myProfile.introduction}
        />
        <Margin height={15} />
        <Division />
        <Margin height={12} />
        <FriendSection />
      </View>

      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
