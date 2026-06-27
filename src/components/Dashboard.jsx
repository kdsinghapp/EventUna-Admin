import { useState, useEffect } from "react"
import { FaStore, FaCog, FaUsers, FaCheckCircle, FaExclamationCircle } from "react-icons/fa"

const Dashboard = () => {
  const [stats, setStats] = useState([
    { title: "Total Merchants", value: "-", trend: "up", color: "from-indigo-500 to-indigo-600", icon: <FaStore /> },
    { title: "Active Services", value: "89", trend: "up", color: "from-emerald-500 to-emerald-600", icon: <FaCog /> },
    { title: "Total Users", value: "2,341", trend: "up", color: "from-cyan-500 to-cyan-600", icon: <FaUsers /> },

  ])

  useEffect(() => {
    // Simulate API call for merchants
    async function fetchMerchantStats() {
      // Replace with actual API call
      const response = {
        totalMerchants: 2,
      }
      setStats((prev) =>
        prev.map((stat) =>
          stat.title === "Total Merchants" ? { ...stat, value: response.totalMerchants } : stat
        )
      )
    }
    fetchMerchantStats()
  }, [])

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Overview Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time metrics, analytics, and service activity.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-slate-150 p-6 hover-lift relative overflow-hidden shadow-sm"
          >
            {/* Background Accent Blob */}
            <div className={`absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-5 rounded-full blur-xl`}></div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                <p className="text-3xl font-extrabold text-slate-800 mt-2.5 tracking-tight">{stat.value}</p>
                <p className="text-xs mt-2.5 flex items-center gap-1">
                  <span className={`font-semibold ${stat.trend === "up" ? "text-emerald-600" : "text-amber-600"}`}>
                    {stat.change}
                  </span>
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-md shadow-indigo-500/10`}>
                <span className="text-xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-150 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Merchant Applications</h3>
              <p className="text-xs text-slate-400 mt-0.5">Merchants awaiting panel approval status.</p>
            </div>
            <button className="text-xs font-semibold text-indigo-650 hover:text-indigo-700 transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {[
              { name: "ABC Catering Services", status: "pending", time: "2 hours ago" },
              { name: "XYZ Event Planners", status: "approved", time: "5 hours ago" },
              { name: "Party Decorators Inc", status: "pending", time: "1 day ago" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-50 hover:bg-slate-50/50 transition-all"
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.status === "approved" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    }`}>
                    {item.status === "approved" ? <FaCheckCircle /> : <FaExclamationCircle />}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-450">{item.time}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${item.status === "approved"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">System Status</h3>
            <p className="text-xs text-slate-400 mb-6">Connection health and services state.</p>
            <div className="space-y-5">
              {[
                { name: "Server Node API", status: "Online" },
                { name: "Main Database Instance", status: "Connected" },
                { name: "Microservices Bridge", status: "Operational" },
              ].map((sys, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-sm font-medium text-slate-700">{sys.name}</span>
                  <span className="flex items-center text-xs font-bold text-emerald-600">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-2 shadow-sm animate-pulse"></div>
                    {sys.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-400 font-medium">All systems operational</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
