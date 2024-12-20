import {
  Alert,
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { useCallback, useMemo, useState } from "react";
import queryString from "query-string";
import WebView from "react-native-webview";

const YT_WIDTH = Dimensions.get("window").width;
const YT_HEIGHT = YT_WIDTH * (9 / 16);

export default function App() {
  const [url, setUrl] = useState("");
  const [youTubeId, setYouTubeId] = useState("");

  const onPressOpenLink = useCallback(() => {
    const {
      query: { v: id },
    } = queryString.parseUrl(url);

    if (typeof id === "string") setYouTubeId(id);
    else Alert.alert("잘못된 URL입니다.");
  }, [url]);

  const source = useMemo(() => {
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body style="margin: 0; padding: 0;">
        <!-- 1. The <iframe> (and video player) will replace this <div> tag. -->
        <div id="player"></div>

        <script>
          // 2. This code loads the IFrame Player API code asynchronously.
          var tag = document.createElement('script');

          tag.src = "https://www.youtube.com/iframe_api";
          var firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

          // 3. This function creates an <iframe> (and YouTube player)
          //    after the API code downloads.
          var player;
          function onYouTubeIframeAPIReady() {
            player = new YT.Player('player', {
              height: '${YT_HEIGHT}',
              width: '${YT_WIDTH}',
              videoId: '${youTubeId}',
              events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
              }
            });
          }

          function postMessageToRN(type, data) {
            const message = JSON.stringify({ type, data });
            window.ReactNativeWebView.postMessage(message);
          }

          function onPlayerReady(event) {
            postMessageToRN('duration', player.getDuration());
          }

          function onPlayerStateChange(event) {
            postMessageToRN('player-state', event.data);
          }
        </script>
      </body>
    </html>
    `;
    return { html };
  }, [youTubeId]);

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.inputContainer}>
        <TextInput
          value={url}
          style={styles.input}
          placeholder="클릭하여 링크를 삽입하세요"
          placeholderTextColor="#aeaeb2"
          onChangeText={setUrl}
          inputMode="url"
        />
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={onPressOpenLink}
        >
          <Icon name="add-link" size={24} color="#aeaeb2" />
        </TouchableOpacity>
      </View>

      <View style={styles.youtubeContainer}>
        {youTubeId.length > 0 && <WebView source={source} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#242424",
  },
  inputContainer: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    fontSize: 15,
    color: "#AEAEB2",
    flex: 1,
    marginRight: 4,
  },
  youtubeContainer: {
    width: YT_WIDTH,
    height: YT_HEIGHT,
    backgroundColor: "#4a4a4a",
  },
});
