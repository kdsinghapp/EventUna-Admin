import { useState } from "react";
import API from "../api/axios";

export default function Preferences() {
  const [preference, setPreference] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post("/admin/place-preference", { preference });
      alert("Preference added successfully");
    } catch (err) {
      alert("Error: " + err.response?.data?.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Add Preference</h2>
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          className="border p-2 rounded w-64"
          placeholder="Preference name"
          value={preference}
          onChange={(e) => setPreference(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
}
