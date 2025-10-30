import { useState, useEffect } from "react";

const Dashboard = () => {
  const [stats, setStats] = useState([
    { title: "Total Merchants", value: "-", change: "+0%", color: "bg-blue-500" },
    { title: "Active Services", value: "89", change: "+5%", color: "bg-green-500" },
    { title: "Total Users", value: "2,341", change: "+18%", color: "bg-purple-500" },
    { title: "Pending Approvals", value: "23", change: "-3%", color: "bg-orange-500" },
  ]);

  useEffect(() => {
    // Simulate API call for merchants
    async function fetchMerchantStats() {
      // Replace with actual API call
      const response = {
        totalMerchants: 2,
      };
      setStats(prev => prev.map(stat =>
        stat.title === "Total Merchants"
          ? { ...stat, value: response.totalMerchants }
          : stat
      ));
    }
    fetchMerchantStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className={`text-sm mt-2 ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <div className="w-6 h-6 bg-white rounded opacity-30"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Merchant Applications</h3>
          <div className="space-y-4">
            {[
              { name: "ABC Catering Services", status: "pending", time: "2 hours ago" },
              { name: "XYZ Event Planners", status: "approved", time: "5 hours ago" },
              { name: "Party Decorators Inc", status: "pending", time: "1 day ago" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.time}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === "approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Server Status</span>
              <span className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database</span>
              <span className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">API Status</span>
              <span className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
