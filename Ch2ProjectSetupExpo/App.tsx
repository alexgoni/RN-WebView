import { WebView } from "react-native-webview";

const App = () => {
  return <WebView source={{ uri: "https://fastcampus.co.kr/" }} />;
};

export default App;

// import { WebView } from "react-native-webview";

// const App = () => {
//   return (
//     <WebView
//       originWhitelist={["*"]}
//       source={{ html: `<h1>Hello World</h1>` }}
//     />
//   );
// };

// export default App;
