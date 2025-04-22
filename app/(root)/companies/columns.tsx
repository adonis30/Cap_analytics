import { ColumnDef, Row, CellContext } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Company as ImportedCompany } from "@/types";  // Renamed import
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// Function to format camelCase or similar strings to readable text
const formatHeader = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()); // Capitalize the first letter
};

// Define the clampInline style object with explicit types
const clampInline: React.CSSProperties = {
  display: '-webkit-box',
  WebkitLineClamp: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitBoxOrient: 'vertical' as 'vertical', // Ensure type compatibility
};

// Mapping function to generate column definitions dynamically
const createColumnsFromType = <T,>(fields: (keyof T)[]): ColumnDef<T>[] => {
  return fields.map((field) => ({
    accessorKey: field as string,
    header: formatHeader(field.toString()),
    cell: ({ row }) => {
      const value: any = row.getValue(field as string); // Explicitly define value as any

      if (field === "description") {
        return (
          <div className="line-clamp-2" style={clampInline}>
            {value}
          </div>
        );
      }

      // Check if field is 'category' and handle object with 'name'
      if (field === "category" && typeof value === "object" && value !== null && "name" in value) {
        return <div className="whitespace-nowrap">{(value as any).name}</div>; // Handle category name
      }
      if (field === "organizationName") {
        const organization = row.original as Company; // Cast to specific type
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

      // Default render for other fields
      return <div className="whitespace-nowrap">{value}</div>;
    },
  }));
};

// Update this array to remove "category"
const organizationFields: (keyof Company)[] = [
  "organizationName",
  "description",
  "location",
];

const cellClassName = "px-4 py-3"; // Add consistent padding to all cells

// Update the Company type to reflect the actual structure
interface Category {
  _id: string;
  name: string;
}

export interface Company extends ImportedCompany {
  // Add any additional properties here if needed
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
  })) as ColumnDef<Company>[], // Add type assertion here
  {
    accessorKey: "categories",
    header: ({ column }) => (
      <div className={cellClassName}>
       Sector / industry 
      </div>
    ),
    cell: ({ row }) => {
      const categories = row.getValue("categories") as Category[];
      return (
        <div className={`${cellClassName} font-medium`} style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '200px', // Adjust this value as needed
        }}>
          {categories && categories.length > 0
            ? categories.map(cat => cat.name).join(", ")
            : 'N/A'}
        </div>
      );
    },
  } as ColumnDef<Company>, // Add type assertion here
 
];

export default columns;
