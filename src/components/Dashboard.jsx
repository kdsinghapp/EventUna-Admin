import { useState, useEffect } from "react"
import {
  FaStore,
  FaCog,
  FaUsers,
  FaChartLine,
  FaServer,
  FaDatabase,
  FaNetworkWired
} from "react-icons/fa"
import API from "../api/axios"

const Dashboard = ({ setActiveSection }) => {
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

  const [merchants, setMerchants] = useState([])
  const [loadingMerchants, setLoadingMerchants] = useState(true)
  const [categorySplit, setCategorySplit] = useState([])
  const [totalListings, setTotalListings] = useState(0)
  const [loadingSplit, setLoadingSplit] = useState(true)

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        console.log("Calling API.get('/admin/dashboard-stats')...");
        const res = await API.get("/admin/dashboard-stats")
        console.log("API response data:", res.data)
        if (res.data && res.data.status) {
          const { merchants: merchantsStat, users, events } = res.data.data
          console.log("Extracted data:", { merchants: merchantsStat, users, events })
          setStats((prev) =>
            prev.map((stat) => {
              if (stat.title === "Total Merchants") {
                return { ...stat, value: (merchantsStat?.allTotal || 0).toLocaleString() }
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

    async function fetchMerchants() {
      try {
        setLoadingMerchants(true)
        console.log("Calling API.get('/admin/all-merchants')...")
        const res = await API.get("/admin/all-merchants")
        console.log("Merchants API response data:", res.data)
        if (res.data && res.data.merchants) {
          // Sort by createdAt descending (most recent first)
          const sorted = [...res.data.merchants].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
          setMerchants(sorted)
        }
      } catch (error) {
        console.error("Error fetching merchants:", error)
      } finally {
        setLoadingMerchants(false)
      }
    }

    async function fetchCategorySplit() {
      try {
        setLoadingSplit(true)
        console.log("Calling API.get('/admin/service-category-split')...")
        const res = await API.get("/admin/service-category-split")
        console.log("Category split API response data:", res.data)
        if (res.data && res.data.status) {
          setCategorySplit(res.data.data || [])
          setTotalListings(res.data.totalListings || 0)
        }
      } catch (error) {
        console.error("Error fetching service category split:", error)
      } finally {
        setLoadingSplit(false)
      }
    }

    fetchDashboardStats()
    fetchMerchants()
    fetchCategorySplit()
  }, [])

  // Relative time helper
  const getRelativeTime = (dateString) => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now - date
      if (isNaN(diffMs)) return ""

      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMins / 60000)
      const diffDays = Math.floor(diffHours / 24)

      if (diffMins < 1) return "Just now"
      if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
      if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    } catch (e) {
      return ""
    }
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
              {loadingSplit ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-2 text-slate-400">
                  <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs">Loading split data...</span>
                </div>
              ) : categorySplit.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400 font-medium">
                  No service categories found.
                </div>
              ) : (
                categorySplit.map((category, idx) => {
                  const colors = [
                    { color: "bg-indigo-500", track: "bg-indigo-50" },
                    { color: "bg-emerald-500", track: "bg-emerald-50" },
                    { color: "bg-cyan-500", track: "bg-cyan-50" },
                    { color: "bg-amber-500", track: "bg-amber-50" },
                    { color: "bg-pink-500", track: "bg-pink-50" },
                    { color: "bg-purple-500", track: "bg-purple-50" },
                    { color: "bg-rose-500", track: "bg-rose-50" },
                    { color: "bg-teal-500", track: "bg-teal-50" }
                  ]
                  const colorPair = colors[idx % colors.length]
                  return (
                    <div key={category._id || idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{category.categoryName}</span>
                        <span className="text-slate-400">
                          {category.count} <span className="text-3xs">({category.percentage}%)</span>
                        </span>
                      </div>
                      <div className={`w-full h-2 rounded-full ${colorPair.track}`}>
                        <div
                          className={`h-full rounded-full ${colorPair.color} transition-all duration-500`}
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Total listings: {totalListings} services</span>
            <span
              onClick={() => setActiveSection && setActiveSection("add-event-type")}
              className="font-semibold text-indigo-600 cursor-pointer hover:underline"
            >
              View Categories
            </span>
          </div>
        </div>
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Merchant Applications</h3>
              <p className="text-xs text-slate-400 mt-0.5">Merchants awaiting panel approval status.</p>
            </div>
            <button
              onClick={() => setActiveSection && setActiveSection("all-merchants")}
              className="text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-all"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {loadingMerchants ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-2 text-slate-400">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs">Loading applications...</span>
              </div>
            ) : merchants.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400 font-medium">
                No recent merchant applications found.
              </div>
            ) : (
              merchants.slice(0, 5).map((item, index) => {
                const name = item.serviceName || item.fullName || item.email || "Unknown Merchant"
                const { initials, gradient } = getAvatarStyle(name)
                const status = item.applicationStatus || "pending"
                const timeStr = getRelativeTime(item.createdAt) || "recently"

                return (
                  <div
                    key={item._id || index}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/40 transition-all shadow-2xs"
                  >
                    <div className="flex items-center space-x-3.5">
                      {/* Avatar Initials with nice Gradient */}
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                        {initials}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-800">{name}</p>
                        <p className="text-xs text-slate-400">{timeStr}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-2xs font-bold uppercase tracking-wider border ${status === "approved"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : status === "rejected"
                            ? "bg-rose-50 text-rose-750 border-rose-100"
                            : status === "pending"
                              ? "bg-amber-50 text-amber-700 border-amber-100"
                              : "bg-slate-50 text-slate-650 border-slate-100"
                          }`}
                      >
                        {status}
                      </span>
                      <button
                        onClick={() => setActiveSection && setActiveSection("all-merchants")}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 rounded-lg px-2.5 py-1 bg-white hover:bg-slate-50"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

