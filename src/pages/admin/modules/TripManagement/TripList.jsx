import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Copy, Eye, Trash2 } from 'lucide-react';
import axios from 'axios';
import "../../css/TripManagement/TripList.css";

// Simple modal for delete/duplicate confirmation
const CustomModal = ({ open, onClickOutside, children }) => {
  if (!open) return null;
  return (
    <div className="custom-modal-overlay" onClick={onClickOutside}>
      <div className="delete-model-view-main" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

// --- API SETUP ---
const APIBaseUrl = axios.create({ baseURL: "https://api.yaadigo.com/secure/api/" });
const API_KEY = "x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ";
const headers = { headers: { "x-api-key": API_KEY, accept: "application/json" } };

const capitalize = (str) => (str ? str.replace(/\b\w/g, (c) => c.toUpperCase()) : "");
const slugify = (title) =>
  title
    ?.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "") || "";

export default function TripList() {
  const [tripList, setTripList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [duplicateId, setDuplicateId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [duplicating, setDuplicating] = useState(false);

  const navigate = useNavigate();

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await APIBaseUrl.get("trips/", headers);
      if (res?.data?.success) {
        const list = res.data.data.map((t, i) => ({ ...t, sno: i + 1 }));
        setTripList(list);
      }
    } catch (err) {
      console.error("Failed to fetch trips", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (id) => {
    try {
      await APIBaseUrl.delete(`trips/${id}`, headers);
      setTripList((prev) => prev.filter((t) => t.id !== id));
    } catch {
      console.error("Error deleting trip");
    }
  };

  const bulkDelete = async () => {
    await Promise.all(selectedIds.map((id) => APIBaseUrl.delete(`trips/${id}`, headers)));
    setTripList((prev) => prev.filter((t) => !selectedIds.includes(t.id)));
    setSelectedIds([]);
  };

  const duplicateTrip = async () => {
    try {
      setDuplicating(true);
      const res = await APIBaseUrl.get(`trips/${duplicateId}`, headers);
      const src = res.data.data;
      if (!src) return;

      const payload = {
        ...src,
        title: `Copy of ${src.title}`,
        slug: slugify(`Copy of ${src.title}-${Date.now()}`),
      };
      delete payload.id;
      const createRes = await APIBaseUrl.post("trips/", payload, headers);
      if (createRes?.data?.success) await fetchTrips();
    } catch (e) {
      console.error("Duplicate failed", e);
    } finally {
      setDuplicating(false);
      setIsDuplicateModalOpen(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedIds(checked ? tripList.map((t) => t.id) : []);
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <div className="admin-content-main p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-3xl font-bold">Trip List</h3>
        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete ({selectedIds.length})
            </button>
          )}
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
            onClick={() => navigate("/admin/dashboard/trip-management/create")}
          >
            <Plus size={18} className="mr-2" /> Create Trip
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading trips...</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="min-w-full bg-white rounded shadow custom-table">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === tripList.length && tripList.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="px-4 py-2">S.No</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Pickup</th>
                <th className="px-4 py-2">Drop</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tripList.map((trip) => (
                <tr key={trip.id} className="border-t">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(trip.id)}
                      onChange={() => toggleSelect(trip.id)}
                    />
                  </td>
                  <td className="px-4 py-2">{trip.sno}</td>
                  <td className="px-4 py-2">{trip.title}</td>
                  <td className="px-4 py-2">{capitalize(trip.destination_type)}</td>
                  <td className="px-4 py-2">{capitalize(trip.pickup_location)}</td>
                  <td className="px-4 py-2">{capitalize(trip.drop_location)}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      title="Edit"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() =>
                        navigate(`/admin/dashboard/trip-management/create/${trip.id}`)
                      }
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      title="Duplicate"
                      className="text-purple-600 hover:text-purple-800"
                      onClick={() => {
                        setDuplicateId(trip.id);
                        setIsDuplicateModalOpen(true);
                      }}
                    >
                      <Copy size={18} />
                    </button>
                    <button
                      title="Preview"
                      className="text-green-600 hover:text-green-800"
                      onClick={() =>
                        window.open(`/trip-preview/${trip.slug}/${trip.id}`, "_blank")
                      }
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      title="Delete"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => {
                        setDeleteId(trip.id);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Modal */}
      <CustomModal open={isDeleteModalOpen} onClickOutside={() => setIsDeleteModalOpen(false)}>
        <p className="text-center mb-4">
          {deleteId
            ? "Are you sure you want to delete this trip?"
            : `Are you sure you want to delete ${selectedIds.length} selected trips?`}
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            onClick={() => {
              if (deleteId) deleteTrip(deleteId);
              else bulkDelete();
              setIsDeleteModalOpen(false);
            }}
          >
            Yes
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            No
          </button>
        </div>
      </CustomModal>

      {/* Duplicate Modal */}
      <CustomModal open={isDuplicateModalOpen} onClickOutside={() => setIsDuplicateModalOpen(false)}>
        <p className="text-center mb-4">Duplicate this trip?</p>
        <div className="flex justify-center gap-4">
          <button
            disabled={duplicating}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
            onClick={duplicateTrip}
          >
            {duplicating ? "Duplicating..." : "Yes"}
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
            onClick={() => setIsDuplicateModalOpen(false)}
          >
            No
          </button>
        </div>
      </CustomModal>
    </div>
  );
}
