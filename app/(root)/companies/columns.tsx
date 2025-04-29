import { ColumnDef, CellContext } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Company as ImportedCompany } from "@/types";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// Formatting function
const formatHeader = (key: string): string =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

const clampInline: React.CSSProperties = {
  display: "-webkit-box",
  WebkitLineClamp: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  WebkitBoxOrient: "vertical" as "vertical",
};

const truncateStyle: React.CSSProperties = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const cellClassName = "px-2 py-3 text-sm";
const wideCellClass = `${cellClassName} max-w-[200px] truncate`;

interface Category {
  _id: string;
  name: string;
}
interface SDG {
  _id: string;
  name: string;
}

export interface Company extends ImportedCompany {
  sdgFocus?: SDG[];
}

const organizationFields: (keyof Company)[] = ["organizationName", "description"];

// Column for each basic field
const createColumnsFromType = <T,>(fields: (keyof T)[]): ColumnDef<T>[] =>
  fields.map((field) => ({
    accessorKey: field as string,
    header: formatHeader(field.toString()),
    cell: ({ row }) => {
      const value: any = row.getValue(field as string);

      if (field === "description") {
        return (
          <div style={{ ...clampInline, maxWidth: "250px" }}>
            {value}
          </div>
        );
      }

      if (field === "organizationName") {
        const organization = row.original as Company;
        return (
          <div className="flex items-center space-x-2">
            <img
              src={organization.imageUrl}
              alt={organization.organizationName}
              className="h-8 w-8 rounded-full"
            />
            <span className="whitespace-nowrap">{value}</span>
          </div>
        );
      }

      return <div className="whitespace-nowrap">{value}</div>;
    },
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  }));

export const columns: ColumnDef<Company>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className={cellClassName}>
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className={cellClassName}>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  ...createColumnsFromType<Company>(organizationFields).map((column) => ({
    ...column,
    header: ({ column: col }) => (
      <div className="flex items-center gap-2">
        {formatHeader(col.id)}
        <Button
          variant="ghost"
          onClick={() => col.toggleSorting(col.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: (props: CellContext<Company, unknown>) => (
      <div className={cellClassName}>
        {typeof column.cell === "function" ? column.cell(props) : props.getValue()}
      </div>
    ),
  })),

  {
    accessorKey: "categories",
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        Sector / Industry
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    accessorFn: (row) =>
      row.categories?.map((cat) => cat.name).join(", ") ?? "",
    cell: ({ row }) => {
      const categories = row.getValue("categories") as string;
      return (
        <div className={`${cellClassName} font-medium`} style={{ maxWidth: "200px", ...truncateStyle }}>
          {categories || "N/A"}
        </div>
      );
    },
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },

  {
    accessorKey: "sdgFocus",
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        SDG Focus
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    accessorFn: (row) =>
      row.sdgFocus?.map((sdg) => sdg.name).join(", ") ?? "",
    cell: ({ row }) => {
      const sdgs = row.getValue("sdgFocus") as string;
      return (
        <div className={`${cellClassName} font-medium`} style={{ maxWidth: "200px", ...truncateStyle }}>
          {sdgs || "N/A"}
        </div>
      );
    },
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
];

export default columns;
