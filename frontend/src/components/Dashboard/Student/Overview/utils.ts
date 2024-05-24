import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat.js";
import {
  LINE_CHART_COLORS,
  type Props as LineChartProps,
} from "@/components/ui/lineChart";
import { Duration } from "../../../../enums/Duration";
import type { DurationOption, Result } from "../../../../types";

dayjs.extend(localizedFormat);

export type ChartDataType = Record<string, number | string | undefined>;

const isShowingAvgDetails = (duration: DurationOption) =>
  ![Duration.TODAY, Duration.YESTERDAY].includes(Duration[duration]);

export const getGeneralStokesChartData = (
  results: Result[],
  duration: DurationOption
): ChartDataType[] => {
  return results?.map?.((result: Result, index: number) => {
    const { keystrokesCount, backspacesCount, date } = result || {};
    let customName = `Test ${index + 1}`;

    if (isShowingAvgDetails(duration)) {
      customName = `Avg. on ${dayjs(date).format("LL")}`;
    }
    return {
      keystrokes: keystrokesCount,
      backspaces: backspacesCount,
      name: customName,
    };
  });
};

export const getGeneralAccuracyChartData = (
  type: "normal" | "mpsc" = "normal",
  results: Result[],
  duration: DurationOption
): ChartDataType[] => {
  return results?.map?.((result: Result, index: number) => {
    const {
      accuracy = 0,
      errorsCount = 0,
      date,
      mpscAccuracy,
      mpscErrorsCount,
    } = result || {};
    let customName = `Test ${index + 1}`;

    if (isShowingAvgDetails(duration)) {
      customName = `Avg. on ${dayjs(date).format("LL")}`;
    }

    if (type === "mpsc") {
      return {
        mpscAccuracy: mpscAccuracy?.toFixed?.(2) || 0,
        mpscError: mpscErrorsCount,
        name: customName,
      };
    }

    return {
      accuracy: accuracy?.toFixed?.(2) || 0,
      error: errorsCount,
      name: customName,
    };
  });
};

export type ChartConfigType =
  | (LineChartProps & {
      getData: (results: Result[], duration: DurationOption) => ChartDataType[];
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
        label: "Accuracy %",
      },
      {
        dataKey: "error",
        stroke: LINE_CHART_COLORS.chartColor3,
        label: "Errors",
      },
    ],
    xAxisProps: {
      padding: { left: 0, right: 0 },
      tick: false,
    },
    getData: getGeneralAccuracyChartData.bind(this, "normal"),
    xAxisKey: "name",
  },
  MPSC_ACCURACY_CONFIG: {
    lineChartsConfig: [
      {
        dataKey: "mpscAccuracy",
        stroke: LINE_CHART_COLORS.chartColor1,
        label: "Accuracy %",
      },
      {
        dataKey: "mpscError",
        stroke: LINE_CHART_COLORS.chartColor3,
        label: "Errors",
      },
    ],
    xAxisProps: {
      padding: { left: 0, right: 0 },
      tick: false,
    },
    getData: getGeneralAccuracyChartData.bind(this, "mpsc"),
    xAxisKey: "name",
  },
};

export type CHART_CONFIG_TYPES = keyof typeof CHART_CONFIG;
