import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@ant-design/v5-patch-for-react-19";
import { App as AntApp, ConfigProvider } from "antd";
import theme from "./provider/themeProvider";
import "./index.css";
import "./index.less";

createRoot(document.getElementById("root")).render(
  <AntApp>
    <ConfigProvider theme={theme}>
      <App />
    </ConfigProvider>
  </AntApp>
);
