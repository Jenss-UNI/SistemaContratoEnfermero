import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./app/App.tsx";
import "react-day-picker/dist/style.css";

createRoot(document.getElementById("root")!).render(<App />);
