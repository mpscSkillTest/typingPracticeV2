import {
  LINE_CHART_COLORS,
  type Props as LineChartProps,
} from "@/components/ui/lineChart";
import type { Result } from "../../../../types";

export type ChartDataType = Record<string, number | string | undefined>;

export const getGeneralStokesChartData = (
  results: Result[]
): ChartDataType[] => {
  return results?.map?.((result: Result, index: number) => {
    const { keystrokesCount, backspacesCount } = result || {};
    return {
      keystrokes: keystrokesCount,
      backspaces: backspacesCount,
      name: `Test ${index + 1}`,
    };
  });
};

export const getGeneralAccuracyChartData = (
  results: Result[]
): ChartDataType[] => {
  return results?.map?.((result: Result, index: number) => {
    const { accuracy = 0, errorsCount = 0 } = result || {};
    return {
      accuracy: accuracy?.toFixed?.(2) || 0,
      error: errorsCount,
      name: `Test ${index + 1}`,
    };
  });
};

export type ChartConfigType =
  | (LineChartProps & {
      getData: (results: Result[]) => ChartDataType[];
    })
  | undefined;

export const CHART_CONFIG: Record<string, ChartConfigType> = {
  GENERAL_KEYSTROKES_CONFIG: {
    lineChartsConfig: [
      {
        dataKey: "keystrokes",
        stroke: LINE_CHART_COLORS.chartColor4,
        label: "Keystrokes",
      },
      {
        dataKey: "backspaces",
        stroke: LINE_CHART_COLORS.chartColor2,
        label: "Backspaces",
      },
    ],
    xAxisProps: {
      padding: { left: 0, right: 0 },
      tick: false,
    },
    getData: getGeneralStokesChartData,
    xAxisKey: "name",
  },
  GENERAL_ACCURACY_CONFIG: {
    lineChartsConfig: [
      {
        dataKey: "accuracy",
        stroke: LINE_CHART_COLORS.chartColor1,
        label: "Accuracy Percentage",
      },
      {
        dataKey: "error",
        stroke: LINE_CHART_COLORS.chartColor3,
        label: "Error Count",
      },
    ],
    xAxisProps: {
      padding: { left: 0, right: 0 },
      tick: false,
    },
    getData: getGeneralAccuracyChartData,
    xAxisKey: "name",
  },
};

export type CHART_CONFIG_TYPES = keyof typeof CHART_CONFIG;
