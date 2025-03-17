import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css'

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);

if (import.meta.env.PROD) {
  window.oncontextmenu = e => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
}