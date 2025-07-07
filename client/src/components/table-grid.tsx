import { Table } from "@shared/schema";
import { cn } from "@/lib/utils";

interface TableGridProps {
  tables: Table[];
  onTableClick?: (table: Table) => void;
}

export function TableGrid({ tables, onTableClick }: TableGridProps) {
  const getTableStatusClass = (status: string) => {
    switch (status) {
      case "occupied":
        return "table-occupied";
      case "reserved":
        return "table-reserved";
      case "cleaning":
        return "table-cleaning";
      default:
        return "table-available";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "occupied":
        return "Ocupada";
      case "reserved":
        return "Reservada";
      case "cleaning":
        return "Limpeza";
      default:
        return "Livre";
    }
  };

  return (
    <div>
      <div className="grid grid-cols-5 gap-3 mb-4">
        {tables.map((table) => (
          <div
            key={table.id}
            className={cn(
              "aspect-square rounded-lg flex items-center justify-center border-2 cursor-pointer transition-colors",
              getTableStatusClass(table.status),
              "hover:opacity-80"
            )}
            onClick={() => onTableClick?.(table)}
          >
            <div className="text-center">
              <div className="text-sm font-semibold">{table.number}</div>
              <div className="text-xs">{getStatusText(table.status)}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-200 rounded-full"></div>
          <span className="text-gray-600">Ocupada</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
          <span className="text-gray-600">Livre</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-200 rounded-full"></div>
          <span className="text-gray-600">Reservada</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-200 rounded-full"></div>
          <span className="text-gray-600">Limpeza</span>
        </div>
      </div>
    </div>
  );
}
