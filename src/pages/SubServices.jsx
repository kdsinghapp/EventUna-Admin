import { useState } from "react";
import API from "../api/axios";

export default function SubServices() {
  const [subService, setSubService] = useState("");
  const [serviceId, setServiceId] = useState("686fb6ced46e9740ee8277ec");

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post("/admin/add-subservices", { subService, serviceId });
      alert("Sub-service added successfully");
    } catch (err) {
      alert("Error: " + err.response?.data?.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Add Sub-Service</h2>
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          className="border p-2 rounded w-64"
          placeholder="Sub-service name"
          value={subService}
          onChange={(e) => setSubService(e.target.value)}
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </form>
    </div>
  );
}
