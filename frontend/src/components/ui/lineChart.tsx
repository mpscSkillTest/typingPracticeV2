import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import type { CurveType, XAxisProps, YAxisProps } from "recharts";

type Margin = {
  top?: number;
  right?: number;
  left?: number;
  bottom?: number;
};

type LineChartConfig = {
  type?: CurveType;
  dataKey: string;
  stroke?: string;
  label: string;
};

export type Props = {
  data?: Record<string, string | number | undefined>[];
  width?: number;
  height?: number;
  margin?: Margin;
  xAxisKey?: string;
  lineChartsConfig?: LineChartConfig[];
  xAxisProps?: XAxisProps;
  yAxisProps?: YAxisProps;
};

export const LINE_CHART_COLORS = {
  chartColor1: "#82ca9d",
  chartColor2: "#ff7300",
  chartColor3: "#fd7f6f",
  chartColor4: "#7eb0d5",
  chartColor5: "#b2e061",
  chartColor6: "#bd7ebe",
  chartColor7: "#ffb55a",
  chartColor8: "#ffee65",
  chartColor9: "#beb9db",
};

export const CommonLineChart = ({
  data,
  width = 730,
  height = 250,
  margin = {
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  xAxisKey,
  xAxisProps = {
    padding: { left: 0, right: 0 },
  },
  yAxisProps = {
    padding: { top: 0, bottom: 0 },
  },
  lineChartsConfig,
}: Props) => {
  return (
    <LineChart width={width} height={height} data={data} margin={margin}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis {...xAxisProps} dataKey={xAxisKey} />
      <YAxis {...yAxisProps} />
      <Tooltip />
      <Legend />
      {lineChartsConfig?.map?.((config: LineChartConfig) => {
        const {
          type = "monotone",
          dataKey,
          stroke = "82ca9d",
          label,
        } = config || {};
        if (dataKey) {
          return (
            <Line name={label} type={type} stroke={stroke} dataKey={dataKey} />
          );
        }
        return null;
      })}
    </LineChart>
  );
};

export default CommonLineChart;
