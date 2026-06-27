"use client";
import { useState, useEffect } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import apiService from "../services/api";

const MerchantManagement = () => {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [reason, setReason] = useState("");
  const [updating, setUpdating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAllMerchants();
      setMerchants(response.merchants || response.data || []);
    } catch (err) {
      setError("Failed to fetch merchants. Please try again.");
      console.error("Error fetching merchants:", err);
      setMerchants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    merchantId,
    newStatus,
    rejectionReason = ""
  ) => {
    try {
      setUpdating(true);
      await apiService.updateMerchantApproval(
        merchantId,
        newStatus,
        rejectionReason
      );
      setMerchants((prev) =>
        prev.map((merchant) =>
          merchant._id === merchantId || merchant.id === merchantId
            ? { ...merchant, applicationStatus: newStatus, rejectionReason }
            : merchant
        )
      );
      setShowModal(false);
      setReason("");
      // Update selected merchant state too if currently viewing details
      if (selectedMerchant && (selectedMerchant._id === merchantId || selectedMerchant.id === merchantId)) {
        setSelectedMerchant(prev => ({
          ...prev,
          applicationStatus: newStatus,
          rejectionReason
        }));
      }
    } catch (err) {
      setError("Failed to update merchant status. Please try again.");
      console.error("Error updating merchant:", err);
    } finally {
      setUpdating(false);
    }
  };

  const openModal = (merchant, action) => {
    setSelectedMerchant(merchant);
    setActionType(action);
    setShowModal(true);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "approved":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200/60";
      case "rejected":
        return "bg-rose-50 text-rose-700 border border-rose-200/60";
      case "pending":
        return "bg-amber-50 text-amber-700 border border-amber-200/60";
      default:
        return "bg-slate-50 text-slate-700 border border-slate-200/60";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
        <p className="text-sm font-medium text-slate-500 animate-pulse">Loading merchants data...</p>
      </div>
    );
  }

  // Deduplicate and gather coupons to render cleanly
  const getMerchantCoupons = (merchant) => {
    const couponsMap = new Map();
    
    // Add from couponIds
    if (Array.isArray(merchant.couponIds)) {
      merchant.couponIds.forEach(c => {
        if (c && typeof c === "object" && c._id) {
          couponsMap.set(c._id, c);
        }
      });
    }
    
    // Add from allCoupons
    if (Array.isArray(merchant.allCoupons)) {
      merchant.allCoupons.forEach(c => {
        if (c && typeof c === "object" && c._id) {
          couponsMap.set(c._id, c);
        }
      });
    }
    
    return Array.from(couponsMap.values());
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Merchant Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review, approve, and manage registered merchant profiles.
          </p>
        </div>
        
        {/* Modern Filter Pill Buttons */}
        <div className="flex flex-wrap gap-1 bg-slate-100/80 p-1 rounded-lg self-start md:self-auto border border-slate-200/40">
          {[
            { id: "all", label: "All", count: merchants.length },
            { id: "pending", label: "Pending", count: merchants.filter(m => (m.applicationStatus || m.status) === "pending").length },
            { id: "approved", label: "Approved", count: merchants.filter(m => (m.applicationStatus || m.status) === "approved").length },
            { id: "rejected", label: "Rejected", count: merchants.filter(m => (m.applicationStatus || m.status) === "rejected").length }
          ].map((filterTab) => (
            <button
              key={filterTab.id}
              onClick={() => setStatusFilter(filterTab.id)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 border focus:outline-none ${
                statusFilter === filterTab.id
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-transparent text-slate-500 border-transparent hover:text-slate-800"
              }`}
            >
              {filterTab.label}
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                statusFilter === filterTab.id
                  ? "bg-indigo-800/40 text-white"
                  : "bg-slate-200/60 text-slate-600"
              }`}>
                {filterTab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-2.5 rounded-xl flex items-center gap-3 text-xs animate-fade-in shadow-sm">
          <svg className="w-4 h-4 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      {/* Merchants Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Merchant / Business
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Contact Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {merchants
                .filter((merchant) => {
                  if (statusFilter === "all") return true;
                  return (
                    (merchant.applicationStatus || merchant.status) ===
                    statusFilter
                  );
                })
                .map((merchant) => {
                  const merchantName = merchant.serviceName || merchant.fullName || merchant.name || merchant.businessName || "Unnamed Merchant";
                  const status = merchant.applicationStatus || merchant.status;
                  
                  return (
                    <tr
                      key={merchant._id || merchant.id}
                      className="hover:bg-slate-50/70 transition-colors duration-150"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">
                            {merchantName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-900">
                              {merchantName}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium">
                              {merchant.serviceId?.servicesName || "No Category"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-xs text-slate-600 font-medium">{merchant.email}</div>
                        {merchant.mobile && (
                          <div className="text-[10px] text-slate-400 mt-0.5">{merchant.countryCode || ""} {merchant.mobile}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full ${getStatusBadgeClass(
                            status
                          )}`}
                        >
                          <span className={`w-1 h-1 rounded-full mr-1 ${
                            status === "approved" ? "bg-emerald-500" :
                            status === "rejected" ? "bg-rose-500" :
                            status === "pending" ? "bg-amber-500" : "bg-slate-500"
                          }`}></span>
                          {status}
                        </span>
                        
                        {status === "rejected" && merchant.rejectionReason && (
                          <Tippy
                            content={
                              <div className="px-2 py-1 max-w-xs text-xs font-medium text-slate-700 leading-relaxed bg-white">
                                {merchant.rejectionReason}
                              </div>
                            }
                            placement="top"
                            arrow={true}
                            theme="light-border"
                            animation="scale"
                            delay={[100, 100]}
                            interactive={true}
                          >
                            <div className="text-[10px] text-rose-500 mt-0.5 cursor-pointer hover:text-rose-700 transition-colors flex items-center gap-1 font-medium">
                              <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="underline decoration-dotted decoration-rose-400">View Reason</span>
                            </div>
                          </Tippy>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500 font-medium">
                        {formatDate(merchant.createdAt)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-xs font-medium space-x-3">
                        {status === "pending" && (
                          <>
                            <button
                              onClick={() => openModal(merchant, "approve")}
                              disabled={updating}
                              className="text-emerald-600 hover:text-emerald-700 transition-colors font-semibold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => openModal(merchant, "reject")}
                              disabled={updating}
                              className="text-rose-600 hover:text-rose-700 transition-colors font-semibold"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          className="text-indigo-600 hover:text-indigo-700 transition-colors font-semibold"
                          onClick={() => {
                            setSelectedMerchant(merchant);
                            setActiveTab("overview");
                            setShowDetails(true);
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              {merchants.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400 font-medium">
                    No merchants found matching the filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approve/Reject Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-100 animate-scale-up">
            <h3 className="text-xl font-bold text-slate-950 mb-2">
              {actionType === "approve"
                ? "Approve Merchant Profile"
                : "Reject Merchant Application"}
            </h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to {actionType} the merchant profile for{" "}
              <strong className="text-slate-800">
                {selectedMerchant?.serviceName ||
                  selectedMerchant?.fullName ||
                  selectedMerchant?.name ||
                  selectedMerchant?.businessName}
              </strong>
              ? This action will notify the merchant.
            </p>

            {actionType === "reject" && (
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Rejection Reason
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm placeholder-slate-400 resize-none"
                  rows="3"
                  placeholder="Please provide details on why the application is rejected..."
                />
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={updating}
                className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleStatusUpdate(
                    selectedMerchant._id || selectedMerchant.id,
                    actionType === "approve" ? "approved" : "rejected",
                    reason
                  )
                }
                disabled={updating || (actionType === "reject" && !reason.trim())}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-sm hover:shadow disabled:opacity-50 ${
                  actionType === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {updating
                  ? "Processing..."
                  : actionType === "approve"
                  ? "Approve Application"
                  : "Reject Application"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Slide-Over or Modal */}
      {showDetails && selectedMerchant && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden border border-slate-100 flex flex-col animate-scale-up">
            
            {/* Modal Header */}
            <div className="px-6 py-5 bg-slate-50/60 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-md shadow-indigo-100">
                  {(selectedMerchant.serviceName || selectedMerchant.fullName || selectedMerchant.name || "M").substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedMerchant.serviceName || selectedMerchant.fullName || selectedMerchant.name || "Merchant Details"}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${getStatusBadgeClass(selectedMerchant.applicationStatus || selectedMerchant.status)}`}>
                      {selectedMerchant.applicationStatus || selectedMerchant.status}
                    </span>
                    <span className="text-xs text-slate-400">| Joined {formatDate(selectedMerchant.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Approve/Reject inside details header if status is pending */}
                {(selectedMerchant.applicationStatus || selectedMerchant.status) === "pending" && (
                  <div className="flex items-center gap-2 mr-2">
                    <button
                      onClick={() => openModal(selectedMerchant, "approve")}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => openModal(selectedMerchant, "reject")}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}
                
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="px-6 border-b border-slate-100 bg-white flex overflow-x-auto gap-6 scrollbar-none shrink-0">
              {[
                { id: "overview", label: "Overview", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                { id: "documents", label: "Documents & Files", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
                { id: "locations", label: `Locations (${selectedMerchant.serviceLocationIds?.length || 0})`, icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" },
                { id: "coupons", label: `Coupons (${getMerchantCoupons(selectedMerchant).length})`, icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                { id: "history", label: "History Timeline", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3.5 px-1 border-b-2 font-semibold text-xs uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id
                      ? "border-indigo-600 text-indigo-600 font-bold"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Left Column: Owner Profile & Status details */}
                  <div className="md:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col items-center text-center">
                      <div className="relative">
                        {selectedMerchant.profileImage ? (
                          <img
                            src={selectedMerchant.profileImage}
                            alt="Merchant Profile"
                            className="w-24 h-24 rounded-2xl object-cover border border-slate-100 shadow-sm"
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                          />
                        ) : null}
                        <div className="w-24 h-24 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-bold shadow-xs" style={{ display: selectedMerchant.profileImage ? 'none' : 'flex' }}>
                          {(selectedMerchant.fullName || selectedMerchant.name || "M").substring(0, 1).toUpperCase()}
                        </div>
                        {selectedMerchant.isVerified && (
                          <span className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-sm" title="Verified Account">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        )}
                      </div>
                      
                      <h4 className="text-base font-bold text-slate-900 mt-4 leading-snug">
                        {selectedMerchant.fullName || "N/A"}
                      </h4>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                        {selectedMerchant.role}
                      </p>

                      <div className="w-full border-t border-slate-100 my-4"></div>

                      <div className="w-full text-left space-y-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                          <p className="text-xs text-slate-700 font-semibold break-all">{selectedMerchant.email}</p>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mobile Number</label>
                          <p className="text-xs text-slate-700 font-semibold">
                            {selectedMerchant.countryCode || ""} {selectedMerchant.mobile || "N/A"}
                          </p>
                        </div>
                        {selectedMerchant.dob && (
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date of Birth</label>
                            <p className="text-xs text-slate-700 font-semibold">{selectedMerchant.dob}</p>
                          </div>
                        )}
                        {selectedMerchant.gender && (
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gender</label>
                            <p className="text-xs text-slate-700 font-semibold">{selectedMerchant.gender}</p>
                          </div>
                        )}
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Indicators</label>
                          <div className="flex flex-wrap gap-2 mt-1.5">
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${selectedMerchant.isVerified ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                              {selectedMerchant.isVerified ? "VERIFIED" : "UNVERIFIED"}
                            </span>
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${selectedMerchant.isActive ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                              {selectedMerchant.isActive ? "ACTIVE" : "INACTIVE"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Columns: Business and Service Details */}
                  <div className="md:col-span-2 space-y-6">
                    
                    {/* Service Info Block */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                          Service Details
                        </h4>
                        <span className="text-xs font-semibold text-slate-400">
                          ID: {selectedMerchant._id}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service Brand Name</label>
                          <p className="text-sm text-slate-800 font-bold mt-0.5">{selectedMerchant.serviceName || "N/A"}</p>
                        </div>
                        <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service Category</label>
                          <p className="text-sm text-slate-800 font-bold mt-0.5">{selectedMerchant.serviceId?.servicesName || "N/A"}</p>
                        </div>
                      </div>

                      {selectedMerchant.serviceSlogan && (
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service Slogan</label>
                          <p className="text-sm text-slate-700 italic mt-0.5 font-medium">"{selectedMerchant.serviceSlogan}"</p>
                        </div>
                      )}

                      {selectedMerchant.serviceDescription && (
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service Description</label>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{selectedMerchant.serviceDescription}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subcategories</label>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {selectedMerchant.serviceSubcategoryIds && selectedMerchant.serviceSubcategoryIds.length > 0 ? (
                              selectedMerchant.serviceSubcategoryIds.map((sub, idx) => (
                                <span key={sub._id || idx} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                                  {sub.subServicesName || sub.servicesName || sub.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400 font-medium">No Subcategories Selected</span>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Online Reservation Support</label>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${selectedMerchant.onlineReservation ? "bg-emerald-500" : "bg-slate-300"}`}></span>
                            <span className="text-xs text-slate-700 font-semibold">
                              {selectedMerchant.onlineReservation ? "Enabled / Supported" : "Disabled / Not Supported"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline summary, notes, or rejection logs */}
                    {selectedMerchant.applicationStatus === "rejected" && selectedMerchant.rejectionReason && (
                      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 shadow-xs">
                        <div className="flex items-center gap-2.5 text-rose-800 mb-2">
                          <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <h4 className="text-sm font-bold uppercase tracking-wider">Application Rejection Details</h4>
                        </div>
                        <p className="text-xs text-rose-700 leading-relaxed font-medium">
                          {selectedMerchant.rejectionReason}
                        </p>
                      </div>
                    )}

                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Profile Completed Date</label>
                        <p className="text-xs text-slate-700 font-semibold mt-1">
                          {formatDateTime(selectedMerchant.applicationHistory?.find(h => h.status === "Profile Completed")?.date)}
                        </p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Profile Update</label>
                        <p className="text-xs text-slate-700 font-semibold mt-1">
                          {formatDateTime(selectedMerchant.updatedAt)}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Documents & Links Tab */}
              {activeTab === "documents" && (
                <div className="space-y-6">
                  
                  {/* Permits and IDs info */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Registration & Permits</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Commercial Permit Number</label>
                        <p className="text-sm font-bold text-slate-800 mt-1">{selectedMerchant.commercialPermitNumber || "N/A"}</p>
                      </div>
                      <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">VAT registration Number</label>
                        <p className="text-sm font-bold text-slate-800 mt-1">{selectedMerchant.vatNumber || "N/A"}</p>
                      </div>
                      <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cuisine Details</label>
                        <p className="text-sm font-semibold text-slate-800 mt-1 capitalize">{selectedMerchant.cuisineName || "N/A"}</p>
                      </div>
                      <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone / Hotline</label>
                        <p className="text-sm font-bold text-slate-800 mt-1">{selectedMerchant.phone || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Web URLs */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Digital Links</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Website URL</label>
                        {selectedMerchant.webUrl && selectedMerchant.webUrl !== "N/A" ? (
                          <a
                            href={selectedMerchant.webUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1.5 mt-1.5 truncate underline"
                          >
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            {selectedMerchant.webUrl}
                          </a>
                        ) : (
                          <p className="text-xs text-slate-500 font-semibold mt-1.5">No website registered</p>
                        )}
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Menu / Pricing URL</label>
                        {selectedMerchant.menuUrl && selectedMerchant.menuUrl !== "No Cusine" && selectedMerchant.menuUrl !== "N/A" ? (
                          <a
                            href={selectedMerchant.menuUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1.5 mt-1.5 truncate underline"
                          >
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {selectedMerchant.menuUrl}
                          </a>
                        ) : (
                          <p className="text-xs text-slate-500 font-semibold mt-1.5">No menu registered</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Documents & Media Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: "Business Registration Document", file: selectedMerchant.businessRegistrationImage },
                      { label: "VAT Registration Document", file: selectedMerchant.vatRegistrationImage },
                      { label: "Service Banner Image", file: selectedMerchant.bannerImage },
                      { label: "Other Registration Image", file: selectedMerchant.otherImage }
                    ].map((doc, idx) => {
                      const isPdf = doc.file?.endsWith(".pdf");
                      const isImage = doc.file && !isPdf;
                      
                      return (
                        <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between h-80">
                          <div>
                            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                              {doc.label}
                            </h5>
                            
                            {doc.file ? (
                              <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 h-52 flex items-center justify-center">
                                {isImage && (
                                  <img
                                    src={doc.file}
                                    alt={doc.label}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      // If the image fails to load, e.g. because it's a relative filename, we show details
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                )}
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-4" style={{ display: isImage ? 'none' : 'flex' }}>
                                  <svg className="w-12 h-12 text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <p className="text-xs font-semibold text-slate-600 break-all text-center">
                                    {doc.file}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="rounded-xl border-2 border-dashed border-slate-200 h-52 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                                <svg className="w-8 h-8 text-slate-300 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span className="text-xs font-semibold text-slate-400">Document not uploaded</span>
                              </div>
                            )}
                          </div>
                          
                          {doc.file && (
                            <a
                              href={doc.file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full mt-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold text-center transition-colors shadow-xs"
                            >
                              Open Full Document / File
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

              {/* Locations Tab */}
              {activeTab === "locations" && (
                <div className="space-y-6">
                  {selectedMerchant.serviceLocationIds && selectedMerchant.serviceLocationIds.length > 0 ? (
                    selectedMerchant.serviceLocationIds.map((loc, idx) => (
                      <div key={loc._id || idx} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-5">
                        
                        {/* Location Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                              {idx + 1}
                            </span>
                            <div>
                              <h4 className="text-base font-bold text-slate-900 leading-tight">
                                {loc.addressName || "Registered Location"}
                              </h4>
                              {loc.createdAt && (
                                <span className="text-[10px] text-slate-400 font-semibold uppercase">Created {formatDate(loc.createdAt)}</span>
                              )}
                            </div>
                          </div>
                          
                          {loc.locationPhone && (
                            <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {loc.locationPhone}
                            </div>
                          )}
                        </div>

                        {/* Location Grid details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2 space-y-3">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Address Details</label>
                              <p className="text-xs text-slate-700 font-semibold mt-0.5">{loc.address}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Capacity (People)</label>
                                <p className="text-xs text-slate-800 font-bold mt-0.5">{loc.capacity ? `${loc.capacity} Persons` : "N/A"}</p>
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Coordinates</label>
                                <p className="text-xs text-slate-600 font-medium mt-0.5">Lat: {loc.lat?.toFixed(5) || "-"} | Long: {loc.long?.toFixed(5) || "-"}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Floor Plan Document</label>
                                {loc.floorPlan ? (
                                  <a
                                    href={loc.floorPlan}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 mt-1 underline"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    View Floor Plan Detail
                                  </a>
                                ) : (
                                  <p className="text-xs text-slate-400 font-semibold mt-1">No Floor Plan Registered</p>
                                )}
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Shifts Type</label>
                                <p className="text-xs text-slate-700 font-semibold mt-1">
                                  {loc.openTwoShifts ? "Two Shifts Mode (Morning & Evening)" : "Single Shift Mode"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Coordinates / Map Mini Placeholder */}
                          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quick Map View</span>
                              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">View location coordinates on Google Maps to confirm accuracy.</p>
                            </div>
                            {loc.lat && loc.long ? (
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.long}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-bold text-center transition-colors block mt-4"
                              >
                                View on Google Maps
                              </a>
                            ) : null}
                          </div>
                        </div>

                        {/* Weekly Schedule Grid */}
                        <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                          <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Weekly Operating Hours</h5>
                          {loc.weeklySchedule && loc.weeklySchedule.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                              {loc.weeklySchedule.map((ws, i) => {
                                const isClosed = ws.morning?.from === "00:00" && ws.morning?.to === "00:00" && ws.evening?.from === "00:00" && ws.evening?.to === "00:00";
                                
                                return (
                                  <div key={ws._id || i} className={`p-2.5 rounded-lg border text-center ${isClosed ? 'bg-slate-100/50 border-slate-200/50 text-slate-400' : 'bg-white border-slate-200/70 text-slate-700'}`}>
                                    <div className="text-xs font-bold text-slate-900 mb-1">{ws.day}</div>
                                    {isClosed ? (
                                      <div className="text-[10px] font-semibold tracking-wider text-rose-500 uppercase mt-1">Closed</div>
                                    ) : (
                                      <div className="space-y-1 mt-1 text-[10px] font-medium leading-tight">
                                        <div>
                                          <span className="block text-[8px] font-bold text-slate-400 uppercase">Morning</span>
                                          {ws.morning?.from || "-"} to {ws.morning?.to || "-"}
                                        </div>
                                        {loc.openTwoShifts && (
                                          <div className="border-t border-slate-100 pt-1">
                                            <span className="block text-[8px] font-bold text-slate-400 uppercase">Evening</span>
                                            {ws.evening?.from || "-"} to {ws.evening?.to || "-"}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 font-medium">No hours template set for this location</p>
                          )}
                        </div>

                        {/* Location Photos/Videos list */}
                        {loc.locationPhotoVideoList && loc.locationPhotoVideoList.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Location Photos & Videos</h5>
                            <div className="flex flex-wrap gap-4 mt-2">
                              {loc.locationPhotoVideoList.map((media, mIdx) => (
                                <div key={media._id || mIdx} className="bg-white border border-slate-200 rounded-xl p-2 w-full sm:w-60 shadow-xs flex flex-col justify-between">
                                  <div className="relative rounded-lg overflow-hidden bg-slate-100 h-32 flex items-center justify-center border border-slate-100">
                                    {media.mediaType === "photo" && media.file ? (
                                      <img
                                        src={media.file}
                                        alt={media.description || "Location Photo"}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                      />
                                    ) : null}
                                    
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-2" style={{ display: media.mediaType === "photo" && media.file ? 'none' : 'flex' }}>
                                      {media.mediaType === "video" ? (
                                        <svg className="w-8 h-8 text-indigo-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                      ) : (
                                        <svg className="w-8 h-8 text-slate-300 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                      )}
                                      <span className="text-[9px] font-bold uppercase tracking-wider">{media.mediaType || "Photo"}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-2 text-[10px] text-slate-500 italic line-clamp-2">
                                    {media.description || "No description provided."}
                                  </div>
                                  
                                  {media.file && (
                                    <a
                                      href={media.file}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-full mt-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-center text-[10px] font-bold rounded-lg border border-slate-200 transition-colors"
                                    >
                                      View Original
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-400 font-semibold">
                      No locations registered for this merchant.
                    </div>
                  )}
                </div>
              )}

              {/* Coupons Tab */}
              {activeTab === "coupons" && (
                <div className="space-y-6">
                  {getMerchantCoupons(selectedMerchant).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {getMerchantCoupons(selectedMerchant).map((coupon) => (
                        <div
                          key={coupon._id}
                          className={`bg-white border-2 border-dashed rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between ${
                            coupon.isActive ? "border-indigo-200/80 bg-indigo-50/10" : "border-slate-200 bg-slate-50/20"
                          }`}
                        >
                          {/* Discount tag badge */}
                          <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl shadow-xs uppercase tracking-wider">
                            {coupon.discount}% Discount
                          </div>

                          <div className="space-y-2 pr-20">
                            <span className="text-[10px] font-bold text-indigo-600 tracking-widest uppercase">Coupon Template</span>
                            <h4 className="text-base font-extrabold text-slate-900 tracking-tight leading-tight">
                              {coupon.couponName}
                            </h4>
                            {coupon.description && (
                              <p className="text-xs text-slate-500 leading-relaxed font-medium pt-1">
                                {coupon.description}
                              </p>
                            )}
                          </div>

                          <div className="w-full border-t border-slate-100 my-4"></div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="text-[10px] text-slate-400 font-semibold space-y-0.5">
                              <div>Valid From: <span className="text-slate-600 font-bold">{coupon.validFrom || "-"}</span></div>
                              <div>Valid To: <span className="text-slate-600 font-bold">{coupon.validTo || "-"}</span></div>
                            </div>
                            
                            <span className={`px-2 py-0.5 text-[9px] font-bold rounded align-self-start sm:align-self-auto border ${
                              coupon.isActive
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-400 border-slate-200"
                            }`}>
                              {coupon.isActive ? "ACTIVE COUPON" : "INACTIVE"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-400 font-semibold">
                      No coupon campaigns created by this merchant.
                    </div>
                  )}
                </div>
              )}

              {/* History Tab */}
              {activeTab === "history" && (
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Application Timeline</h4>
                  
                  {selectedMerchant.applicationHistory && selectedMerchant.applicationHistory.length > 0 ? (
                    <div className="relative border-l-2 border-slate-100 ml-3 pl-6 space-y-6">
                      {selectedMerchant.applicationHistory.map((item, idx) => {
                        const isApproved = item.status === "Approved";
                        const isRejected = item.status === "Rejected";
                        const isProfileCompleted = item.status === "Profile Completed";
                        
                        return (
                          <div key={item._id || idx} className="relative">
                            {/* Timeline bullet dot */}
                            <span className={`absolute -left-9.5 top-0.5 rounded-full w-5 h-5 border-4 border-white flex items-center justify-center shadow-sm ${
                              isApproved ? "bg-emerald-500" :
                              isRejected ? "bg-rose-500" :
                              isProfileCompleted ? "bg-indigo-500" : "bg-slate-400"
                            }`}></span>
                            
                            <div>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                <h5 className="text-sm font-bold text-slate-900 leading-tight">
                                  {item.status}
                                </h5>
                                <span className="text-[10px] text-slate-400 font-bold bg-slate-100/70 px-2 py-0.5 rounded-md">
                                  {formatDateTime(item.date)}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-400 font-semibold">
                      No history recorded for this merchant profile.
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <button
                onClick={() => setShowDetails(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantManagement;

