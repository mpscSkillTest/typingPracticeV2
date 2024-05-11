import { ColumnDef } from "@tanstack/react-table";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formateDate } from "../../../utils/formatter";
import { formateDateWithoutTime } from "../../../utils/formatter";

import type { PaymentHistory } from "../../../types";

const getFormattedNumber = (value: number | string) => {
  return <div className="text-right font-medium">{value}</div>;
};

const getColumnHeaderWithSort = (column, headerText: string) => {
  const { toggleSorting, getIsSorted } = column || {};
  const isSorted = getIsSorted?.();
  return (
    <Button
      className="p-0"
      variant="ghost"
      onClick={() => toggleSorting(isSorted === "asc")}
    >
      {headerText}
      {isSorted === "asc" ? <ArrowUp className="ml-2 h-3 w-3" /> : null}
      {isSorted === "desc" ? <ArrowDown className="ml-2 h-3 w-3" /> : null}
    </Button>
  );
};

export const Columns: ColumnDef<PaymentHistory>[] = [
  {
    accessorKey: "paymentId",
    header: "Payment Id",
    cell: ({ row }) => getFormattedNumber(row.getValue("paymentId")),
    meta: {
      dataType: "number",
    },
  },

  {
    accessorKey: "date",
    enableSorting: true,
    cell: ({ row }) => formateDateWithoutTime(row.getValue("date")),
    header: ({ column }) => getColumnHeaderWithSort(column, "Payment Date"),
  },

  { accessorKey: "transactionId", header: "Transaction Id" },

  { accessorKey: "productName", header: "Product Name" },

  {
    accessorKey: "nextBillingDate",

    cell: ({ row }) => formateDateWithoutTime(row.getValue("nextBillingDate")),
    header: ({ column }) =>
      getColumnHeaderWithSort(column, "Next Billing Date"),
  },
];
