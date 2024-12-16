import { router } from "expo-router";
import { SafeAreaView, StyleSheet } from "react-native";
import WebView from "react-native-webview";
import { useWebViewContext } from "../components/WebViewProvider";

const LOGIN_URL = "https://nid.naver.com/nidlogin.login";

export default function LoginScreen() {
  const { webViewRefs } = useWebViewContext();

  return (
    <SafeAreaView style={styles.safearea}>
      <WebView
        source={{ uri: LOGIN_URL }}
        onNavigationStateChange={(e) => {
          if (e.url === "https://m.naver.com/") {
            webViewRefs.current.forEach((webView) => {
              webView.reload();
            });
            router.back();
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
  },
});
