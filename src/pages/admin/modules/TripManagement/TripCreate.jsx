// src/pages/admin/modules/TripManagement/TripCreate.jsx

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import "../../css/TripManagement/TripCreate.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { CircularProgress } from "@mui/material";

/* ------------------------------
   API Setup / Utils
------------------------------ */
const APIBaseUrl = axios.create({
  baseURL: "https://api.yaadigo.com/secure/api/",
});
const TRIP_API_KEY = "x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ";
const authHeaders = { headers: { "x-api-key": TRIP_API_KEY } };

// If you already have Toastify, replace these with your toast fns.
const ToastContainer = () => null;
const successMsg = (msg) => console.log(msg);
const errorMsg = (msg) => console.error(msg);

const generateSlug = (title) =>
  title
    ? title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "")
    : "";

/* ------------------------------
   Component
------------------------------ */
export default function TripCreate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  // Dropdown data
  const [destinationList, setDestinationList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  // Flags
  const [isDropdownLoading, setIsDropdownLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Accordion section expansion
  const [expanded, setExpanded] = useState({
    basic: true,
    itinerary: false,
    media: false,
    pricing: false,
    details: false,
    policies: false,
  });

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    overview: "",
    destination_id: "",
    destination_type: "Domestic",
    category_id: [], // array of strings
    themes: [],
    hotel_category: "",
    pickup_location: "",
    drop_location: "",
    days: "",
    nights: "",
    itineraryDays: [
      {
        id: 1,
        day_number: 1,
        title: "Day 1: Arrival",
        description: "",
        activities: [],
        hotel_name: "",
        meal_plan: [],
      },
    ],
    hero_image: null,
    gallery_images: [],
    pricing_model: "custom",
    pricing: {
      pricing_model: "",
      fixed_departure: [
        {
          from_date: "",
          to_date: "",
          available_slots: "",
          title: "",
          description: "",
          base_price: "",
          discount: "",
          final_price: "",
          booking_amount: "",
          gst_percentage: "",
        },
      ],
      customized: {
        pricing_type: "",
        base_price: "",
        discount: "",
        final_price: "",
        gst_percentage: "",
      },
    },
    highlights: [],
    inclusions: [],
    exclusions: [],
    faqs: [],
    terms: "",
    privacy_policy: "",
    payment_terms: "",
    custom_policies: [],
  });

  // UI helpers
  const [selectedPricing, setSelectedPricing] = useState("custom");
  const [highlightsInput, setHighlightsInput] = useState("");
  const [inclusionsInput, setInclusionsInput] = useState("");
  const [exclusionsInput, setExclusionsInput] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [faqInput, setFaqInput] = useState({ question: "", answer: "" });

  // Fixed departure mirror
  const [fixedPackage, setFixedPackage] = useState([
    {
      from_date: "",
      to_date: "",
      description: "",
      available_slots: "",
      title: "",
      base_price: "",
      discount: "",
      final_price: "",
      booking_amount: "",
      gst_percentage: "",
    },
  ]);

  const [openItineraryDay, setOpenItineraryDay] = useState(1);
  const editor = useRef(null);
  const editor2 = useRef(null);

  /* ------------------------------
     Helpers (immutable updates)
  ------------------------------ */
  const setFD = (updater) => setFormData((prev) => updater(structuredClone(prev)));

  const toggleSection = (key) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleInputChange = (field, value) => {
    setFD((draft) => {
      draft[field] = value;
      if (field === "title" && !isEditMode) draft.slug = generateSlug(value);
      if (field === "pricing_model") setSelectedPricing(value);
      return draft;
    });
  };

  const handleArrayChange = (field, value, isChecked) => {
    setFD((draft) => {
      const set = new Set(draft[field] || []);
      if (isChecked) set.add(value);
      else set.delete(value);
      draft[field] = Array.from(set);
      return draft;
    });
  };

  const handleItineraryChange = (dayId, field, value) => {
    setFD((draft) => {
      draft.itineraryDays = (draft.itineraryDays || []).map((day) =>
        day.id === dayId ? { ...day, [field]: value } : day
      );
      return draft;
    });
  };

  const handleActivitiesChange = (dayId, activity, isChecked) => {
    setFD((draft) => {
      draft.itineraryDays = (draft.itineraryDays || []).map((day) => {
        if (day.id !== dayId) return day;
        const set = new Set(day.activities || []);
        if (isChecked) set.add(activity);
        else set.delete(activity);
        return { ...day, activities: Array.from(set) };
      });
      return draft;
    });
  };

  const handleMealPlanChange = (dayId, meal, isChecked) => {
    setFD((draft) => {
      draft.itineraryDays = (draft.itineraryDays || []).map((day) => {
        if (day.id !== dayId) return day;
        const set = new Set(day.meal_plan || []);
        if (isChecked) set.add(meal);
        else set.delete(meal);
        return { ...day, meal_plan: Array.from(set) };
      });
      return draft;
    });
  };

  const addNewDay = () => {
    setFD((draft) => {
      const newId = (draft.itineraryDays?.length || 0) + 1;
      draft.itineraryDays.push({
        id: newId,
        day_number: newId,
        title: `Day ${newId}: New Activity`,
        description: "",
        activities: [],
        hotel_name: "",
        meal_plan: [],
      });
      return draft;
    });
    setOpenItineraryDay((prev) => prev + 1);
  };

  const removeItem = (field, index) => {
    setFD((draft) => {
      draft[field] = (draft[field] || []).filter((_, i) => i !== index);
      return draft;
    });
  };

  const addHighlight = () => {
    if (!highlightsInput.trim()) return;
    setFD((draft) => {
      (draft.highlights ||= []).push(highlightsInput.trim());
      return draft;
    });
    setHighlightsInput("");
  };

  const addInclusion = () => {
    if (!inclusionsInput.trim()) return;
    setFD((draft) => {
      (draft.inclusions ||= []).push(inclusionsInput.trim());
      return draft;
    });
    setInclusionsInput("");
  };

  const addExclusion = () => {
    if (!exclusionsInput.trim()) return;
    setFD((draft) => {
      (draft.exclusions ||= []).push(exclusionsInput.trim());
      return draft;
    });
    setExclusionsInput("");
  };

  const addFaqs = () => {
    if (faqInput?.question?.trim() && faqInput?.answer?.trim()) {
      setFaqs((prev) => [...prev, faqInput]);
      setFaqInput({ question: "", answer: "" });
    } else {
      errorMsg("Please fill both question and answer!");
    }
  };

  const deleteFaqs = (indexToRemove) => {
    setFaqs((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  // Pricing (custom)
  const handleCustomPricingChange = (field, value) => {
    setFD((draft) => {
      const c = draft.pricing?.customized || {};
      c[field] = value;
      const base = parseFloat(c.base_price) || 0;
      const disc = parseFloat(c.discount) || 0;
      const gst = parseFloat(c.gst_percentage) || 0;
      const discounted = base - disc;
      c.final_price = (discounted + (discounted * gst) / 100).toFixed(2);
      draft.pricing.customized = c;
      return draft;
    });
  };

  // Pricing (fixed departure)
  const addFixedPackage = () =>
    setFixedPackage((prev) => [
      ...prev,
      {
        from_date: "",
        to_date: "",
        description: "",
        available_slots: "",
        title: "",
        base_price: "",
        discount: "",
        final_price: "",
        booking_amount: "",
        gst_percentage: "",
      },
    ]);

  const deleteFixedPackage = (indexToRemove) => {
    if (indexToRemove !== 0) {
      setFixedPackage((prev) => prev.filter((_, i) => i !== indexToRemove));
    }
  };

  const updateFixedPackage = (index, key, value) => {
    setFixedPackage((prev) => {
      const next = structuredClone(prev);
      next[index][key] = value;

      const base = parseFloat(next[index].base_price) || 0;
      const disc = parseFloat(next[index].discount) || 0;
      const gst = parseFloat(next[index].gst_percentage) || 0;
      const discounted = base - disc;
      next[index].final_price = (discounted + (discounted * gst) / 100).toFixed(2);

      return next;
    });
  };

  /* ------------------------------
     API Calls
  ------------------------------ */
  const getAllDestinations = async () => {
    try {
      const res = await APIBaseUrl.get("destinations/", authHeaders);
      if (res?.data?.data) setDestinationList(res.data.data);
    } catch (e) {
      errorMsg(e?.response?.data || e.message);
    }
  };

  const getAllTourCategory = async () => {
    try {
      const res = await APIBaseUrl.get("categories/", authHeaders);
      if (res?.data?.data) setCategoryList(res.data.data);
    } catch (e) {
      errorMsg(e?.response?.data || e.message);
    }
  };

  const getSpecificTrip = async (tripId) => {
    try {
      const res = await APIBaseUrl.get(`trips/${tripId}`, authHeaders);
      if (res?.data?.data) {
        const t = res.data.data;

        const highlightsArray = t.highlights ? t.highlights.split("; ") : [];
        const inclusionsArray = t.inclusions ? t.inclusions.split("; ") : [];
        const exclusionsArray = t.exclusions ? t.exclusions.split("; ") : [];

        const itineraryDays =
          t.itinerary?.map((day, index) => ({
            id: index + 1,
            day_number: day.day_number,
            title: day.title,
            description: day.description,
            activities: day.activities || [],
            hotel_name: day.hotel_name,
            meal_plan: day.meal_plan || [],
          })) || [];

        const categoryId = t.category_id
          ? Array.isArray(t.category_id)
            ? t.category_id.map(String)
            : [String(t.category_id)]
          : [];

        setFD((draft) => {
          draft.title = t.title || "";
          draft.slug = t.slug || "";
          draft.overview = t.overview || "";
          draft.destination_id = t.destination_id || "";
          draft.destination_type = t.destination_type || "Domestic";
          draft.category_id = categoryId;
          draft.themes = t.themes || [];
          draft.hotel_category = t.hotel_category?.toString() || "";
          draft.pickup_location = t.pickup_location || "";
          draft.drop_location = t.drop_location || "";
          draft.days = t.days || "";
          draft.nights = t.nights || "";
          draft.hero_image = t.hero_image || null;
          draft.gallery_images = t.gallery_images || [];
          draft.highlights = highlightsArray;
          draft.inclusions = inclusionsArray;
          draft.exclusions = exclusionsArray;
          draft.terms = t.terms || "";
          draft.privacy_policy = t.privacy_policy || "";
          draft.payment_terms = t.payment_terms || "";
          draft.pricing_model = t.pricing?.pricing_model === "fixed_departure" ? "fixed" : "custom";
          draft.itineraryDays = itineraryDays;

          draft.pricing.customized = {
            pricing_type: t.pricing?.customized?.pricing_type || "",
            base_price: t.pricing?.customized?.base_price || "",
            discount: t.pricing?.customized?.discount || "",
            final_price: t.pricing?.customized?.final_price || "",
            gst_percentage: t.pricing?.customized?.gst_percentage || "",
          };
          return draft;
        });

        setFaqs(t.faqs || []);
        setSelectedPricing(t.pricing?.pricing_model === "fixed_departure" ? "fixed" : "custom");

        if (t.pricing?.fixed_departure) {
          setFixedPackage(
            t.pricing.fixed_departure.map((pkg) => ({
              from_date: pkg.from_date?.split("T")[0] || "",
              to_date: pkg.to_date?.split("T")[0] || "",
              available_slots: pkg.available_slots || "",
              title: pkg.title || "",
              description: pkg.description || "",
              base_price: pkg.base_price || "",
              discount: pkg.discount || "",
              final_price: pkg.final_price || "",
              booking_amount: pkg.booking_amount || "",
              gst_percentage: pkg.gst_percentage || "",
            }))
          );
        }
      }
    } catch (e) {
      errorMsg("Failed to load trip data");
      errorMsg(e?.response?.data || e.message);
    }
  };

  // Uploads
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.toLowerCase().split(".").pop();
    if (!["jpeg", "png", "jpg", "pdf", "webp"].includes(ext)) {
      return errorMsg("Unsupported file type");
    }
    if (file.size > 5 * 1024 * 1024) {
      return errorMsg("File size should not exceed 5MB.");
    }

    const fd = new FormData();
    fd.append("image", file);
    fd.append("storage", "local");

    try {
      // secure/api upload
      const res = await APIBaseUrl.post("upload", fd, authHeaders);
      if (res?.data?.message === "Upload successful" && res?.data?.url) {
        successMsg("Image uploaded successfully");
        setFD((draft) => {
          draft.hero_image = res.data.url;
          return draft;
        });
      } else {
        errorMsg("Upload failed");
      }
    } catch (e) {
      errorMsg("File upload failed");
      errorMsg(e?.response?.data || e.message);
    }
  };

  const handleMultipleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.toLowerCase().split(".").pop();
    if (!["jpeg", "png", "jpg", "pdf", "webp"].includes(ext)) {
      return errorMsg("Unsupported file type");
    }
    if (file.size > 5 * 1024 * 1024) {
      return errorMsg("File size should not exceed 5MB.");
    }

    const fd = new FormData();
    fd.append("gallery_images", file);
    fd.append("storage", "local");

    try {
      // secure/api multiple
      const res = await APIBaseUrl.post("multiple", fd, authHeaders);
      if (res?.data?.message === "Files uploaded") {
        successMsg("Image uploaded successfully");
        const path = res.data.files;
        const newPaths = Array.isArray(path) ? path.flat() : [path];
        setFD((draft) => {
          draft.gallery_images = [...(draft.gallery_images || []), ...newPaths];
          return draft;
        });
      } else {
        errorMsg("Upload failed");
      }
    } catch (e) {
      errorMsg("File upload failed");
      errorMsg(e?.response?.data || e.message);
    }
  };

  const removeHeroImage = () =>
    setFD((draft) => {
      draft.hero_image = null;
      return draft;
    });

  const removeGalleryImage = (index) =>
    setFD((draft) => {
      draft.gallery_images = (draft.gallery_images || []).filter((_, i) => i !== index);
      return draft;
    });

  // Submit / Update
  const prepareSubmissionData = () => {
    return {
      title: formData.title ?? "",
      overview: formData.overview ?? "",
      destination_id: parseInt(formData.destination_id || 0),
      destination_type: formData.destination_type ?? "Domestic",
      category_id: formData.category_id ?? [],
      themes: formData.themes ?? [],
      hotel_category: parseInt(formData.hotel_category || 0) || 0,
      pickup_location: formData.pickup_location ?? "",
      drop_location: formData.drop_location ?? "",
      days: parseInt(formData.days || 0),
      nights: parseInt(formData.nights || 0),
      meta_tags: `${formData.title ?? ""}, ${(formData.themes || []).join(", ")}`,
      slug: isEditMode ? (formData.slug ?? "") : generateSlug(formData.title ?? ""),

      pricing_model: formData.pricing_model ?? "",
      highlights: (formData.highlights || []).join("; "),
      inclusions: (formData.inclusions || []).join("; "),
      exclusions: (formData.exclusions || []).join("; "),
      faqs: faqs || [],
      terms: formData.terms ?? "",
      privacy_policy: formData.privacy_policy ?? "",
      payment_terms: formData.payment_terms ?? "",
      gallery_images: formData.gallery_images ?? [],
      hero_image: formData.hero_image ?? "",

      itinerary: (formData.itineraryDays || []).map((day) => ({
        day_number: day.day_number,
        title: day.title,
        description: day.description,
        image_urls: [],
        activities: day.activities,
        hotel_name: day.hotel_name,
        meal_plan: day.meal_plan,
      })),

      pricing: {
        pricing_model: formData?.pricing_model === "fixed" ? "fixed_departure" : "customized",

        ...(formData.pricing_model === "fixed" && {
          fixed_departure: (fixedPackage || []).map((item) => ({
            from_date: item.from_date ? `${item.from_date}T00:00:00` : "",
            to_date: item.to_date ? `${item.to_date}T00:00:00` : "",
            available_slots: parseInt(item.available_slots || 0) || 0,
            title: item.title ?? "",
            description: item.description ?? "",
            base_price: parseFloat(item.base_price || 0) || 0,
            discount: parseFloat(item.discount || 0) || 0,
            final_price: parseFloat(item.final_price || 0) || 0,
            booking_amount: parseFloat(item.booking_amount || 0) || 0,
            gst_percentage: parseFloat(item.gst_percentage || 0) || 0,
          })),
        }),

        ...(formData.pricing_model === "custom" && {
          customized: {
            pricing_type: formData.pricing?.customized?.pricing_type ?? "",
            base_price: parseFloat(formData.pricing?.customized?.base_price || 0) || 0,
            discount: parseFloat(formData.pricing?.customized?.discount || 0) || 0,
            final_price: parseFloat(formData.pricing?.customized?.final_price || 0) || 0,
            gst_percentage: parseFloat(formData.pricing?.customized?.gst_percentage || 0) || 0,
          },
        }),
      },

      policies: [
        ...(formData.terms ? [{ title: "Terms and Conditions", content: formData.terms }] : []),
        ...(formData.privacy_policy ? [{ title: "Privacy Policy", content: formData.privacy_policy }] : []),
        ...(formData.payment_terms ? [{ title: "Payment Terms", content: formData.payment_terms }] : []),
        ...(formData.custom_policies || []),
      ],
    };
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const payload = prepareSubmissionData();
      const res = await APIBaseUrl.post("trips/", payload, authHeaders);
      if (res?.data?.success) {
        successMsg("Trip created successfully!");
        navigate("/admin/dashboard/trip-management/list");
      } else {
        errorMsg("Failed to create trip");
      }
    } catch (e) {
      errorMsg("Error creating trip");
      errorMsg(e?.response?.data || e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const payload = prepareSubmissionData();
      const res = await APIBaseUrl.put(`trips/${id}`, payload, authHeaders);
      if (res?.data?.success) {
        successMsg("Trip updated successfully!");
        navigate("/admin/dashboard/trip-management/list");
      } else {
        errorMsg("Failed to update trip");
      }
    } catch (e) {
      errorMsg("Error updating trip");
      errorMsg(e?.response?.data || e.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* ------------------------------
     Lifecycle
  ------------------------------ */
  useEffect(() => {
    const boot = async () => {
      setIsDropdownLoading(true);
      await Promise.all([getAllDestinations(), getAllTourCategory()]);
      setIsDropdownLoading(false);

      if (isEditMode) {
        await getSpecificTrip(id);
      } else {
        // ensure default pricing model set only once
        setFD((draft) => {
          if (!draft.pricing_model) draft.pricing_model = "custom";
          return draft;
        });
        setSelectedPricing("custom");
      }
    };
    boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /* ------------------------------
     UI Sections (Accordion)
  ------------------------------ */

  // --- Section Header helper ---
  const SectionHeader = ({ idKey, title }) => (
    <div
      className="accordion-header"
      onClick={() => toggleSection(idKey)}
      style={{
        userSelect: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        background: "#f8f9fa",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        marginBottom: "8px",
      }}
    >
      <span className="fw-bold">{title}</span>
      {expanded[idKey] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
    </div>
  );

  return (
    <div className="tour-container">
      <ToastContainer />

      <div className="d-flex justify-content-between destination-header">
        <div className="tour-header">
          <h2>{isEditMode ? "Edit Trip" : "Add New Trip"}</h2>
          <p>Create a comprehensive travel package</p>
        </div>
        <div>
          <button
            className="back-button"
            onClick={() => navigate("/admin/dashboard/trip-management/list")}
          >
            <ArrowLeft size={18} /> Back to List
          </button>
        </div>
      </div>

      {/* BASIC INFO */}
      <div className="content-card">
        <SectionHeader idKey="basic" title="Basic Information" />
        {expanded.basic && (
          <div className="row" style={{ padding: "8px 2px" }}>
            <div className="col-lg-6">
              <div className="form-group-admin">
                <label>Trip Title *</label>
                <input
                  type="text"
                  className="form-control-admin"
                  placeholder="Enter trip title"
                  maxLength="100"
                  value={formData.title ?? ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
                <small className="text-muted">
                  {(formData.title?.length ?? 0)}/100 characters
                </small>
              </div>

              <div className="form-group-admin">
                <label>Trip Overview *</label>
                <textarea
                  rows="3"
                  className="form-control-admin"
                  placeholder="Describe the trip overview..."
                  value={formData.overview ?? ""}
                  onChange={(e) => handleInputChange("overview", e.target.value)}
                ></textarea>
              </div>

              <div className="form-group-admin">
                <label>Destination *</label>
                {isDropdownLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  <select
                    className="form-control-admin"
                    value={formData.destination_id ?? ""}
                    onChange={(e) =>
                      handleInputChange("destination_id", e.target.value)
                    }
                  >
                    <option value="">Select destination</option>
                    {destinationList?.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="form-group-admin">
                <label>Destination Type *</label>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    name="destType"
                    className="form-check-input"
                    checked={formData.destination_type === "Domestic"}
                    onChange={() =>
                      handleInputChange("destination_type", "Domestic")
                    }
                  />
                  <label className="form-check-label">Domestic</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    name="destType"
                    className="form-check-input"
                    checked={formData.destination_type === "International"}
                    onChange={() =>
                      handleInputChange("destination_type", "International")
                    }
                  />
                  <label className="form-check-label">International</label>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="form-group-admin">
                <label>Categories *</label>
                {isDropdownLoading ? (
                  <CircularProgress size={24} />
                ) : categoryList?.length > 0 ? (
                  <div className="checkbox-list-container">
                    {categoryList.map((cat) => (
                      <div className="form-check" key={cat.id}>
                        <input
                          type="checkbox"
                          name="category"
                          className="form-check-input"
                          checked={(formData.category_id || []).includes(
                            String(cat.id)
                          )}
                          onChange={(e) =>
                            handleArrayChange(
                              "category_id",
                              String(cat.id),
                              e.target.checked
                            )
                          }
                        />
                        <label className="form-check-label">{cat.name}</label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted">No categories found.</div>
                )}
              </div>

              <div className="form-group-admin border-top pt-3">
                <label>Trip Theme *</label>
                {["Adventure", "Nature", "Religious", "Wildlife", "Water Activities"].map(
                  (theme) => (
                    <div className="form-check" key={theme}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={(formData.themes || []).includes(theme)}
                        onChange={(e) =>
                          handleArrayChange("themes", theme, e.target.checked)
                        }
                      />
                      <label className="form-check-label">{theme}</label>
                    </div>
                  )
                )}
              </div>

              <div className="row mt-2">
                <div className="col-6">
                  <div className="form-group-admin">
                    <label>Days *</label>
                    <input
                      type="number"
                      className="form-control-admin"
                      placeholder="Days"
                      value={formData.days ?? ""}
                      onChange={(e) => handleInputChange("days", e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group-admin">
                    <label>Nights *</label>
                    <input
                      type="number"
                      className="form-control-admin"
                      placeholder="Nights"
                      value={formData.nights ?? ""}
                      onChange={(e) => handleInputChange("nights", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="row mt-1">
                <div className="col-6">
                  <div className="form-group-admin">
                    <label>Pickup Location *</label>
                    <input
                      type="text"
                      className="form-control-admin"
                      placeholder="Enter pickup city"
                      value={formData.pickup_location ?? ""}
                      onChange={(e) =>
                        handleInputChange("pickup_location", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group-admin">
                    <label>Drop Location *</label>
                    <input
                      type="text"
                      className="form-control-admin"
                      placeholder="Enter drop city"
                      value={formData.drop_location ?? ""}
                      onChange={(e) =>
                        handleInputChange("drop_location", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="form-group-admin mt-2">
                <label className="d-block">Hotel Category *</label>
                {["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"].map(
                  (cat, index) => (
                    <div className="form-check" key={cat}>
                      <input
                        type="radio"
                        name="hotelCategory"
                        className="form-check-input"
                        checked={(formData.hotel_category ?? "") ===
                          (index + 1).toString()}
                        onChange={() =>
                          handleInputChange(
                            "hotel_category",
                            (index + 1).toString()
                          )
                        }
                      />
                      <label className="form-check-label">{cat}</label>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ITINERARY */}
      <div className="content-card">
        <SectionHeader idKey="itinerary" title="Trip Itinerary" />
        {expanded.itinerary && (
          <div className="col-lg-12">
            {(formData.itineraryDays || []).map((day) => (
              <div key={day.id} className="mb-3 border rounded-lg overflow-hidden">
                <div
                  className="itinerary-day-header"
                  onClick={() =>
                    setOpenItineraryDay((prev) => (prev === day.id ? -1 : day.id))
                  }
                  style={{
                    backgroundColor:
                      openItineraryDay === day.id ? "#e0f7fa" : "#f8f9fa",
                  }}
                >
                  <span className="font-medium">{day.title}</span>
                  {openItineraryDay === day.id ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </div>

                {openItineraryDay === day.id && (
                  <div className="itinerary-day-content row">
                    <div className="col-md-6 form-group-admin">
                      <label>Day Title *</label>
                      <input
                        type="text"
                        className="form-control-admin"
                        value={day.title ?? ""}
                        onChange={(e) =>
                          handleItineraryChange(day.id, "title", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-6 form-group-admin">
                      <label>Hotel Name *</label>
                      <input
                        type="text"
                        className="form-control-admin"
                        placeholder="Hotel Name"
                        value={day.hotel_name ?? ""}
                        onChange={(e) =>
                          handleItineraryChange(
                            day.id,
                            "hotel_name",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="col-md-12 form-group-admin">
                      <label>Description</label>
                      <textarea
                        rows="3"
                        className="form-control-admin"
                        placeholder="Trip Description"
                        value={day.description ?? ""}
                        onChange={(e) =>
                          handleItineraryChange(
                            day.id,
                            "description",
                            e.target.value
                          )
                        }
                      ></textarea>
                    </div>
                    <div className="col-md-6 form-group-admin border-top pt-3">
                      <label>Select Activities</label>
                      <div className="flex gap-3 flex-wrap">
                        {[
                          "City Tour",
                          "Beach Visit",
                          "Trekking",
                          "Sightseeing",
                          "Shopping",
                          "Adventure Sports",
                        ].map((activity) => (
                          <label
                            key={activity}
                            className="flex items-center gap-1.5 text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={(day.activities || []).includes(activity)}
                              onChange={(e) =>
                                handleActivitiesChange(
                                  day.id,
                                  activity,
                                  e.target.checked
                                )
                              }
                            />{" "}
                            {activity}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="col-md-6 form-group-admin border-top pt-3">
                      <label>Meal Plan</label>
                      <div className="flex gap-4">
                        {["Breakfast", "Lunch", "Dinner"].map((meal) => (
                          <label
                            key={meal}
                            className="flex items-center gap-1.5 text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={(day.meal_plan || []).includes(meal)}
                              onChange={(e) =>
                                handleMealPlanChange(
                                  day.id,
                                  meal,
                                  e.target.checked
                                )
                              }
                            />{" "}
                            {meal}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              className="module-button bg-blue-600 hover:bg-blue-700 mt-3"
              onClick={addNewDay}
            >
              + Add Another Day
            </button>
          </div>
        )}
      </div>

      {/* MEDIA */}
      <div className="content-card">
        <SectionHeader idKey="media" title="Media Assets" />
        {expanded.media && (
          <div className="row">
            <div className="col-lg-6">
              <div className="media-section">
                <div className="section-title">
                  📷 Hero Image / Thumbnail <span className="required">*</span>
                </div>
                <div
                  className="upload-area"
                  onClick={() => document.getElementById("heroImage")?.click()}
                >
                  <div className="upload-icon">📷</div>
                  <div className="upload-text">
                    <h4>Upload Hero Image</h4>
                    <p>Drag and drop or click to browse</p>
                    {formData?.hero_image && (
                      <p>
                        Selected:{" "}
                        {String(formData?.hero_image).split("/").slice(-1)}
                      </p>
                    )}
                  </div>
                  <input
                    type="file"
                    id="heroImage"
                    name="hero_image"
                    accept=".png,.jpeg,.jpg,.pdf,.webp"
                    className="file-input"
                    onChange={handleFileUpload}
                  />
                </div>
                <div className="file-restrictions">
                  • Use high quality JPG, PNG or WebP format
                  <br />
                  • Recommended size: 1200x800 pixels
                  <br />
                  • Maximum file size: 5MB
                </div>

                {formData?.hero_image && (
                  <div className="image-upload-preview hero-image-preview">
                    <img
                      src={`${formData?.hero_image}`}
                      alt="Hero-Preview"
                      style={{ objectFit: "cover" }}
                    />
                    <span className="delete-image-icon" onClick={removeHeroImage}>
                      &times;
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-6">
              <div className="media-section">
                <div className="section-title">
                  🖼️ Image Gallery <span className="required">*</span>
                </div>
                <div
                  className="upload-area"
                  onClick={() =>
                    document.getElementById("galleryImages")?.click()
                  }
                >
                  <div className="upload-icon">🖼️</div>
                  <div className="upload-text">
                    <h4>Image Gallery</h4>
                    <p>Add multiple images</p>
                  </div>
                  <input
                    type="file"
                    id="galleryImages"
                    name="gallery_images"
                    accept=".png,.jpeg,.jpg,.pdf,.webp"
                    className="file-input"
                    onChange={handleMultipleFileUpload}
                  />
                </div>
                <div className="file-restrictions">
                  • Upload 5-10 high-quality images
                  <br />
                  • Show different attractions and activities
                  <br />
                  • Include both landscape and close-up shots
                  <br />• Recommended size: 1200x800px minimum
                </div>

                {(formData?.gallery_images || [])?.length > 0 && (
                  <div className="image-upload-preview">
                    {formData?.gallery_images?.map((image, index) => (
                      <div className="gallery-image-item" key={index}>
                        <img
                          src={encodeURI(image)}
                          alt={`Gallery-Preview-${index}`}
                          style={{ objectFit: "cover" }}
                        />
                        <span
                          className="delete-image-icon"
                          onClick={() => removeGalleryImage(index)}
                        >
                          &times;
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PRICING */}
      <div className="content-card">
        <SectionHeader idKey="pricing" title="Pricing Configuration" />
        {expanded.pricing && (
          <div className="col-lg-12">
            <h5 className="mb-3 fw-bold">Pricing Model *</h5>
            <div className="row mb-4">
              <div className="col-md-6">
                <div
                  className={`p-3 border rounded d-flex align-items-center ${
                    selectedPricing === "fixed" ? "border-primary border-2" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedPricing("fixed");
                    handleInputChange("pricing_model", "fixed");
                  }}
                >
                  <input
                    type="radio"
                    className="form-check-input me-2"
                    checked={selectedPricing === "fixed"}
                    onChange={() => {
                      setSelectedPricing("fixed");
                      handleInputChange("pricing_model", "fixed");
                    }}
                  />
                  <div>
                    <label className="form-check-label fw-bold">
                      Fixed Departure
                    </label>
                    <div className="small text-muted">
                      Set specific dates with group bookings
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div
                  className={`p-3 border rounded d-flex align-items-center ${
                    selectedPricing === "custom" ? "border-primary border-2" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedPricing("custom");
                    handleInputChange("pricing_model", "custom");
                  }}
                >
                  <input
                    type="radio"
                    className="form-check-input me-2"
                    checked={selectedPricing === "custom"}
                    onChange={() => {
                      setSelectedPricing("custom");
                      handleInputChange("pricing_model", "custom");
                    }}
                  />
                  <div>
                    <label className="form-check-label fw-bold">
                      Customized Trip
                    </label>
                    <div className="small text-muted">
                      Flexible dates based on customer preference
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {selectedPricing === "fixed" && (
              <>
                <div className="mt-3 destination-faq">
                  <div className="accordion" id="fdAccordion">
                    {fixedPackage.map((trip, index) => (
                      <div className="mt-4" key={index}>
                        <div className="accordion-item">
                          <h2 className="accordion-header d-flex align-items-center justify-content-between">
                            <button
                              type="button"
                              className="accordion-button flex-grow-1 fw-bold"
                              data-bs-toggle="collapse"
                              data-bs-target={`#fd${index}`}
                              aria-expanded="true"
                              aria-controls={`fd${index}`}
                            >
                              Available Slots {index + 1}
                            </button>
                            <div className="ms-3 d-flex gap-2">
                              <button
                                type="button"
                                className={`destination-faq-add ${index === 0 && "me-3"}`}
                                onClick={addFixedPackage}
                              >
                                Add
                              </button>
                              {index !== 0 && (
                                <button
                                  type="button"
                                  className="destination-faq-add faq-delete me-3"
                                  onClick={() => deleteFixedPackage(index)}
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </h2>

                          <div
                            id={`fd${index}`}
                            className="accordion-collapse collapse show"
                            data-bs-parent="#fdAccordion"
                          >
                            <div className="accordion-body">
                              <div className="row mb-3">
                                <div className="col-md-4">
                                  <label className="form-label">From Date *</label>
                                  <input
                                    type="date"
                                    className="form-control"
                                    value={trip?.from_date ?? ""}
                                    onChange={(e) =>
                                      updateFixedPackage(index, "from_date", e.target.value)
                                    }
                                  />
                                </div>
                                <div className="col-md-4">
                                  <label className="form-label">To Date *</label>
                                  <input
                                    type="date"
                                    className="form-control"
                                    value={trip?.to_date ?? ""}
                                    onChange={(e) =>
                                      updateFixedPackage(index, "to_date", e.target.value)
                                    }
                                  />
                                </div>
                                <div className="col-md-4">
                                  <label className="form-label">Available Slots *</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter available slots"
                                    value={trip?.available_slots ?? ""}
                                    onChange={(e) =>
                                      updateFixedPackage(index, "available_slots", e.target.value)
                                    }
                                  />
                                </div>
                              </div>

                              <h6 className="fw-bold mb-4 mt-4">Costing Packages</h6>
                              <div className="row mb-3">
                                <div className="col-md-6">
                                  <label className="form-label">Package Title *</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Triple Occupancy"
                                    value={trip?.title ?? ""}
                                    onChange={(e) =>
                                      updateFixedPackage(index, "title", e.target.value)
                                    }
                                  />
                                </div>
                                <div className="col-md-3">
                                  <label className="form-label">Base Price (₹) *</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter base price"
                                    value={trip?.base_price ?? ""}
                                    onChange={(e) =>
                                      updateFixedPackage(index, "base_price", e.target.value)
                                    }
                                  />
                                </div>
                                <div className="col-md-3">
                                  <label className="form-label">Discount (₹)</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter discount price"
                                    value={trip?.discount ?? ""}
                                    onChange={(e) =>
                                      updateFixedPackage(index, "discount", e.target.value)
                                    }
                                  />
                                </div>
                              </div>

                              <div className="row mb-3">
                                <div className="col-md-4">
                                  <label className="form-label">Booking Amount (₹)</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={trip?.booking_amount ?? ""}
                                    placeholder="Enter booking amount"
                                    onChange={(e) =>
                                      updateFixedPackage(index, "booking_amount", e.target.value)
                                    }
                                  />
                                </div>
                                <div className="col-md-4">
                                  <label className="form-label">GST Percentage (%)</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={trip?.gst_percentage ?? ""}
                                    placeholder="Enter GST percentage"
                                    onChange={(e) =>
                                      updateFixedPackage(index, "gst_percentage", e.target.value)
                                    }
                                  />
                                </div>
                                <div className="col-md-4">
                                  <label className="form-label">Final Price (₹)</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    readOnly
                                    value={trip?.final_price ?? ""}
                                    placeholder="Auto-calculated"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {selectedPricing === "custom" && (
              <>
                <h6 className="fw-bold mb-2">Customized Pricing</h6>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label d-block">Pricing Type *</label>
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        name="pricingType"
                        className="form-check-input"
                        checked={
                          (formData.pricing?.customized?.pricing_type ?? "") ===
                          "Price Per Person"
                        }
                        onChange={() =>
                          handleCustomPricingChange(
                            "pricing_type",
                            "Price Per Person"
                          )
                        }
                      />
                      <label className="form-check-label">Price Per Person</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        name="pricingType"
                        className="form-check-input"
                        checked={
                          (formData.pricing?.customized?.pricing_type ?? "") ===
                          "Price Per Package"
                        }
                        onChange={() =>
                          handleCustomPricingChange(
                            "pricing_type",
                            "Price Per Package"
                          )
                        }
                      />
                      <label className="form-check-label">Price Per Package</label>
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label">Base Price (₹) *</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter base price"
                      value={formData.pricing?.customized?.base_price ?? ""}
                      onChange={(e) =>
                        handleCustomPricingChange("base_price", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Discount (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter discount price"
                      value={formData.pricing?.customized?.discount ?? ""}
                      onChange={(e) =>
                        handleCustomPricingChange("discount", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">GST Percentage (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter GST percentage"
                      value={formData.pricing?.customized?.gst_percentage ?? ""}
                      onChange={(e) =>
                        handleCustomPricingChange("gst_percentage", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label mt-3">Final Price (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Auto-calculated"
                      readOnly
                      value={formData.pricing?.customized?.final_price ?? ""}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* DETAILS */}
      <div className="content-card">
        <SectionHeader idKey="details" title="Highlights, Inclusions, Exclusions & FAQ" />
        {expanded.details && (
          <div className="row">
            <div className="col-md-6">
              <div className="form-group-admin">
                <label>Trip Highlights</label>
                <div className="input-group-addon">
                  <input
                    type="text"
                    className="form-control-admin"
                    placeholder="Add trip highlight"
                    value={highlightsInput}
                    onChange={(e) => setHighlightsInput(e.target.value)}
                  />
                  <button type="button" onClick={addHighlight} className="btn btn-primary">
                    +
                  </button>
                </div>
                <div className="dynamic-list-container">
                  {(formData.highlights || []).map((item, index) => (
                    <div key={index} className="highlight-list-item">
                      <span>{item}</span>
                      <button type="button" onClick={() => removeItem("highlights", index)}>
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group-admin">
                <label>Inclusions</label>
                <div className="input-group-addon">
                  <input
                    type="text"
                    className="form-control-admin"
                    placeholder="Add inclusion"
                    value={inclusionsInput}
                    onChange={(e) => setInclusionsInput(e.target.value)}
                  />
                  <button type="button" onClick={addInclusion} className="btn btn-primary">
                    +
                  </button>
                </div>
                <div className="dynamic-list-container">
                  {(formData.inclusions || []).map((item, index) => (
                    <div key={index} className="highlight-list-item">
                      <span>{item}</span>
                      <button type="button" onClick={() => removeItem("inclusions", index)}>
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group-admin">
                <label>Exclusions</label>
                <div className="input-group-addon">
                  <input
                    type="text"
                    className="form-control-admin"
                    placeholder="Add exclusion"
                    value={exclusionsInput}
                    onChange={(e) => setExclusionsInput(e.target.value)}
                  />
                  <button type="button" onClick={addExclusion} className="btn btn-primary">
                    +
                  </button>
                </div>
                <div className="dynamic-list-container">
                  {(formData.exclusions || []).map((item, index) => (
                    <div key={index} className="highlight-list-item">
                      <span>{item}</span>
                      <button type="button" onClick={() => removeItem("exclusions", index)}>
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group-admin">
                <label>FAQ (Optional)</label>
                <div className="input-group-addon" style={{ gap: 8 }}>
                  <input
                    type="text"
                    className="form-control-admin"
                    placeholder="Add FAQ question"
                    value={faqInput?.question ?? ""}
                    onChange={(e) =>
                      setFaqInput((prev) => ({ ...prev, question: e.target.value }))
                    }
                    style={{ marginBottom: 8 }}
                  />
                  <input
                    type="text"
                    className="form-control-admin"
                    placeholder="Add FAQ answer"
                    value={faqInput?.answer ?? ""}
                    onChange={(e) =>
                      setFaqInput((prev) => ({ ...prev, answer: e.target.value }))
                    }
                    style={{ marginBottom: 8 }}
                  />
                  <button type="button" onClick={addFaqs} className="btn btn-primary">
                    Add FAQ
                  </button>
                </div>
                <div className="dynamic-list-container">
                  {faqs.map((faq, index) =>
                    faq.question && faq.answer ? (
                      <div key={index} className="highlight-list-item">
                        <div>
                          <strong>Q:</strong> {faq.question}
                          <br />
                          <strong>A:</strong> {faq.answer}
                        </div>
                        <button type="button" onClick={() => deleteFaqs(index)}>
                          &times;
                        </button>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* POLICIES */}
      <div className="content-card">
        <SectionHeader idKey="policies" title="Legal Policies" />
        {expanded.policies && (
          <div className="row">
            <div className="col-md-12 form-group-admin">
              <label>Terms and Conditions</label>
              <textarea
                rows="5"
                className="form-control-admin"
                placeholder="Enter terms and conditions"
                value={formData.terms ?? ""}
                onChange={(e) => handleInputChange("terms", e.target.value)}
              ></textarea>
            </div>
            <div className="col-md-12 form-group-admin">
              <label>Cancellation Policy</label>
              <textarea
                rows="5"
                className="form-control-admin"
                placeholder="Enter cancellation policy"
                value={formData.privacy_policy ?? ""}
                onChange={(e) => handleInputChange("privacy_policy", e.target.value)}
              ></textarea>
            </div>
            <div className="col-md-12 form-group-admin">
              <label>Payment Terms</label>
              <textarea
                rows="5"
                className="form-control-admin"
                placeholder="Enter payment details"
                value={formData.payment_terms ?? ""}
                onChange={(e) => handleInputChange("payment_terms", e.target.value)}
              ></textarea>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div
        style={{
          marginTop: "24px",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <button
          type="button"
          className="button button-green"
          onClick={isEditMode ? handleUpdate : handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : isEditMode ? (
            "Update Trip"
          ) : (
            "Publish Trip"
          )}
        </button>
      </div>
    </div>
  );
}
