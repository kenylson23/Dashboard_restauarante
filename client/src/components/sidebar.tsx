import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Armchair, 
  BookOpen, 
  Package, 
  BarChart3, 
  Users, 
  UserCheck,
  Utensils
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Pedidos", href: "/orders", icon: ClipboardList },
  { name: "Mesas", href: "/tables", icon: Armchair },
  { name: "Cardápio", href: "/menu", icon: BookOpen },
  { name: "Estoque", href: "/inventory", icon: Package },
  { name: "Relatórios", href: "/reports", icon: BarChart3 },
  { name: "Funcionários", href: "/staff", icon: Users },
  { name: "Clientes", href: "/customers", icon: UserCheck },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Utensils className="text-primary mr-2" size={28} />
          RestaurantPro
        </h1>
      </div>
      
      <nav className="mt-8">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={cn(
                "flex items-center px-6 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "text-primary bg-blue-50 border-r-4 border-primary"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              )}
            >
              <Icon className="mr-3" size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
