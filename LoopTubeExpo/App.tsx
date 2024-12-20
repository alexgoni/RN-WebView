import {
  Alert,
  Animated,
  Dimensions,
  PanResponder,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import queryString from "query-string";
import WebView from "react-native-webview";

const YT_WIDTH = Dimensions.get("window").width;
const YT_HEIGHT = YT_WIDTH * (9 / 16);

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formatedMinutes = String(minutes).padStart(2, "0");
  const formatedSeconds = String(remainingSeconds).padStart(2, "0");

  return formatedMinutes + ":" + formatedSeconds;
};

export default function App() {
  const [url, setUrl] = useState("");
  const [youTubeId, setYouTubeId] = useState("wZwCiqRvbVI");
  const [isPlaying, setIsPlaying] = useState(false);
  const [durationInSec, setDurationInSec] = useState(0);
  const [currentTimeInSec, setCurrentTimeInSec] = useState(0);
  const webViewRef = useRef<WebView | null>(null);
  const seekBarAnimRef = useRef(new Animated.Value(0));
  const durationInSecRef = useRef(durationInSec);
  durationInSecRef.current = durationInSec;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        webViewRef.current?.injectJavaScript("player.pauseVideo();");
      },
      onPanResponderMove: (e, gestureState) => {
        const newTimeInSec =
          (gestureState.moveX / YT_WIDTH) * durationInSecRef.current;
        seekBarAnimRef.current.setValue(newTimeInSec);
      },
      onPanResponderRelease: (e, gestureState) => {
        const newTimeInSec =
          (gestureState.moveX / YT_WIDTH) * durationInSecRef.current;
        webViewRef.current?.injectJavaScript(
          `player.seekTo(${newTimeInSec}, true);`,
        );
        webViewRef.current?.injectJavaScript("player.playVideo();");
      },
    }),
  );

  const onPressOpenLink = useCallback(() => {
    const {
      query: { v: id },
    } = queryString.parseUrl(url);

    if (typeof id === "string") setYouTubeId(id);
    else Alert.alert("잘못된 URL입니다.");
  }, [url]);

  const onPressPlay = useCallback(() => {
    if (!webViewRef.current) return;
    webViewRef.current.injectJavaScript("player.playVideo();");
  }, []);

  const onPressPause = useCallback(() => {
    if (!webViewRef.current) return;
    webViewRef.current.injectJavaScript("player.pauseVideo();");
  }, []);

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

  useEffect(() => {
    if (isPlaying) {
      const id = setInterval(() => {
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(
            "postMessageToRN('current-time', player.getCurrentTime());",
          );
        }
      }, 50);

      return () => {
        clearInterval(id);
      };
    }
  }, [isPlaying]);

  useEffect(() => {
    Animated.timing(seekBarAnimRef.current, {
      toValue: currentTimeInSec,
      duration: 50,
      useNativeDriver: false,
    }).start();
  }, [currentTimeInSec]);

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
        {youTubeId.length > 0 && (
          <WebView
            ref={webViewRef}
            source={source}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            onMessage={(e) => {
              const { type, data } = JSON.parse(e.nativeEvent.data);
              if (type === "player-state") setIsPlaying(data === 1);
              if (type === "duration") setDurationInSec(data);
              if (type === "current-time") setCurrentTimeInSec(data);
            }}
          />
        )}
      </View>
      <View
        style={styles.seekBarBackground}
        {...panResponder.current.panHandlers}
      >
        <Animated.View
          style={[
            styles.seekBarProgress,
            {
              width: seekBarAnimRef.current.interpolate({
                inputRange: [0, durationInSec],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
        <Animated.View
          hitSlop={{ top: 100, bottom: 100, left: 100, right: 100 }}
          style={[
            styles.seekBarThumb,
            {
              left: seekBarAnimRef.current.interpolate({
                inputRange: [0, durationInSec],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>

      <Text style={styles.timeText}>
        {formatTime(Math.floor(currentTimeInSec))} /{" "}
        {formatTime(Math.floor(durationInSec))}
      </Text>
      <View style={styles.controller}>
        {!isPlaying ? (
          <TouchableOpacity style={styles.playButton} onPress={onPressPlay}>
            <Icon name="play-circle" size={40} color="#00dda8" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.playButton} onPress={onPressPause}>
            <Icon name="pause-circle" size={40} color="#e5e5ea" />
          </TouchableOpacity>
        )}
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
  controller: {
    backgroundColor: "#1a1a1a",
    flexDirection: "row",
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    color: "#aeaeb2",
    alignSelf: "flex-end",
    fontSize: 13,
    marginTop: 15,
    marginRight: 20,
  },
  seekBarBackground: {
    height: 3,
    backgroundColor: "#d4d4d4",
    pointerEvents: "box-none",
  },
  seekBarProgress: {
    height: 3,
    width: "0%",
    backgroundColor: "#00dda8",
    pointerEvents: "none",
  },
  seekBarThumb: {
    width: 14,
    height: 14,
    backgroundColor: "#00dda8",
    borderRadius: "50%",
    position: "absolute",
    top: (-14 + 3) / 2,
    left: 0,
  },
});
