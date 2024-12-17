import { useCallback } from "react";
import { useWebViewContext } from "../components/WebViewProvider";
import { WebViewMessageEvent } from "react-native-webview";

export default function useLogin() {
  const { webViewRefs, setIsLoggedIn, isLoggedIn } = useWebViewContext();

  const loadLoggedIn = useCallback(() => {
    webViewRefs.current.forEach((webView) => {
      webView.injectJavaScript(`
        (function() {
          window.ReactNativeWebView.postMessage(document.cookie);
        })();
      `);
    });
  }, []);

  const onMessage = useCallback((e: WebViewMessageEvent) => {
    const cookieString = e.nativeEvent.data;
    setIsLoggedIn(cookieString.includes("NID_SES"));
  }, []);

  const logout = useCallback(() => {
    webViewRefs.current.forEach((webView) => {
      webView.injectJavaScript(`
        (function() {
          document.cookie = 'NID_SES=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.naver.com';
          window.ReactNativeWebView.postMessage(document.cookie);
        })();      
      `);
    });

    setIsLoggedIn(false);

    if (webViewRefs) {
      webViewRefs.current.forEach((webView) => {
        webView.reload();
      });
    }
  }, []);

  return { loadLoggedIn, onMessage, isLoggedIn, logout };
}
