import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Columns } from "./DataTable/Column";
import { DataTable } from "./DataTable/Table";
import type { PaymentHistory } from "../../types";
import axios from "../../config/customAxios";

const PaymentHistory = () => {
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);

  const getPaymentHistory = async () => {
    let updatePaymentHistory: PaymentHistory[] = [];
    setShowLoader(true);
    try {
      const response = await axios.get("/student/payment-history");
      updatePaymentHistory = response.data.payments;
    } catch (error) {
      console.error(error);
    } finally {
      setShowLoader(false);
    }

    setPaymentHistory(updatePaymentHistory);
  };

  const getTableDom = () => {
    if (showLoader) {
      return (
        <div className="h-full flex items-center justify-center">
          <Icons.spinner height={48} width={48} className="animate-spin" />
        </div>
      );
    }
    return <DataTable columns={Columns} data={paymentHistory} />;
  };

  useEffect(() => {
    getPaymentHistory();
  }, []);

  return (
    <Card className="col-span-8">
      <CardHeader>
        <CardTitle>Recent Payments</CardTitle>
      </CardHeader>
      <CardContent>{getTableDom()}</CardContent>
    </Card>
  );
};

export default PaymentHistory;
