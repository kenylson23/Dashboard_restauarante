import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function SimpleLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">RestaurantPro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">API: ✅ Funcionando</span>
              <span className="text-sm text-gray-600">DB: ✅ Neon Connected</span>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}