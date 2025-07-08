import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { SimpleLayout } from "./components/simple-layout";
import SimpleDashboard from "./pages/simple-dashboard";

function Router() {
  return (
    <SimpleLayout>
      <Switch>
        <Route path="/" component={SimpleDashboard} />
        <Route>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">API Serverless Funcionando!</h2>
            <p className="text-gray-600">RestaurantPro com Neon Database</p>
            <div className="mt-6 space-y-2">
              <p className="text-sm text-green-600">✅ API serverless pronta</p>
              <p className="text-sm text-green-600">✅ Banco Neon conectado</p>
              <p className="text-sm text-blue-600">🚀 Pronto para deploy no Vercel</p>
            </div>
          </div>
        </Route>
      </Switch>
    </SimpleLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;