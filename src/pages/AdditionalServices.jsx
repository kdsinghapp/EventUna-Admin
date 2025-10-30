import { useState } from "react";
import API from "../api/axios";

export default function AdditionalServices() {
  const [serviceName, setServiceName] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post("/admin/additional-services", { serviceName });
      alert("Service added successfully");
      setServiceName("");
    } catch (err) {
      alert("Error: " + err.response?.data?.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Add Additional Service</h2>
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          className="border p-2 rounded w-72"
          placeholder="Service Name"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </form>
    </div>
  );
}
