import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
// import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "./components/layout";
import Dashboard from "./pages/dashboard";
import OrdersPage from "./pages/orders";
import TablesPage from "./pages/tables";
import MenuPage from "./pages/menu";
import InventoryPage from "./pages/inventory";
import Reports from "./pages/reports";
import StaffPage from "./pages/staff";
import CustomersPage from "./pages/customers";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/orders" component={OrdersPage} />
        <Route path="/tables" component={TablesPage} />
        <Route path="/menu" component={MenuPage} />
        <Route path="/inventory" component={InventoryPage} />
        <Route path="/reports" component={Reports} />
        <Route path="/staff" component={StaffPage} />
        <Route path="/customers" component={CustomersPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <TooltipProvider> */}
        {/* <Toaster /> */}
        <Router />
      {/* </TooltipProvider> */}
    </QueryClientProvider>
  );
}

export default App;
