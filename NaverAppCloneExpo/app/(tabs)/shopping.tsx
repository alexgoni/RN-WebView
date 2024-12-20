import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";
import WebView from "react-native-webview";
import { useWebViewContext } from "../../components/WebViewProvider";
import React from "react";

const SHOPPING_HOME_URL = "https://shopping.naver.com/";

export default function ShoppingScreen() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const webViewRef = useRef<WebView | null>(null);
  const { addWebView } = useWebViewContext();

  const onRefresh = useCallback(() => {
    if (!webViewRef.current) return;
    setIsRefreshing(true);
    webViewRef.current.reload();
  }, []);

  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }>
        <WebView
          ref={(ref) => {
            if (!ref) return;
            webViewRef.current = ref;
            addWebView(ref);
          }}
          source={{ uri: SHOPPING_HOME_URL }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          onShouldStartLoadWithRequest={(request) => {
            if (
              request.url.startsWith(SHOPPING_HOME_URL) ||
              request.mainDocumentURL?.startsWith(SHOPPING_HOME_URL)
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
            setIsRefreshing(false);
          }}
          renderLoading={() => <></>}
          startInLoadingState={true}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
  },
});
