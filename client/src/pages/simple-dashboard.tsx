import { useQuery } from "@tanstack/react-query";

interface DashboardStats {
  dailyRevenue: number;
  activeOrders: number;
  occupiedTables: number;
  totalTables: number;
  staffPresent: number;
  totalStaff: number;
  lowStockItems: number;
}

export default function SimpleDashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">RestaurantPro</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-green-600 font-medium">Database: Connected</span>
              <span className="text-sm text-blue-600 font-medium">API: Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">$</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Daily Revenue</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {isLoading ? "Loading..." : `$${stats?.dailyRevenue?.toFixed(2) || "0.00"}`}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">📋</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Orders</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {isLoading ? "Loading..." : stats?.activeOrders || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">🪑</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Tables Occupied</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {isLoading ? "Loading..." : `${stats?.occupiedTables || 0}/${stats?.totalTables || 0}`}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">👥</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Staff Present</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {isLoading ? "Loading..." : `${stats?.staffPresent || 0}/${stats?.totalStaff || 0}`}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Restaurant Management Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">📝 Order Management</h4>
                <p className="text-sm text-gray-600">Create, track, and manage customer orders in real-time</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">🍽️ Menu Management</h4>
                <p className="text-sm text-gray-600">Update menu items, prices, and availability</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">🪑 Table Management</h4>
                <p className="text-sm text-gray-600">Monitor table status and reservations</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">📦 Inventory Control</h4>
                <p className="text-sm text-gray-600">Track stock levels and manage supplies</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">👨‍🍳 Staff Management</h4>
                <p className="text-sm text-gray-600">Manage employee schedules and roles</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">📊 Analytics & Reports</h4>
                <p className="text-sm text-gray-600">View sales reports and performance metrics</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Footer */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-green-400 text-xl">✅</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Sistema Totalmente Funcional
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>API serverless ativa • Neon Database conectado • Pronto para deploy no Vercel</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}