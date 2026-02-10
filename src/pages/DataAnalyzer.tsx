import { useState } from "react";
import { CopilotTextarea } from '@copilotkit/react-textarea';
import "@copilotkit/react-textarea/styles.css";
import { CopilotKit } from "@copilotkit/react-core";
import { GeneratedUI } from "@/models/GeneratedUI";
import { GeneratedDashboard } from "@/components/home/GeneratedDashboard";

export default function DataAnalyzer() {
  const [uiSchema, setUiSchema] = useState<GeneratedUI[]>([]);
  const [textValue, setTextValue] = useState("");
  const [rawData, setRawData] = useState<any[]>([]);

  const SYSTEM_PROMPT = `You are a Data UI Architect.
Analyze the provided data and return a JSON array of components.
Each item in the array MUST follow this exact structure:
{
  "type": "bar_chart",
  "props": {
    "title": "Sales Overview",
    "xKey": "date",
    "yKey": "sales"
  }
}
Allowed types: stat, table, line_chart, bar_chart.
Do NOT return raw data. Only return the UI Schema.`;

  const handleManualSubmit = () => {
    try {
      const parsed = JSON.parse(textValue);
      if (Array.isArray(parsed) && !parsed[0].type) {
        setRawData(parsed);
        // Also trigger a default UI if no schema was provided
        setUiSchema([{ 
          type: "table", 
          props: { title: "Imported Data", columns: Object.keys(parsed[0]) } 
        }]);
      } else {
        // If it's a valid UI Schema, just set the schema
        setUiSchema(Array.isArray(parsed) ? parsed : [parsed]);
      }
    } catch (e) {
      alert("AI output was not valid JSON. Try asking it to 'Wrap the JSON in brackets'.");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">AI Generative Dashboard</h2>

      <CopilotKit publicApiKey="ck_pub_bcc4a232f17caba933fa7ea7fe524d73">
        <CopilotTextarea
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder="Example: Generate a bar_chart for sales data [ { 'label': 'Jan', 'value': 40 } ]"
          autosuggestionsConfig={{
            textareaPurpose: SYSTEM_PROMPT,
            chatApiConfigs: {},
          }}
          className="min-h-[150px] w-full border p-4 rounded-lg font-mono text-sm"
        />
      </CopilotKit>
      
      <button 
        onClick={handleManualSubmit} 
        className="px-6 py-2 bg-black text-white rounded-md hover:opacity-80 transition"
      >
        Render Dashboard
      </button>

      <hr />

      {/* Render the dashboard using the GeneratedDashboard component */}
      {uiSchema.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GeneratedDashboard schema={uiSchema} data={rawData} />
        </div>
      )}
    </div>
  );
}