import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Order } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const orderFormSchema = z.object({
  tableNumber: z.number().min(1, "Número da mesa é obrigatório"),
  status: z.enum(["pending", "preparing", "ready", "served", "cancelled"]),
  customerName: z.string().optional(),
  items: z.string().min(1, "Itens são obrigatórios"),
  total: z.string().min(1, "Total é obrigatório"),
  notes: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderFormSchema>;

interface OrderModalProps {
  order?: Order;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderModal({ order, isOpen, onClose }: OrderModalProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      tableNumber: order?.tableNumber || 1,
      status: order?.status as any || "pending",
      customerName: order?.customerName || "",
      items: order?.items || JSON.stringify([]),
      total: order?.total || "0.00",
      notes: order?.notes || "",
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: OrderFormData) => {
      return apiRequest("POST", `/api/orders`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Pedido criado",
        description: "Novo pedido foi criado com sucesso",
      });
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível criar o pedido",
        variant: "destructive",
      });
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: async (data: OrderFormData) => {
      if (!order) return;
      return apiRequest("PUT", `/api/orders/${order.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Pedido atualizado",
        description: "O pedido foi atualizado com sucesso.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o pedido.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: OrderFormData) => {
    if (order) {
      updateOrderMutation.mutate(data);
    } else {
      createOrderMutation.mutate(data);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Pedido</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tableNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mesa</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Número da mesa" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cliente</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nome do cliente (opcional)" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="items"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Itens (JSON)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder='[{"menuItemId": 1, "name": "Item", "quantity": 1, "price": 10.99}]'
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      step="0.01"
                      placeholder="0.00" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="preparing">Preparando</SelectItem>
                      <SelectItem value="ready">Pronto</SelectItem>
                      <SelectItem value="served">Servido</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observações do pedido" 
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={updateOrderMutation.isPending || createOrderMutation.isPending}>
                {(updateOrderMutation.isPending || createOrderMutation.isPending) ? "Salvando..." : order ? "Atualizar" : "Criar Pedido"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
