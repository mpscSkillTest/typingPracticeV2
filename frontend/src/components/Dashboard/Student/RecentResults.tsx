import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { Subject } from "../../../types";

type Props = {
  subject: Subject;
};

const RecentResults = (props: Props) => {
  const { subject } = props;
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Results</CardTitle>
      </CardHeader>
      <CardDescription className="pl-[20px]">
        Your Last 5 submissions
      </CardDescription>
      <CardContent>{subject}</CardContent>
    </Card>
  );
};

export default RecentResults;
