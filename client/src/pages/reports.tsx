import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sale, DashboardStats } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Calendar,
  Download,
  FileText,
  BarChart3
} from "lucide-react";

export default function Reports() {
  const [timeRange, setTimeRange] = useState("7d");
  
  const { data: sales, isLoading: salesLoading } = useQuery<Sale[]>({
    queryKey: ["/api/sales"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  // Mock data for demonstration (in real app, this would come from API)
  const weeklyRevenueData = [
    { day: "Seg", revenue: 1850, orders: 25 },
    { day: "Ter", revenue: 2240, orders: 32 },
    { day: "Qua", revenue: 1620, orders: 21 },
    { day: "Qui", revenue: 2150, orders: 29 },
    { day: "Sex", revenue: 2850, orders: 38 },
    { day: "Sáb", revenue: 3120, orders: 42 },
    { day: "Dom", revenue: 2890, orders: 35 }
  ];

  const monthlyRevenueData = [
    { month: "Jan", revenue: 45000, orders: 580 },
    { month: "Fev", revenue: 52000, orders: 650 },
    { month: "Mar", revenue: 48000, orders: 620 },
    { month: "Abr", revenue: 61000, orders: 750 },
    { month: "Mai", revenue: 58000, orders: 720 },
    { month: "Jun", revenue: 67000, orders: 820 }
  ];

  const categoryData = [
    { name: "Hambúrgueres", value: 35, color: "#3b82f6" },
    { name: "Pizzas", value: 25, color: "#ef4444" },
    { name: "Saladas", value: 15, color: "#10b981" },
    { name: "Bebidas", value: 20, color: "#f59e0b" },
    { name: "Sobremesas", value: 5, color: "#8b5cf6" }
  ];

  const paymentMethodData = [
    { name: "Cartão", value: 60, color: "#3b82f6" },
    { name: "Dinheiro", value: 25, color: "#10b981" },
    { name: "PIX", value: 15, color: "#f59e0b" }
  ];

  const getChartData = () => {
    switch (timeRange) {
      case "30d":
        return monthlyRevenueData;
      case "7d":
      default:
        return weeklyRevenueData;
    }
  };

  const chartData = getChartData();

  const isLoading = salesLoading || statsLoading;

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

  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = chartData.reduce((sum, item) => sum + item.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600">Análise de vendas e performance do restaurante</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">R$ {totalRevenue.toLocaleString()}</p>
                <div className="flex items-center text-sm mt-1">
                  <TrendingUp className="text-green-500 mr-1" size={16} />
                  <span className="text-green-500 font-medium">+12.5%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                <div className="flex items-center text-sm mt-1">
                  <TrendingUp className="text-green-500 mr-1" size={16} />
                  <span className="text-green-500 font-medium">+8.3%</span>
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                <p className="text-2xl font-bold text-gray-900">R$ {avgOrderValue.toFixed(2)}</p>
                <div className="flex items-center text-sm mt-1">
                  <TrendingUp className="text-green-500 mr-1" size={16} />
                  <span className="text-green-500 font-medium">+4.1%</span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Únicos</p>
                <p className="text-2xl font-bold text-gray-900">187</p>
                <div className="flex items-center text-sm mt-1">
                  <TrendingDown className="text-red-500 mr-1" size={16} />
                  <span className="text-red-500 font-medium">-2.1%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Receita por Período</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={timeRange === "30d" ? "month" : "day"} />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value}`, "Receita"]} />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos por Período</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={timeRange === "30d" ? "month" : "day"} />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}`, "Pedidos"]} />
                <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Vendas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Sales Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Melhor Dia</p>
                <p className="text-lg font-bold text-blue-900">Sábado</p>
                <p className="text-sm text-blue-700">R$ 3.120 em vendas</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-800">Produto Mais Vendido</p>
                <p className="text-lg font-bold text-green-900">Hambúrguer Clássico</p>
                <p className="text-sm text-green-700">142 vendas</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium text-purple-800">Horário de Pico</p>
                <p className="text-lg font-bold text-purple-900">19:00 - 21:00</p>
                <p className="text-sm text-purple-700">45% das vendas</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Top 5 Produtos</h4>
              <div className="space-y-2">
                {[
                  { name: "Hambúrguer Clássico", sales: 142, revenue: 3679 },
                  { name: "Pizza Margherita", sales: 98, revenue: 3185 },
                  { name: "Salada Caesar", sales: 87, revenue: 1645 },
                  { name: "Batata Frita", sales: 156, revenue: 1950 },
                  { name: "Refrigerante", sales: 203, revenue: 1117 }
                ].map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.sales} vendas</p>
                    </div>
                    <Badge variant="secondary">R$ {product.revenue.toLocaleString()}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
