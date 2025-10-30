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

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Merchant Management
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1 rounded-lg text-sm font-medium border ${
              statusFilter === "all"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-3 py-1 rounded-lg text-sm font-medium border ${
              statusFilter === "pending"
                ? "bg-yellow-500 text-white border-yellow-500"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter("approved")}
            className={`px-3 py-1 rounded-lg text-sm font-medium border ${
              statusFilter === "approved"
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setStatusFilter("rejected")}
            className={`px-3 py-1 rounded-lg text-sm font-medium border ${
              statusFilter === "rejected"
                ? "bg-red-600 text-white border-red-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Merchants Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All Merchants ({merchants.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Merchant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {merchants
                .filter((merchant) => {
                  if (statusFilter === "all") return true;
                  return (
                    (merchant.applicationStatus || merchant.status) ===
                    statusFilter
                  );
                })
                .map((merchant) => (
                  <tr
                    key={merchant._id || merchant.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {merchant.serviceName ||
                          merchant.name ||
                          merchant.businessName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {merchant.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          merchant.applicationStatus
                        )}`}
                      >
                        {merchant.applicationStatus || merchant.status}
                      </span>
                      {merchant.applicationStatus === "rejected" &&
                        merchant.rejectionReason && (
                          <Tippy
                            content={
                              <span className="text-sm text-red-600 font-medium">
                                {merchant.rejectionReason}
                              </span>
                            }
                            placement="top"
                            arrow={true}
                            theme="light-border"
                            animation="scale"
                            delay={[100, 100]}
                            interactive={true}
                          >
                            <div className="text-xs text-red-500 mt-1 cursor-pointer underline decoration-dotted decoration-2 underline-offset-2">
                              Reason:{" "}
                              {merchant.rejectionReason.length > 40
                                ? merchant.rejectionReason.slice(0, 40) + "..."
                                : merchant.rejectionReason}
                            </div>
                          </Tippy>
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {merchant.createdAt
                        ? new Date(merchant.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {merchant.applicationStatus === "pending" && (
                        <>
                          <button
                            onClick={() => openModal(merchant, "approve")}
                            disabled={updating}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openModal(merchant, "reject")}
                            disabled={updating}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => {
                          setSelectedMerchant(merchant);
                          setShowDetails(true);
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approve/Reject Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {actionType === "approve"
                ? "Approve Merchant"
                : "Reject Merchant"}
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to {actionType}{" "}
              <strong>
                {selectedMerchant?.serviceName ||
                  selectedMerchant?.name ||
                  selectedMerchant?.businessName}
              </strong>
              ?
            </p>

            {actionType === "reject" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Please provide a reason for rejection..."
                />
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={updating}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
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
                disabled={updating}
                className={`px-4 py-2 rounded-md text-white disabled:opacity-50 ${
                  actionType === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {updating
                  ? "Processing..."
                  : actionType === "approve"
                  ? "Approve"
                  : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedMerchant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Merchant Details
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Email:</strong> {selectedMerchant.email}
              </div>
              <div>
                <strong>Mobile:</strong> {selectedMerchant.mobile}
              </div>

              <div>
                <strong>Status:</strong> {selectedMerchant.applicationStatus}
              </div>
              <div>
                <strong>Is Verified:</strong>{" "}
                {selectedMerchant.isVerified ? "Yes" : "No"}
              </div>
              <div>
                <strong>Is Active:</strong>{" "}
                {selectedMerchant.isActive ? "Yes" : "No"}
              </div>
              <div>
                <strong>Created At:</strong>{" "}
                {selectedMerchant.createdAt
                  ? new Date(selectedMerchant.createdAt).toLocaleString()
                  : "-"}
              </div>
              <div>
                <strong>Updated At:</strong>{" "}
                {selectedMerchant.updatedAt
                  ? new Date(selectedMerchant.updatedAt).toLocaleString()
                  : "-"}
              </div>
              <div>
                <strong>Service Name:</strong>{" "}
                {selectedMerchant.serviceId?.servicesName ||
                  selectedMerchant.serviceName ||
                  "-"}
              </div>
              <div>
                <strong>Subcategories:</strong>{" "}
                {selectedMerchant.serviceSubcategoryIds &&
                selectedMerchant.serviceSubcategoryIds.length > 0
                  ? selectedMerchant.serviceSubcategoryIds.map((sub, i) => (
                      <span key={i}>
                        {sub.servicesName || sub.name}
                        {i < selectedMerchant.serviceSubcategoryIds.length - 1
                          ? ", "
                          : ""}
                      </span>
                    ))
                  : "-"}
              </div>
              <div>
                <strong>Online Reservation:</strong>{" "}
                {selectedMerchant.onlineReservation ? "Yes" : "No"}
              </div>
              <div>
                <strong>Coupons:</strong>{" "}
                {selectedMerchant.couponIds &&
                selectedMerchant.couponIds.length > 0
                  ? selectedMerchant.couponIds.join(", ")
                  : "-"}
              </div>
              <div>
                <strong>Rejection Reason:</strong>{" "}
                {selectedMerchant.rejectionReason || "-"}
              </div>
              <div>
                <strong>Application History:</strong>
                {selectedMerchant.applicationHistory &&
                selectedMerchant.applicationHistory.length > 0 ? (
                  <ul className="list-disc ml-5">
                    {selectedMerchant.applicationHistory.map((item, idx) => (
                      <li key={item._id || idx} className="mb-1">
                        <div>
                          <span className="font-medium">{item.status}</span> -{" "}
                          {item.date
                            ? new Date(item.date).toLocaleString()
                            : "-"}
                          <br />
                          {item.description}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  " -"
                )}
              </div>
              <div>
                <strong>Locations:</strong>
                {selectedMerchant.serviceLocationIds &&
                selectedMerchant.serviceLocationIds.length > 0 ? (
                  <div className="space-y-3 mt-1">
                    {selectedMerchant.serviceLocationIds.map((loc, idx) => (
                      <div
                        key={loc._id || idx}
                        className="border rounded p-2 bg-gray-50"
                      >
                        <div>
                          <strong>Address Name:</strong> {loc.addressName}
                        </div>
                        <div>
                          <strong>Address:</strong> {loc.address}
                        </div>
                        <div>
                          <strong>Latitude:</strong> {loc.lat}
                        </div>
                        <div>
                          <strong>Longitude:</strong> {loc.long}
                        </div>
                        {loc.locationPhone && (
                          <div>
                            <strong>Phone:</strong> {loc.locationPhone}
                          </div>
                        )}
                        {loc.capacity && (
                          <div>
                            <strong>Capacity:</strong> {loc.capacity}
                          </div>
                        )}
                        {loc.floorPlan && (
                          <div>
                            <strong>Floor Plan:</strong>{" "}
                            <a
                              href={loc.floorPlan}
                              className="text-blue-600 underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {loc.floorPlan}
                            </a>
                          </div>
                        )}
                        <div>
                          <strong>Created At:</strong>{" "}
                          {loc.createdAt
                            ? new Date(loc.createdAt).toLocaleString()
                            : "-"}
                        </div>
                        <div>
                          <strong>Updated At:</strong>{" "}
                          {loc.updatedAt
                            ? new Date(loc.updatedAt).toLocaleString()
                            : "-"}
                        </div>
                        <div>
                          <strong>Weekly Schedule:</strong>{" "}
                          {loc.weeklySchedule &&
                          loc.weeklySchedule.length > 0 ? (
                            <ul className="list-disc ml-5">
                              {loc.weeklySchedule.map((ws, i) => (
                                <li key={ws._id || i}>
                                  <span className="font-medium">{ws.day}:</span>{" "}
                                  Morning: {ws.morning?.from} - {ws.morning?.to}
                                  , Evening: {ws.evening?.from} -{" "}
                                  {ws.evening?.to}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            " -"
                          )}
                        </div>
                        <div>
                          <strong>Photos/Videos:</strong>{" "}
                          {loc.locationPhotoVideoList &&
                          loc.locationPhotoVideoList.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {loc.locationPhotoVideoList.map((media, mIdx) => (
                                <div
                                  key={media._id || mIdx}
                                  className="border rounded p-1 bg-white"
                                >
                                  <div>
                                    <strong>
                                      {media.mediaType === "photo"
                                        ? "Photo"
                                        : "Video"}
                                      :
                                    </strong>{" "}
                                    {media.file}
                                  </div>
                                  {media.mediaType === "video" &&
                                    media.thumbnail && (
                                      <div>
                                        <strong>Thumbnail:</strong>{" "}
                                        {media.thumbnail}
                                      </div>
                                    )}
                                  <div>
                                    <strong>Description:</strong>{" "}
                                    {media.description}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            " -"
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  " -"
                )}
              </div>
              {selectedMerchant.allCoupons && selectedMerchant.allCoupons.length > 0 && (
                <div>
                  <h4>All Coupons:</h4>
                  <ul>
                    {selectedMerchant.allCoupons.map(coupon => (
                      <li key={coupon._id}>
                        <strong>{coupon.couponName}</strong> - {coupon.discount}% off<br />
                        Valid: {coupon.validFrom} to {coupon.validTo}<br />
                        Description: {coupon.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantManagement;
