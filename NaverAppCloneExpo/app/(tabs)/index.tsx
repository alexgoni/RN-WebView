import { router } from "expo-router";
import { SafeAreaView, StyleSheet } from "react-native";
import WebView from "react-native-webview";
import { useWebViewContext } from "../../components/WebViewProvider";
import useLogin from "../../hooks/useLogin";

export default function HomeScreen() {
  const { addWebView } = useWebViewContext();
  const { loadLoggedIn, onMessage } = useLogin();

  return (
    <SafeAreaView style={styles.safearea}>
      <WebView
        ref={(ref) => {
          if (!ref) return;
          addWebView(ref);
        }}
        source={{ uri: "https://m.naver.com/" }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onShouldStartLoadWithRequest={(request) => {
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
        onLoadEnd={() => {
          loadLoggedIn();
        }}
        onMessage={onMessage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
  },
});
