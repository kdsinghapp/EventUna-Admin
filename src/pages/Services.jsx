import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    API.get("/merchant/services")
      .then((res) => setServices(res.data.services))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Services</h2>
      <div className="grid gap-4">
        {services.map((service) => (
          <div key={service._id} className="p-4 border rounded-lg shadow bg-white">
            <h3 className="font-semibold text-lg">{service.servicesName}</h3>
            {service.subcategories.length > 0 ? (
              <ul className="list-disc ml-6 mt-2">
                {service.subcategories.map((sub) => (
                  <li key={sub._id}>{sub.subServicesName}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No sub-services yet</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
