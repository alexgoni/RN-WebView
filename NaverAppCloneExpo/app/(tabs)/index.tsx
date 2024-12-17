import { router } from "expo-router";
import { SafeAreaView, StyleSheet } from "react-native";
import WebView from "react-native-webview";
import { useWebViewContext } from "../../components/WebViewProvider";
import useLogin from "../../hooks/useLogin";
import { useBackHandler } from "@react-native-community/hooks";
import { useRef, useState } from "react";

export default function HomeScreen() {
  const { addWebView } = useWebViewContext();
  const { loadLoggedIn, onMessage } = useLogin();
  const webViewRef = useRef<WebView | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useBackHandler(() => {
    if (webViewRef.current && canGoBack) {
      webViewRef.current?.goBack();
      return true;
    }

    return false;
  });

  return (
    <SafeAreaView style={styles.safearea}>
      <WebView
        ref={(ref) => {
          if (!ref) return;
          addWebView(ref);
          webViewRef.current = ref;
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
        onNavigationStateChange={(e) => {
          setCanGoBack(e.canGoBack);
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
