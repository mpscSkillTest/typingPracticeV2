import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Subject } from "../../../types";

type Props = {
  subject: Subject;
};

const OverView = (props: Props) => {
  const { subject } = props;
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div>{subject}</div>
      </CardContent>
    </Card>
  );
};

export default OverView;
