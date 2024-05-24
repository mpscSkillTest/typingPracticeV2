import { ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommonLineChart } from "@/components/ui/lineChart";
import { Icons } from "@/components/ui/icons";
import { CHART_CONFIG, type CHART_CONFIG_TYPES } from "./utils";
import type { Result, DurationOption } from "../../../../types";

type Props = {
  showLoader: boolean;
  title: string;
  type: CHART_CONFIG_TYPES;
  results: Result[];
  label: string;
  duration: DurationOption;
};

const OverView = (props: Props) => {
  const { showLoader, title, type, results, label, duration } = props;

  const chartDetails = CHART_CONFIG[type];

  const { getData, xAxisProps, ...others } = chartDetails || {};

  const updatedXaxisProps = {
    ...xAxisProps,
    label,
  };

  const chartData =
    typeof getData === "function" ? getData(results, duration) : [];

  const getChartContentDom = () => {
    if (showLoader) {
      return (
        <div className="h-full flex items-center justify-center">
          <Icons.spinner height={48} width={48} className="animate-spin" />
        </div>
      );
    }

    if (!chartData?.length) {
      return (
        <div className="h-full flex items-center justify-center">
          No Data Found
        </div>
      );
    }

    return (
      <ResponsiveContainer minHeight={300} height="100%" width="100%">
        <CommonLineChart
          {...others}
          xAxisProps={updatedXaxisProps}
          data={chartData}
        />
      </ResponsiveContainer>
    );
  };

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{getChartContentDom()}</CardContent>
    </Card>
  );
};

export default OverView;
