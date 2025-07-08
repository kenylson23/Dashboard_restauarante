import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Inventory, insertInventorySchema } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, Filter, Edit, Trash2, AlertTriangle, Package, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

type InventoryFormData = z.infer<typeof insertInventorySchema>;

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Inventory | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: inventoryItems, isLoading } = useQuery<Inventory[]>({
    queryKey: ["/api/inventory"],
  });

  const { data: lowStockItems } = useQuery<Inventory[]>({
    queryKey: ["/api/inventory/low-stock"],
  });

  const form = useForm<InventoryFormData>({
    resolver: zodResolver(insertInventorySchema),
    defaultValues: {
      name: "",
      category: "",
      currentStock: "0",
      unit: "",
      minThreshold: "0",
      maxThreshold: "0",
      pricePerUnit: "0",
      supplier: "",
    },
  });

  const createInventoryMutation = useMutation({
    mutationFn: async (data: InventoryFormData) => {
      return apiRequest("POST", "/api/inventory", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory/low-stock"] });
      toast({
        title: "Item criado",
        description: "O item foi adicionado ao estoque com sucesso.",
      });
      setIsAddModalOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar o item.",
        variant: "destructive",
      });
    },
  });

  const updateInventoryMutation = useMutation({
    mutationFn: async (data: InventoryFormData) => {
      if (!editingItem) return;
      return apiRequest("PUT", `/api/inventory/${editingItem.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory/low-stock"] });
      toast({
        title: "Item atualizado",
        description: "O item foi atualizado com sucesso.",
      });
      setEditingItem(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o item.",
        variant: "destructive",
      });
    },
  });

  const deleteInventoryMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/inventory/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory/low-stock"] });
      toast({
        title: "Item removido",
        description: "O item foi removido do estoque.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível remover o item.",
        variant: "destructive",
      });
    },
  });

  const getStockStatus = (item: Inventory) => {
    const current = parseFloat(item.currentStock);
    const min = parseFloat(item.minThreshold);
    const max = parseFloat(item.maxThreshold);
    
    if (current <= min * 0.5) {
      return { status: "critical", label: "Crítico", className: "stock-critical" };
    } else if (current <= min) {
      return { status: "low", label: "Baixo", className: "stock-low" };
    } else if (current >= max) {
      return { status: "high", label: "Alto", className: "bg-blue-100 text-blue-800 border-blue-200" };
    }
    return { status: "normal", label: "Normal", className: "stock-normal" };
  };

  const getStockPercentage = (item: Inventory) => {
    const current = parseFloat(item.currentStock);
    const max = parseFloat(item.maxThreshold);
    return Math.min((current / max) * 100, 100);
  };

  const filteredItems = inventoryItems?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const stockStatus = getStockStatus(item).status;
    const matchesStock = stockFilter === "all" || 
                        (stockFilter === "low" && (stockStatus === "critical" || stockStatus === "low")) ||
                        (stockFilter === "normal" && stockStatus === "normal") ||
                        (stockFilter === "high" && stockStatus === "high");
    return matchesSearch && matchesCategory && matchesStock;
  }) || [];

  const categories = [...new Set(inventoryItems?.map(item => item.category) || [])];

  const onSubmit = (data: InventoryFormData) => {
    if (editingItem) {
      updateInventoryMutation.mutate(data);
    } else {
      createInventoryMutation.mutate(data);
    }
  };

  const handleEdit = (item: Inventory) => {
    setEditingItem(item);
    form.reset({
      name: item.name,
      category: item.category,
      currentStock: item.currentStock,
      unit: item.unit,
      minThreshold: item.minThreshold,
      maxThreshold: item.maxThreshold,
      pricePerUnit: item.pricePerUnit || "0",
      supplier: item.supplier || "",
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja remover este item?")) {
      deleteInventoryMutation.mutate(id);
    }
  };

  const getInventoryStats = () => {
    if (!inventoryItems) return { total: 0, lowStock: 0, critical: 0, value: 0 };
    
    let total = 0;
    let lowStock = 0;
    let critical = 0;
    let value = 0;
    
    inventoryItems.forEach(item => {
      total++;
      const current = parseFloat(item.currentStock);
      const min = parseFloat(item.minThreshold);
      const price = parseFloat(item.pricePerUnit || "0");
      
      value += current * price;
      
      if (current <= min * 0.5) {
        critical++;
      } else if (current <= min) {
        lowStock++;
      }
    });
    
    return { total, lowStock, critical, value };
  };

  const stats = getInventoryStats();

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
          <h1 className="text-2xl font-bold text-gray-900">Estoque</h1>
          <p className="text-gray-600">Gerencie o inventário do restaurante</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Editar Item" : "Novo Item do Estoque"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do item" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Vegetais, Carnes, Bebidas" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="currentStock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estoque Atual</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="minThreshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mínimo</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxThreshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Máximo</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unidade</FormLabel>
                        <FormControl>
                          <Input placeholder="kg, unidades, litros" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pricePerUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço por Unidade</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="supplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fornecedor</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do fornecedor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingItem(null);
                      form.reset();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createInventoryMutation.isPending || updateInventoryMutation.isPending}>
                    {editingItem ? "Atualizar" : "Criar"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Itens</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Estoque Baixo</p>
                <p className="text-2xl font-bold text-orange-600">{stats.lowStock}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Crítico</p>
                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-green-600">R$ {stats.value.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems && lowStockItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Alerta de Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-gray-600">
                    {item.currentStock} {item.unit} restantes
                  </span>
                  <Badge className={getStockStatus(item).className}>
                    {getStockStatus(item).label}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Buscar itens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Categorias</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Estoques</SelectItem>
            <SelectItem value="low">Estoque Baixo</SelectItem>
            <SelectItem value="normal">Estoque Normal</SelectItem>
            <SelectItem value="high">Estoque Alto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inventory Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const stockStatus = getStockStatus(item);
          const stockPercentage = getStockPercentage(item);
          
          return (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {item.category}
                    </Badge>
                  </div>
                  <Badge className={stockStatus.className}>
                    {stockStatus.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Estoque:</span>
                    <span className="font-medium">
                      {item.currentStock} {item.unit}
                    </span>
                  </div>
                  <Progress value={stockPercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Min: {item.minThreshold}</span>
                    <span>Max: {item.maxThreshold}</span>
                  </div>
                </div>
                
                {item.supplier && (
                  <div className="text-sm">
                    <span className="text-gray-600">Fornecedor: </span>
                    <span className="font-medium">{item.supplier}</span>
                  </div>
                )}
                
                {item.pricePerUnit && (
                  <div className="text-sm">
                    <span className="text-gray-600">Preço: </span>
                    <span className="font-medium">R$ {item.pricePerUnit}/{item.unit}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-gray-500">
                    Atualizado: {new Date(item.lastUpdated).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleEdit(item);
                        setIsAddModalOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum item encontrado</p>
          <p className="text-gray-400">Tente ajustar os filtros ou adicionar um novo item</p>
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={editingItem !== null} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Item</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do item" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Vegetais, Carnes, Bebidas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="currentStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estoque Atual</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mínimo</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Máximo</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidade</FormLabel>
                      <FormControl>
                        <Input placeholder="kg, unidades, litros" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pricePerUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço por Unidade</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fornecedor</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do fornecedor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingItem(null);
                    form.reset();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={updateInventoryMutation.isPending}>
                  Atualizar
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
