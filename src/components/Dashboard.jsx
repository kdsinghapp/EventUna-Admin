import { useState, useEffect } from "react"
import {
  FaStore,
  FaCog,
  FaUsers,
  FaPlus,
  FaSlidersH,
  FaChartLine,
  FaArrowUp,
  FaServer,
  FaDatabase,
  FaNetworkWired
} from "react-icons/fa"
import API from "../api/axios"

const Dashboard = () => {
  const [stats, setStats] = useState([
    {
      title: "Total Merchants",
      value: "-",
      change: "+12.4%",
      trend: "up",
      color: "from-indigo-500 to-indigo-600",
      accent: "indigo",
      icon: <FaStore />,
      sparkline: [10, 15, 8, 20, 18, 25, 28]
    },
    {
      title: "Total Events",
      value: "-",
      change: "+4.8%",
      trend: "up",
      color: "from-emerald-500 to-emerald-600",
      accent: "emerald",
      icon: <FaCog />,
      sparkline: [50, 60, 55, 70, 65, 80, 89]
    },
    {
      title: "Total Users",
      value: "-",
      change: "+18.2%",
      trend: "up",
      color: "from-cyan-500 to-cyan-600",
      accent: "cyan",
      icon: <FaUsers />,
      sparkline: [1200, 1500, 1400, 1800, 2000, 2200, 2341]
    }
  ])

  const [greeting, setGreeting] = useState("Good afternoon")
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    // Set greeting based on time
    const hr = new Date().getHours()
    if (hr < 12) setGreeting("Good morning")
    else if (hr < 17) setGreeting("Good afternoon")
    else setGreeting("Good evening")

    // Set formatted date
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    setCurrentDate(new Date().toLocaleDateString(undefined, options))

    async function fetchDashboardStats() {
      try {
        console.log("Calling API.get('/admin/dashboard-stats')...");
        const res = await API.get("/admin/dashboard-stats")
        console.log("API response data:", res.data)
        if (res.data && res.data.status) {
          const { merchants, users, events } = res.data.data
          console.log("Extracted data:", { merchants, users, events })
          setStats((prev) =>
            prev.map((stat) => {
              if (stat.title === "Total Merchants") {
                return { ...stat, value: (merchants?.allTotal || 0).toLocaleString() }
              }
              if (stat.title === "Total Events") {
                return { ...stat, value: (events?.allTotal || 0).toLocaleString() }
              }
              if (stat.title === "Total Users") {
                return { ...stat, value: (users?.allTotal || 0).toLocaleString() }
              }
              return stat
            })
          )
        } else {
          console.warn("API returned status false or empty data", res.data)
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      }
    }
    fetchDashboardStats()
  }, [])

  // Helper to generate SVG path for sparklines
  const getSparklinePath = (data, width = 120, height = 36) => {
    if (!data || data.length === 0) return ""
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1

    return data
      .map((val, index) => {
        const x = (index / (data.length - 1)) * width
        const y = height - ((val - min) / range) * (height - 6) - 3
        return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`
      })
      .join(" ")
  };

  // Helper to generate SVG area path for sparkline gradient fills
  const getSparklineAreaPath = (data, width = 120, height = 36) => {
    const linePath = getSparklinePath(data, width, height)
    if (!linePath) return ""
    return `${linePath} L ${width} ${height} L 0 ${height} Z`
  }

  // Get merchant avatar initials and gradient color
  const getAvatarStyle = (name) => {
    const initials = name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    const colors = [
      "from-pink-500 to-rose-500",
      "from-purple-500 to-indigo-500",
      "from-blue-500 to-cyan-500",
      "from-teal-500 to-emerald-500",
      "from-amber-500 to-orange-500"
    ]
    const index = name.charCodeAt(0) % colors.length
    return { initials, gradient: colors[index] }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1 py-2">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-slate-100 p-6 hover-lift relative overflow-hidden shadow-sm flex flex-col justify-between"
          >
            {/* Top row with Title and Icon */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                <p className="text-3.5xl font-extrabold text-slate-800 mt-2 tracking-tight">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                <span className="text-lg">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Registrations Custom SVG Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Registration Performance</h3>
              <p className="text-xs text-slate-400 mt-0.5">Weekly new user and merchant sign-ups.</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-indigo-600">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Users
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Merchants
              </span>
            </div>
          </div>

          {/* SVG Bar Chart Visuals */}
          <div className="h-56 flex items-end justify-between gap-2 px-2 pt-4 relative">
            {/* Grid Line Guides */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
              {[0, 1, 2, 3].map((_, i) => (
                <div key={i} className="w-full border-t border-slate-100 border-dashed h-0"></div>
              ))}
            </div>

            {/* Custom SVG/CSS Bars */}
            {[
              { day: "Mon", users: 40, merchants: 20 },
              { day: "Tue", users: 65, merchants: 30 },
              { day: "Wed", users: 95, merchants: 15 },
              { day: "Thu", users: 50, merchants: 45 },
              { day: "Fri", users: 80, merchants: 35 },
              { day: "Sat", users: 110, merchants: 60 },
              { day: "Sun", users: 85, merchants: 40 }
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center z-10 group cursor-pointer h-full justify-end">
                <div className="flex items-end gap-1.5 w-full justify-center h-44 mb-2">
                  {/* User Bar */}
                  <div
                    style={{ height: `${(bar.users / 120) * 100}%` }}
                    className="w-3 md:w-4 bg-indigo-500 rounded-t-md hover:bg-indigo-600 transition-all duration-300 relative group-hover:scale-y-105 origin-bottom"
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-3xs px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-20 pointer-events-none">
                      {bar.users}
                    </div>
                  </div>
                  {/* Merchant Bar */}
                  <div
                    style={{ height: `${(bar.merchants / 120) * 100}%` }}
                    className="w-3 md:w-4 bg-emerald-500 rounded-t-md hover:bg-emerald-600 transition-all duration-300 relative group-hover:scale-y-105 origin-bottom"
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-3xs px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-20 pointer-events-none">
                      {bar.merchants}
                    </div>
                  </div>
                </div>
                <span className="text-2xs font-bold text-slate-400 group-hover:text-slate-700 transition-colors">
                  {bar.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Categories Segmented Radial / Progress Bars */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Service Category Split</h3>
                <p className="text-xs text-slate-400 mt-0.5">Top performing event types.</p>
              </div>
              <FaChartLine className="text-indigo-500" />
            </div>

            <div className="space-y-4.5">
              {[
                { name: "Catering Services", percentage: 45, count: 40, color: "bg-indigo-500", track: "bg-indigo-50" },
                { name: "Decorations & Setup", percentage: 30, count: 27, color: "bg-emerald-500", track: "bg-emerald-50" },
                { name: "Venue Bookings", percentage: 15, count: 13, color: "bg-cyan-500", track: "bg-cyan-50" },
                { name: "Photography & Audio", percentage: 10, count: 9, color: "bg-amber-500", track: "bg-amber-50" }
              ].map((category, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{category.name}</span>
                    <span className="text-slate-400">
                      {category.count} <span className="text-3xs">({category.percentage}%)</span>
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${category.track}`}>
                    <div
                      className={`h-full rounded-full ${category.color} transition-all duration-500`}
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Total listings: 89 services</span>
            <span className="font-semibold text-indigo-650 cursor-pointer hover:underline">View Categories</span>
          </div>
        </div>
      </div>

      {/* Recent Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Merchant Applications</h3>
              <p className="text-xs text-slate-400 mt-0.5">Merchants awaiting panel approval status.</p>
            </div>
            <button className="text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-all">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {[
              { name: "ABC Catering Services", status: "pending", time: "2 hours ago" },
              { name: "XYZ Event Planners", status: "approved", time: "5 hours ago" },
              { name: "Party Decorators Inc", status: "pending", time: "1 day ago" }
            ].map((item, index) => {
              const { initials, gradient } = getAvatarStyle(item.name)
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/40 transition-all shadow-2xs"
                >
                  <div className="flex items-center space-x-3.5">
                    {/* Avatar Initials with nice Gradient */}
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                      {initials}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-400">{item.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-2xs font-bold uppercase tracking-wider border ${item.status === "approved"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-amber-50 text-amber-700 border-amber-100"
                        }`}
                    >
                      {item.status}
                    </span>
                    <button className="text-xs font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 rounded-lg px-2.5 py-1 bg-white hover:bg-slate-50">
                      Review
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Improved System Health & Status */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">System Health</h3>
            <p className="text-xs text-slate-400 mb-6">Connection health and services state.</p>

            <div className="space-y-4">
              {[
                { name: "Server Node API", status: "Online", latency: "24ms", icon: <FaServer className="text-indigo-500" /> },
                { name: "Main Database Instance", status: "Connected", latency: "12ms", icon: <FaDatabase className="text-emerald-500" /> },
                { name: "Microservices Bridge", status: "Operational", latency: "45ms", icon: <FaNetworkWired className="text-cyan-500" /> }
              ].map((sys, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-2xs flex items-center justify-center border border-slate-100 text-sm">
                      {sys.icon}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">{sys.name}</span>
                      <span className="text-3xs text-slate-400 font-medium">Ping: {sys.latency}</span>
                    </div>
                  </div>
                  <span className="flex items-center text-2xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                    {sys.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Performance Metrics Bars */}
            <div className="mt-6 pt-5 border-t border-slate-100 space-y-3.5">
              <div className="space-y-1">
                <div className="flex justify-between text-2xs font-bold text-slate-500">
                  <span>API LATENCY LOAD</span>
                  <span className="text-slate-700">14%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: "14%" }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-2xs font-bold text-slate-500">
                  <span>DB IOPS USAGE</span>
                  <span className="text-slate-700">32%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "32%" }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 text-center">
            <span className="text-2xs text-slate-400 font-bold uppercase tracking-wider">
              All infrastructure healthy
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

