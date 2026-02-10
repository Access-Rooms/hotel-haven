import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CopilotKit } from "@copilotkit/react-core";

createRoot(document.getElementById("root")!).render(<CopilotKit publicApiKey="ck_pub_bcc4a232f17caba933fa7ea7fe524d73"><App /></CopilotKit>);
