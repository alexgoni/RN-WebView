import {
  createContext,
  MutableRefObject,
  ReactNode,
  useCallback,
  useContext,
  useRef,
} from "react";
import WebView from "react-native-webview";

interface WebViewContextType {
  webViewRefs: MutableRefObject<WebView[]>;
  addWebView: (webView: WebView) => void;
}

const WebViewContext = createContext<WebViewContextType | null>(null);

export function WebViewProvider({ children }: { children: ReactNode }) {
  const webViewRefs = useRef<WebView[]>([]);
  const addWebView = useCallback((webView: WebView) => {
    webViewRefs.current.push(webView);
  }, []);

  return (
    <WebViewContext.Provider value={{ webViewRefs, addWebView }}>
      {children}
    </WebViewContext.Provider>
  );
}

export function useWebViewContext() {
  const context = useContext(WebViewContext);

  if (!context) {
    throw new Error("WebView 컨텍스트를 호출할 수 없는 범위입니다.");
  }

  return context;
}
