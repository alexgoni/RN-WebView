import { Image, Text, View } from "react-native";

export default function Profile({
  image,
  name,
  introduction,
}: {
  image: string;
  name: string;
  introduction: string;
}) {
  return (
    <View style={{ flexDirection: "row" }}>
      <Image
        source={{ uri: image }}
        style={{ width: 50, height: 50, borderRadius: 20 }}
      />
      <View style={{ justifyContent: "center", gap: 6, marginLeft: 10 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{name}</Text>
        <Text style={{ fontSize: 12, color: "gray" }}>{introduction}</Text>
      </View>
    </View>
  );
}
