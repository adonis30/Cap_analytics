import { ColumnDef, Row, CellContext } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Company as ImportedCompany } from "@/types";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// Function to format camelCase or similar strings to readable text
const formatHeader = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
};

const clampInline: React.CSSProperties = {
  display: '-webkit-box',
  WebkitLineClamp: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitBoxOrient: 'vertical' as 'vertical',
};

const createColumnsFromType = <T,>(fields: (keyof T)[]): ColumnDef<T>[] => {
  return fields.map((field) => ({
    accessorKey: field as string,
    header: formatHeader(field.toString()),
    cell: ({ row }) => {
      const value: any = row.getValue(field as string);
      if (field === "description") {
        return <div className="line-clamp-2" style={clampInline}>{value}</div>;
      }
      if (field === "category" && typeof value === "object" && value !== null && "name" in value) {
        return <div className="whitespace-nowrap">{(value as any).name}</div>;
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
  }));
};

const organizationFields: (keyof Company)[] = ["organizationName", "description"];
const cellClassName = "px-4 py-3";

// Extra interfaces
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
  ...createColumnsFromType<Company>(organizationFields).map(column => ({
    ...column,
    header: ({ column }) => (
      <div className={cellClassName}>
        {formatHeader(column.id)}
      </div>
    ),
    cell: (props: CellContext<Company, unknown>) => (
      <div className={cellClassName}>
        {typeof column.cell === 'function'
          ? column.cell(props)
          : props.getValue()}
      </div>
    ),
  })) as ColumnDef<Company>[],
  {
    accessorKey: "categories",
    header: () => <div className={cellClassName}>Sector / Industry</div>,
    cell: ({ row }) => {
      const categories = row.getValue("categories") as Category[];
      return (
        <div className={`${cellClassName} font-medium`} style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '200px',
        }}>
          {categories?.length ? categories.map(cat => cat.name).join(", ") : "N/A"}
        </div>
      );
    },
  } as ColumnDef<Company>,

  // ✅ NEW SDG FOCUS COLUMN
  {
    accessorKey: "sdgFocus",
    header: () => <div className={cellClassName}>SDG Focus</div>,
    cell: ({ row }) => {
      const sdgs = row.getValue("sdgFocus") as SDG[];
      return (
        <div className={`${cellClassName} font-medium`} style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '300px',
        }}>
          {sdgs?.length ? sdgs.map(s => s.name).join(", ") : "N/A"}
        </div>
      );
    },
  } as ColumnDef<Company>,
];

export default columns;
