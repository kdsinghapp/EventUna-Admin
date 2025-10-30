import { useState } from "react";
import API from "../api/axios";

export default function SubServicesList() {
  const [serviceId, setServiceId] = useState("686fb6ced46e9740ee8277ec");
  const [subServices, setSubServices] = useState([]);

  const fetchSubServices = async () => {
    try {
      const res = await API.get(`/merchant/sub-services?id=${serviceId}`);
      setSubServices(res.data.services);
    } catch (err) {
      alert("Error fetching subservices");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Sub-Services</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border p-2 rounded w-72"
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          placeholder="Enter Service ID"
        />
        <button
          onClick={fetchSubServices}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Fetch
        </button>
      </div>

      <ul className="list-disc ml-6">
        {subServices.map((s) => (
          <li key={s._id}>{s.subServicesName}</li>
        ))}
      </ul>
    </div>
  );
}
