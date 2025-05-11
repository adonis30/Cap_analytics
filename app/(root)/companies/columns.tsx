import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Company as ImportedCompany } from "@/types";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Helpers
const formatHeader = (key: string): string =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

const clampInline: React.CSSProperties = {
  display: "-webkit-box",
  WebkitLineClamp: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  WebkitBoxOrient: "vertical" as const,
};

const truncateStyle: React.CSSProperties = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

// Types
interface Category {
  _id: string;
  name: string;
}

interface Sector {
  _id: string;
  name: string
}

interface SDG {
  _id: string;
  name: string;
}

export interface Company extends ImportedCompany {
  sdgFocus?: SDG[];
}

const cellClassName = "px-2 py-3 text-sm";

const renderFilterableHeader = (field: string, column: any) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-2">
      {formatHeader(field)}
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    </div>
    <Input
      type="text"
      placeholder="Filter..."
      value={(column.getFilterValue() ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      className="h-7 px-2 text-xs"
    />
  </div>
);

// Columns
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

  {
    accessorKey: "organizationName",
    header: ({ column }) => renderFilterableHeader("organizationName", column),
    cell: ({ row }) => {
      const org = row.original;
      const value = row.getValue("organizationName") as string;
      return (
        <div className="flex items-center gap-2">
          <img
            src={org.imageUrl}
            alt={org.organizationName}
            className="h-8 w-8 rounded-full"
          />
          <span className="whitespace-nowrap">{value}</span>
        </div>
      );
    },
    filterFn: "includesString",
    enableSorting: true,
    enableColumnFilter: true,
  },

  {
    accessorKey: "description",
    header: ({ column }) => renderFilterableHeader("description", column),
    cell: ({ row }) => {
      const value = row.getValue("description") as string;
      return (
        <div className="line-clamp-2" style={{ ...clampInline, maxWidth: "250px" }}>
          {value}
        </div>
      );
    },
    filterFn: "includesString",
    enableSorting: true,
    enableColumnFilter: true,
  },

  {
    accessorKey: "sector",
    header: ({ column }) => renderFilterableHeader("sector", column),
    cell: ({ row }) => {
      const categories = row.getValue("sector") as Sector[];
      return (
        <div className={`${cellClassName} font-medium`} style={{ ...truncateStyle, maxWidth: "200px" }}>
          {sectors?.length ? sector.map((cat) => sec.name).join(", ") : "N/A"}
        </div>
      );
    },
    filterFn: "includesString",
    enableSorting: true,
    enableColumnFilter: true,
  },

  {
    accessorKey: "sdgFocus",
    header: ({ column }) => renderFilterableHeader("sdgFocus", column),
    cell: ({ row }) => {
      const sdgs = row.getValue("sdgFocus") as SDG[];
      return (
        <div className={`${cellClassName} font-medium`} style={{ ...truncateStyle, maxWidth: "200px" }}>
          {sdgs?.length ? sdgs.map((s) => s.name).join(", ") : "N/A"}
        </div>
      );
    },
    filterFn: "includesString",
    enableSorting: true,
    enableColumnFilter: true,
  },
];

export default columns;
