export default function SimpleDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">RestaurantPro Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">API Status</h2>
          <p className="text-green-600">✅ API funcionando</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Database</h2>
          <p className="text-green-600">✅ Neon Database conectado</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Deploy Status</h2>
          <p className="text-blue-600">🚀 Pronto para Vercel</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Features</h2>
          <p className="text-gray-600">Menu, Orders, Tables, Inventory</p>
        </div>
      </div>
    </div>
  );
}