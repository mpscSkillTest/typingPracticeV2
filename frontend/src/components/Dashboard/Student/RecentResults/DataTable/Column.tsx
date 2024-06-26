import { ColumnDef } from "@tanstack/react-table";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatToPercent, formateDate } from "../../../../../utils/formatter";
import type { Result } from "../../../../../types";

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

export const Columns: ColumnDef<Result>[] = [
  {
    accessorKey: "date",
    enableSorting: true,
    cell: ({ row }) => formateDate(row.getValue("date")),
    header: ({ column }) => getColumnHeaderWithSort(column, "Date"),
  },
  { accessorKey: "passageTitle", header: "Passage Title" },
  {
    accessorKey: "totalWordsCount",
    header: "Total Words",
    cell: ({ row }) => getFormattedNumber(row.getValue("totalWordsCount")),
    meta: {
      dataType: "number",
    },
  },
  {
    accessorKey: "typedWordsCount",
    header: "Typed Words",
    cell: ({ row }) => getFormattedNumber(row.getValue("typedWordsCount")),
    meta: {
      dataType: "number",
    },
  },
  {
    accessorKey: "keystrokesCount",
    header: ({ column }) => getColumnHeaderWithSort(column, "Keystrokes"),
    cell: ({ row }) => getFormattedNumber(row.getValue("keystrokesCount")),
    meta: {
      dataType: "number",
    },
  },
  {
    accessorKey: "backspacesCount",
    header: ({ column }) => getColumnHeaderWithSort(column, "Backspaces"),
    cell: ({ row }) => getFormattedNumber(row.getValue("backspacesCount")),
    meta: {
      dataType: "number",
    },
  },
  {
    accessorKey: "accuracy",
    enableSorting: true,
    header: ({ column }) => getColumnHeaderWithSort(column, "Accuracy"),
    cell: ({ row }) =>
      getFormattedNumber(formatToPercent(row.getValue("accuracy"))),
    meta: {
      dataType: "number",
    },
  },
  {
    accessorKey: "errorsCount",
    enableSorting: true,
    header: ({ column }) => getColumnHeaderWithSort(column, "Errors"),
    cell: ({ row }) => getFormattedNumber(row.getValue("errorsCount")),
    meta: {
      dataType: "number",
    },
  },
  {
    accessorKey: "mpscAccuracy",
    enableSorting: true,
    header: ({ column }) => getColumnHeaderWithSort(column, "MPSC Accuracy"),
    cell: ({ row }) =>
      getFormattedNumber(formatToPercent(row.getValue("mpscAccuracy"))),
    meta: {
      dataType: "number",
    },
  },
  {
    accessorKey: "mpscErrorsCount",
    enableSorting: true,
    header: ({ column }) => getColumnHeaderWithSort(column, "MPSC Errors"),
    cell: ({ row }) => getFormattedNumber(row.getValue("mpscErrorsCount")),
    meta: {
      dataType: "number",
    },
  },
];
