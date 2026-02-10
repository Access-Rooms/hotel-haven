import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
    ResponsiveContainer
  } from "recharts";
  import { GeneratedUI } from "@/models/GeneratedUI";
  
  interface GeneratedDashboardProps {
    schema: GeneratedUI[];
    data: any[];
  }
  
  export function GeneratedDashboard({ schema, data }: GeneratedDashboardProps) {
    return (
      <>
        {schema.map((block, i) => {
          switch (block.type) {
            case "stat":
              return (
                <div key={i} className="p-4 border rounded shadow-sm bg-white">
                  <p className="text-sm text-gray-500">{block.props.label}</p>
                  <h3 className="text-2xl font-bold">
                    {data.reduce((a, b) => a + Number(b[block.props.field] || 0), 0)}
                  </h3>
                </div>
              );
  
            case "line_chart":
              return (
                <div key={i} className="p-4 border rounded bg-white col-span-2">
                  <h3 className="font-bold mb-2">{block.props.title}</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                      <XAxis dataKey={block.props.xKey} />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey={block.props.yKey} stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              );
  
            case "bar_chart":
              return (
                <div key={i} className="p-4 border rounded bg-white col-span-2">
                  <h3 className="font-bold mb-2">{block.props.title}</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                      <XAxis dataKey={block.props.xKey} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey={block.props.yKey} fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              );
  
            case "table":
              return (
                <div key={i} className="p-4 border rounded bg-white col-span-2 overflow-x-auto">
                  <h3 className="font-bold mb-2">{block.props.title}</h3>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        {block.props.columns.map(c => (
                          <th key={c} className="text-left p-2 font-semibold">{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          {block.props.columns.map(c => (
                            <td key={c} className="p-2">{row[c]}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
          }
        })}
      </>
    );
  }
  