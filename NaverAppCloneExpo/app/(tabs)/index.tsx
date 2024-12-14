import { router } from "expo-router";
import { Platform, SafeAreaView, StyleSheet, StatusBar } from "react-native";
import WebView from "react-native-webview";

const styles = StyleSheet.create({
  safearea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
  },
});

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safearea}>
      <WebView
        source={{ uri: "https://m.naver.com/" }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onShouldStartLoadWithRequest={request => {
          if (
            request.url.startsWith("https://m.naver.com/") ||
            request.mainDocumentURL?.startsWith("https://m.naver.com/")
          ) {
            return true;
          }

          if (request.url !== null && request.url.startsWith("https://")) {
            router.navigate({
              pathname: "browser",
              params: { initialUrl: request.url },
            });
            return false;
          }

          return true;
        }}
      />
    </SafeAreaView>
  );
}
