import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useWebViewContext } from "../components/WebViewProvider";

export default function BrowserScreen() {
  const params = useLocalSearchParams();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [url, setUrl] = useState(params.initialUrl as string);
  const urlTitle = useMemo(
    () => url.replace("https://", "").split("/")[0],
    [url],
  );
  const webViewRef = useRef<WebView | null>(null);
  const { addWebView } = useWebViewContext();

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.urlContainer}>
        <Text style={styles.urlText}>{urlTitle}</Text>
      </View>
      <View style={styles.loadingBarBackground}>
        <Animated.View
          style={[
            styles.loadingBar,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
      <WebView
        ref={(ref) => {
          if (!ref) return;
          webViewRef.current = ref;
          addWebView(ref);
        }}
        source={{ uri: params.initialUrl as string }}
        onNavigationStateChange={(e) => {
          setUrl(e.url);
          setCanGoBack(e.canGoBack);
          setCanGoForward(e.canGoForward);
        }}
        onLoadProgress={(e) => {
          progressAnim.setValue(e.nativeEvent.progress);
        }}
        onLoadEnd={() => {
          progressAnim.setValue(0);
        }}
      />
      <View style={styles.navigator}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.back();
          }}>
          <View style={styles.naverIconOutline}>
            <Text style={styles.naverIconText}>N</Text>
          </View>
        </TouchableOpacity>
        <NavButton
          iconName="arrow-left"
          disabled={!canGoBack}
          onPress={() => {
            webViewRef.current?.goBack();
          }}
        />
        <NavButton
          iconName="arrow-right"
          disabled={!canGoForward}
          onPress={() => {
            webViewRef.current?.goForward();
          }}
        />
        <NavButton
          iconName="refresh"
          onPress={() => {
            webViewRef.current?.reload();
          }}
        />
        <NavButton
          iconName="share-outline"
          onPress={() => {
            Share.share({ message: url });
          }}
        />
      </View>
    </SafeAreaView>
  );
}

interface NavButtonProps {
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  disabled?: boolean;
  onPress?: () => void;
}

function NavButton({ iconName, disabled, onPress }: NavButtonProps) {
  const color = disabled ? "gray" : "white";

  return (
    <TouchableOpacity
      style={styles.button}
      disabled={disabled}
      onPress={onPress}>
      <MaterialCommunityIcons name={iconName} color={color} size={24} />
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  safearea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    backgroundColor: "black",
  },
  urlContainer: {
    backgroundColor: "black",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
  },
  urlText: { color: "gray" },
  loadingBarBackground: {
    height: 3,
    backgroundColor: "white",
  },
  loadingBar: {
    height: "100%",
    backgroundColor: "green",
  },
  navigator: {
    backgroundColor: "black",
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 40,
    justifyContent: "space-between",
  },
  button: {
    width: 30,
    height: 30,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  naverIconOutline: {
    borderColor: "white",
    borderWidth: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  naverIconText: {
    color: "white",
  },
});
