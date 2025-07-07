import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableGrid } from "@/components/table-grid";
import { Plus, Search, Filter, Users, Armchair, Clock, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function TablesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: tables, isLoading } = useQuery<Table[]>({
    queryKey: ["/api/tables"],
  });

  const updateTableMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PUT", `/api/tables/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tables"] });
      toast({
        title: "Mesa atualizada",
        description: "O status da mesa foi atualizado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a mesa.",
        variant: "destructive",
      });
    },
  });

  const filteredTables = tables?.filter(table => {
    const matchesSearch = table.number.toString().includes(searchTerm) ||
                         table.reservedBy?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || table.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { label: "Disponível", className: "bg-green-100 text-green-800 border-green-200" },
      occupied: { label: "Ocupada", className: "bg-red-100 text-red-800 border-red-200" },
      reserved: { label: "Reservada", className: "bg-blue-100 text-blue-800 border-blue-200" },
      cleaning: { label: "Limpeza", className: "bg-purple-100 text-purple-800 border-purple-200" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.available;
    
    return (
      <Badge className={cn("text-xs font-medium", config.className)}>
        {config.label}
      </Badge>
    );
  };

  const handleStatusChange = (tableId: number, newStatus: string) => {
    updateTableMutation.mutate({ id: tableId, status: newStatus });
  };

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
  };

  const getStatusCounts = () => {
    if (!tables) return { available: 0, occupied: 0, reserved: 0, cleaning: 0 };
    
    return tables.reduce((acc, table) => {
      acc[table.status as keyof typeof acc] = (acc[table.status as keyof typeof acc] || 0) + 1;
      return acc;
    }, { available: 0, occupied: 0, reserved: 0, cleaning: 0 });
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Mesas</h1>
          <p className="text-gray-600">Gerencie o layout e status das mesas</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Mesa
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Disponíveis</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.available}</p>
              </div>
              <Armchair className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ocupadas</p>
                <p className="text-2xl font-bold text-red-600">{statusCounts.occupied}</p>
              </div>
              <Users className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reservadas</p>
                <p className="text-2xl font-bold text-blue-600">{statusCounts.reserved}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Limpeza</p>
                <p className="text-2xl font-bold text-purple-600">{statusCounts.cleaning}</p>
              </div>
              <Trash2 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Layout das Mesas</CardTitle>
        </CardHeader>
        <CardContent>
          <TableGrid tables={tables || []} onTableClick={handleTableClick} />
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Buscar por número da mesa ou reserva..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="available">Disponíveis</SelectItem>
            <SelectItem value="occupied">Ocupadas</SelectItem>
            <SelectItem value="reserved">Reservadas</SelectItem>
            <SelectItem value="cleaning">Limpeza</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tables List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTables.map((table) => (
          <Card key={table.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Mesa {table.number}</CardTitle>
                {getStatusBadge(table.status)}
              </div>
              <p className="text-sm text-gray-600">{table.capacity} lugares</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {table.reservedBy && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">Reservado por:</p>
                  <p className="text-sm text-gray-600">{table.reservedBy}</p>
                  {table.reservedAt && (
                    <p className="text-xs text-gray-500">
                      {new Date(table.reservedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
              
              <Select
                value={table.status}
                onValueChange={(value) => handleStatusChange(table.id, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponível</SelectItem>
                  <SelectItem value="occupied">Ocupada</SelectItem>
                  <SelectItem value="reserved">Reservada</SelectItem>
                  <SelectItem value="cleaning">Limpeza</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTables.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhuma mesa encontrada</p>
          <p className="text-gray-400">Tente ajustar os filtros ou adicionar uma nova mesa</p>
        </div>
      )}
    </div>
  );
}
