import { useQuery } from "@tanstack/react-query";
import { DashboardStats, Order, Table, Inventory } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableGrid } from "@/components/table-grid";
import { 
  DollarSign, 
  ClipboardList, 
  Armchair, 
  Users, 
  ArrowUp,
  TrendingUp,
  AlertTriangle,
  Plus,
  Calendar,
  Utensils,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const { data: tables, isLoading: tablesLoading } = useQuery<Table[]>({
    queryKey: ["/api/tables"],
  });

  const { data: lowStockItems, isLoading: inventoryLoading } = useQuery<Inventory[]>({
    queryKey: ["/api/inventory/low-stock"],
  });

  if (statsLoading || ordersLoading || tablesLoading || inventoryLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const recentOrders = orders?.slice(0, 3) || [];
  const limitedTables = tables?.slice(0, 10) || [];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", className: "status-pending" },
      preparing: { label: "Preparando", className: "status-preparing" },
      ready: { label: "Pronto", className: "status-ready" },
      served: { label: "Servido", className: "status-served" },
      cancelled: { label: "Cancelado", className: "status-cancelled" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge className={cn("text-xs font-medium", config.className)}>
        {config.label}
      </Badge>
    );
  };

  const getStockStatusBadge = (item: Inventory) => {
    const current = parseFloat(item.currentStock);
    const min = parseFloat(item.minThreshold);
    const max = parseFloat(item.maxThreshold);
    
    if (current <= min * 0.5) {
      return <Badge className="stock-critical">Crítico</Badge>;
    } else if (current <= min) {
      return <Badge className="stock-low">Baixo</Badge>;
    }
    return <Badge className="stock-normal">Normal</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Hoje</p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {stats?.dailyRevenue.toFixed(2) || "0,00"}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowUp className="text-green-500 mr-1" size={16} />
              <span className="text-green-500 font-medium">+12.5%</span>
              <span className="text-gray-500 ml-2">vs ontem</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pedidos Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.activeOrders || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ClipboardList className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-orange-500 font-medium">8 pendentes</span>
              <span className="text-gray-500 ml-2">• 15 em preparo</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mesas Ocupadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.occupiedTables || 0}/{stats?.totalTables || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Armchair className="text-purple-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-purple-500 font-medium">
                {stats ? Math.round((stats.occupiedTables / stats.totalTables) * 100) : 0}% ocupação
              </span>
              <span className="text-gray-500 ml-2">• 3 reservadas</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Funcionários</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.staffPresent || 0}/{stats?.totalStaff || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Users className="text-indigo-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-500 font-medium">Todos presentes</span>
              <span className="text-gray-500 ml-2">• 3 ausentes</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pedidos Recentes</CardTitle>
            <Button variant="ghost" size="sm">
              Ver todos
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => {
                const orderItems = JSON.parse(order.items);
                return (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">{order.tableNumber}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Mesa {order.tableNumber}</p>
                        <p className="text-sm text-gray-600">
                          {orderItems.slice(0, 2).map((item: any) => `${item.quantity}x ${item.name}`).join(", ")}
                          {orderItems.length > 2 && "..."}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(order.status)}
                      <p className="text-sm text-gray-500 mt-1">R$ {order.total}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Table Layout */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Layout das Mesas</CardTitle>
            <Button variant="ghost" size="sm">
              Gerenciar
            </Button>
          </CardHeader>
          <CardContent>
            <TableGrid tables={limitedTables} />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
              Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems?.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="text-red-600" size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.currentStock} {item.unit} restantes</p>
                    </div>
                  </div>
                  {getStockStatusBadge(item)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Sales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-blue-500" />
              Vendas da Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"].map((day, index) => {
                const values = [1850, 2240, 1620, 2150, 2850, 3120];
                const maxValue = Math.max(...values);
                const percentage = (values[index] / maxValue) * 100;
                
                return (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{day}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-primary rounded-full" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">R$ {values[index].toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Plus className="text-blue-600" size={24} />
                <span className="text-sm font-medium">Novo Pedido</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Calendar className="text-green-600" size={24} />
                <span className="text-sm font-medium">Reserva</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Utensils className="text-purple-600" size={24} />
                <span className="text-sm font-medium">Novo Prato</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <FileText className="text-orange-600" size={24} />
                <span className="text-sm font-medium">Relatório</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
