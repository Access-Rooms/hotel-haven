export type GeneratedUI =
  | {
      type: "stat";
      props: {
        label: string;
        field: string;
      };
    }
  | {
      type: "table";
      props: {
        title: string;
        columns: string[];
      };
    }
  | {
      type: "line_chart";
      props: {
        title: string;
        xKey: string;
        yKey: string;
      };
    }
  | {
      type: "bar_chart";
      props: {
        title: string;
        xKey: string;
        yKey: string;
      };
    };