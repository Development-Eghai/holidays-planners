import { useEffect, useMemo, useState } from "react";
import {
  Info,
  Map,
  Image as ImageIcon,
  DollarSign,
  FileText,
  Shield,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import "../../css/TripManagement/TripCreate.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

/* ===========================
   CONFIG
=========================== */
const SECURE_BASE = "https://api.yaadigo.com/secure/api/";
const API_KEY = "x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ";

// ✅ Updated redirect routes as requested
const AFTER_CREATE_REDIRECT = "/admin/dashboard/trip-management/list";
const AFTER_UPDATE_REDIRECT = "/admin/dashboard/trip-management/list";

/* ===========================
   COMPONENT
=========================== */
export default function TripCreate() {
  const navigate = useNavigate();
  const { id } = useParams(); // when present => Edit mode

  const [activeStep, setActiveStep] = useState("basic");
  const [openDay, setOpenDay] = useState(null);
  const [selectedPricing, setSelectedPricing] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // lists
  const [categoryList, setCategoryList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);

  // FAQ local state
  const [faqs, setFaqs] = useState([]);
  const [faqInput, setFaqInput] = useState({ question: "", answer: "" });

  // chip inputs
  const [highlightsInput, setHighlightsInput] = useState("");
  const [inclusionsInput, setInclusionsInput] = useState("");
  const [exclusionsInput, setExclusionsInput] = useState("");

  // pricing packages (fixed)
  const [fixedPackage, setFixedPackage] = useState([
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
  ]);

  // main form
  const [formData, setFormData] = useState({
    // Basic Info
    title: "",
    slug: "",
    overview: "",
    destination_id: "",
    destination_type: "",
    // categories are MULTI-SELECT (strings)
    category_id: [],
    themes: [],
    hotel_category: "",
    pickup_location: "", // TEXT
    drop_location: "",   // TEXT
    days: "",
    nights: "",

    // Itinerary
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

    // Media
    hero_image: null,
    gallery_images: [],

    // Pricing
    pricing_model: "",
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

    // Details
    highlights: [],
    inclusions: [],
    exclusions: [],

    // Policies
    terms: "",
    privacy_policy: "",
    payment_terms: "",
    custom_policies: [],
  });

  const steps = useMemo(
    () => [
      { id: "basic", label: "Basic Info", icon: Info },
      { id: "itinerary", label: "Itinerary", icon: Map },
      { id: "media", label: "Media", icon: ImageIcon },
      { id: "pricing", label: "Pricing", icon: DollarSign },
      { id: "details", label: "Details", icon: FileText },
      { id: "policies", label: "Policies", icon: Shield },
    ],
    []
  );

  // ---------- helpers ----------
  const currentIndex = steps.findIndex((s) => s.id === activeStep);
  const progress = ((currentIndex + 1) / steps.length) * 100 + "%";

  const generateSlug = (title) =>
    title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "title" && !id) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const handleArrayChange = (field, value, isChecked) => {
    setFormData((prev) => ({
      ...prev,
      [field]: isChecked
        ? [...prev[field], value]
        : prev[field].filter((item) => item !== value),
    }));
  };

  const toggleDay = (id) => setOpenDay(openDay === id ? null : id);

  const addNewDay = () => {
    setFormData((prev) => {
      const newId = prev.itineraryDays.length + 1;
      return {
        ...prev,
        itineraryDays: [
          ...prev.itineraryDays,
          {
            id: newId,
            day_number: newId,
            title: `Day ${newId}: New Activity`,
            description: "",
            activities: [],
            hotel_name: "",
            meal_plan: [],
          },
        ],
      };
    });
  };

  const handleItineraryChange = (dayId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      itineraryDays: prev.itineraryDays.map((d) =>
        d.id === dayId ? { ...d, [field]: value } : d
      ),
    }));
  };

  const handleActivitiesChange = (dayId, activity, isChecked) => {
    setFormData((prev) => ({
      ...prev,
      itineraryDays: prev.itineraryDays.map((day) =>
        day.id === dayId
          ? {
              ...day,
              activities: isChecked
                ? [...day.activities, activity]
                : day.activities.filter((a) => a !== activity),
            }
          : day
      ),
    }));
  };

  const handleMealPlanChange = (dayId, meal, isChecked) => {
    setFormData((prev) => ({
      ...prev,
      itineraryDays: prev.itineraryDays.map((day) =>
        day.id === dayId
          ? {
              ...day,
              meal_plan: isChecked
                ? [...day.meal_plan, meal]
                : day.meal_plan.filter((m) => m !== meal),
            }
          : day
      ),
    }));
  };

  const removeItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  /* ===========================
     UPLOAD HANDLERS (FIXED)
  =========================== */

  // Hero image upload + preview + remove
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const okTypes = ["jpeg", "png", "jpg", "webp"]; // keep only image types for preview safety
    const ext = file.name.split(".").pop().toLowerCase();
    if (!okTypes.includes(ext)) {
      toast.error("Only JPG, JPEG, PNG or WEBP allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should not exceed 5MB.");
      return;
    }

    const fd = new FormData();
    fd.append("image", file);
    fd.append("storage", "local");

    try {
      const res = await axios.post("https://api.yaadigo.com/upload", fd);
      if (res?.data?.message === "Upload successful") {
        setFormData((prev) => ({ ...prev, hero_image: res.data.url }));
        toast.success("Hero image uploaded");
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload error");
    }
  };

  // Gallery multi-upload + append + preview + remove
  const handleMultipleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const okTypes = ["jpeg", "png", "jpg", "webp"]; // consistent with preview
    for (const f of files) {
      const ext = f.name.split(".").pop().toLowerCase();
      if (!okTypes.includes(ext)) {
        toast.error(`Unsupported file type: ${f.name}`);
        return;
      }
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`File too large (>5MB): ${f.name}`);
        return;
      }
    }

    const fd = new FormData();
    files.forEach((f) => fd.append("gallery_images", f));
    fd.append("storage", "local");

    try {
      const res = await axios.post("https://api.yaadigo.com/multiple", fd);
      if (res?.data?.message === "Files uploaded") {
        const uploaded = Array.isArray(res.data.files)
          ? res.data.files.flat()
          : [res.data.files];
        setFormData((prev) => ({
          ...prev,
          gallery_images: [...(prev.gallery_images || []), ...uploaded],
        }));
        toast.success(`${uploaded.length} image(s) uploaded`);
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload error");
    }
  };

  const removeHeroImage = () =>
    setFormData((prev) => ({ ...prev, hero_image: null }));

  const removeGalleryImage = (index) =>
    setFormData((prev) => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index),
    }));

  /* ===========================
     PRICING HELPERS
  =========================== */
  const addFixedPackage = () =>
    setFixedPackage((p) => [
      ...p,
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
    if (indexToRemove === 0) return;
    setFixedPackage((p) => p.filter((_, i) => i !== indexToRemove));
  };

  const updateFixedPackage = (index, key, value) => {
    setFixedPackage((prev) => {
      const updated = [...prev];
      updated[index][key] = value;

      const basePrice = parseFloat(updated[index].base_price) || 0;
      const discount = parseFloat(updated[index].discount) || 0;
      const gst = parseFloat(updated[index].gst_percentage) || 0;

      const discounted = Math.max(basePrice - discount, 0);
      const finalPrice = discounted + (discounted * gst) / 100;

      updated[index].final_price = isNaN(finalPrice) ? "" : finalPrice.toFixed(2);
      return updated;
    });
  };

  const handleCustomPricingChange = (field, value) =>
    setFormData((prev) => {
      // recalc final price automatically
      const customized = {
        ...prev.pricing.customized,
        [field]: value,
      };
      const base = parseFloat(customized.base_price) || 0;
      const disc = parseFloat(customized.discount) || 0;
      const gst = parseFloat(customized.gst_percentage) || 0;
      const discounted = Math.max(base - disc, 0);
      const final = discounted + (discounted * gst) / 100;

      customized.final_price =
        isNaN(final) || !isFinite(final) ? "" : final.toFixed(2);

      return {
        ...prev,
        pricing: {
          ...prev.pricing,
          customized,
        },
      };
    });

  /* ===========================
     FETCHES
  =========================== */
  const getCategories = async () => {
    try {
      const res = await axios.get(`${SECURE_BASE}categories/`, {
        headers: { "x-api-key": API_KEY },
      });
      if (res?.data?.success) setCategoryList(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch categories");
    }
  };

  const getDestinations = async () => {
    try {
      const res = await axios.get(`${SECURE_BASE}destinations/`, {
        headers: { "x-api-key": API_KEY },
      });
      if (res?.data?.success) setDestinationList(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch destinations");
    }
  };

  const getSpecificTrip = async (tripId) => {
    try {
      const res = await axios.get(`${SECURE_BASE}trips/${tripId}`, {
        headers: { "x-api-key": API_KEY },
      });
      if (res?.data?.success === true) {
        const tripData = res.data.data;

        // normalize arrays
        const highlightsArray = tripData.highlights ? tripData.highlights.split("; ") : [];
        const inclusionsArray = tripData.inclusions ? tripData.inclusions.split("; ") : [];
        const exclusionsArray = tripData.exclusions ? tripData.exclusions.split("; ") : [];

        const itineraryDays =
          tripData.itinerary?.map((day, index) => ({
            id: index + 1,
            day_number: day.day_number,
            title: day.title,
            description: day.description,
            activities: day.activities || [],
            hotel_name: day.hotel_name,
            meal_plan: day.meal_plan || [],
          })) || [];

        // category_id must be array of strings
        const categoryId = tripData.category_id
          ? Array.isArray(tripData.category_id)
            ? tripData.category_id.map(String)
            : [String(tripData.category_id)]
          : [];

        setFormData((prev) => ({
          ...prev,
          title: tripData.title || "",
          slug: tripData.slug || "",
          overview: tripData.overview || "",
          destination_id: tripData.destination_id || "",
          destination_type: tripData.destination_type || "",
          category_id: categoryId,
          themes: tripData.themes || [],
          hotel_category: tripData.hotel_category?.toString() || "",
          pickup_location: tripData.pickup_location || "",
          drop_location: tripData.drop_location || "",
          days: tripData.days || "",
          nights: tripData.nights || "",
          hero_image: tripData.hero_image || null,
          gallery_images: tripData.gallery_images || [],
          highlights: highlightsArray,
          inclusions: inclusionsArray,
          exclusions: exclusionsArray,
          terms: tripData.terms || "",
          privacy_policy: tripData.privacy_policy || "",
          payment_terms: tripData.payment_terms || "",
          pricing_model:
            tripData.pricing?.pricing_model === "fixed_departure"
              ? "fixed"
              : "custom",
          itineraryDays,
          pricing: {
            ...prev.pricing,
            customized: {
              pricing_type: tripData.pricing?.customized?.pricing_type || "",
              base_price: tripData.pricing?.customized?.base_price || "",
              discount: tripData.pricing?.customized?.discount || "",
              final_price: tripData.pricing?.customized?.final_price || "",
              gst_percentage: tripData.pricing?.customized?.gst_percentage || "",
            },
          },
        }));

        setFaqs(tripData.faqs || []);
        setSelectedPricing(
          tripData.pricing?.pricing_model === "fixed_departure"
            ? "fixed"
            : "custom"
        );

        if (tripData.pricing?.fixed_departure) {
          setFixedPackage(
            tripData.pricing.fixed_departure.map((pkg) => ({
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
      } else {
        toast.error("Failed to load trip data");
      }
    } catch (error) {
      console.error("Error fetching trip:", error?.response?.data || error.message);
      toast.error("Failed to load trip data");
    }
  };

  useEffect(() => {
    getCategories();
    getDestinations();
  }, []);

  useEffect(() => {
    // set default pricing model on create
    if (!id && !formData.pricing_model) {
      handleInputChange("pricing_model", "custom");
      setSelectedPricing("custom");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (id) getSpecificTrip(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /* ===========================
     SUBMISSION
  =========================== */
  const prepareSubmissionData = () => {
    return {
      title: formData.title,
      overview: formData.overview,
      destination_id: formData.destination_id ? parseInt(formData.destination_id) : null,
      destination_type: formData.destination_type,
      // NOTE: category_id is an array of STRINGS
      category_id: formData.category_id,
      themes: formData.themes,
      hotel_category: parseInt(formData.hotel_category) || 0,
      pickup_location: formData.pickup_location,
      drop_location: formData.drop_location,
      days: parseInt(formData.days) || 0,
      nights: parseInt(formData.nights) || 0,
      meta_tags: `${formData.title}${formData.themes.length ? ", " + formData.themes.join(", ") : ""}`,
      slug: id ? formData.slug : (formData.title || "").toLowerCase().trim().replace(/\s+/g, "-"),
      pricing_model: formData.pricing_model,

      // details
      highlights: formData.highlights.join("; "),
      inclusions: formData.inclusions.join("; "),
      exclusions: formData.exclusions.join("; "),
      faqs: faqs,
      terms: formData.terms,
      privacy_policy: formData.privacy_policy,
      payment_terms: formData.payment_terms,

      // media
      gallery_images: formData.gallery_images,
      hero_image: formData.hero_image,

      // itinerary
      itinerary: formData.itineraryDays.map((day) => ({
        day_number: day.day_number,
        title: day.title,
        description: day.description,
        image_urls: [],
        activities: day.activities,
        hotel_name: day.hotel_name,
        meal_plan: day.meal_plan,
      })),

      // pricing
      pricing: {
        pricing_model:
          formData?.pricing_model === "fixed" ? "fixed_departure" : "customized",
        ...(formData.pricing_model === "fixed" && {
          fixed_departure: fixedPackage.map((item) => ({
            from_date: item.from_date ? `${item.from_date}T00:00:00` : null,
            to_date: item.to_date ? `${item.to_date}T00:00:00` : null,
            available_slots: item.available_slots ? parseInt(item.available_slots) : 0,
            title: item.title || "",
            description: item.description || "",
            base_price: item.base_price ? parseFloat(item.base_price) : 0,
            discount: item.discount ? parseFloat(item.discount) : 0,
            final_price: item.final_price ? parseFloat(item.final_price) : 0,
            booking_amount: item.booking_amount ? parseFloat(item.booking_amount) : 0,
            gst_percentage: item.gst_percentage ? parseFloat(item.gst_percentage) : 0,
          })),
        }),
        ...(formData.pricing_model === "custom" && {
          customized: {
            pricing_type: formData.pricing.customized.pricing_type,
            base_price: parseFloat(formData.pricing.customized.base_price) || 0,
            discount: parseFloat(formData.pricing.customized.discount) || 0,
            final_price: parseFloat(formData.pricing.customized.final_price) || 0,
            gst_percentage:
              parseFloat(formData.pricing.customized.gst_percentage) || 0,
          },
        }),
      },

      // policies
      policies: [
        ...(formData.terms ? [{ title: "Terms and Conditions", content: formData.terms }] : []),
        ...(formData.privacy_policy ? [{ title: "Privacy Policy", content: formData.privacy_policy }] : []),
        ...(formData.payment_terms ? [{ title: "Payment Terms", content: formData.payment_terms }] : []),
        ...formData.custom_policies,
      ],
    };
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const submissionData = prepareSubmissionData();
      const res = await axios.post(`${SECURE_BASE}trips/`, submissionData, {
        headers: { "x-api-key": API_KEY },
      });
      if (res?.data?.success) {
        toast.success("Trip created successfully!");
        navigate(AFTER_CREATE_REDIRECT);
      } else {
        toast.error(res?.data?.message || "Failed to create trip");
      }
    } catch (error) {
      console.error("Create trip error:", error?.response?.data || error.message);
      toast.error("Failed to create trip");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const submissionData = prepareSubmissionData();
      const res = await axios.put(`${SECURE_BASE}trips/${id}`, submissionData, {
        headers: { "x-api-key": API_KEY },
      });
      if (res?.data?.success) {
        toast.success("Trip updated successfully!");
        navigate(AFTER_UPDATE_REDIRECT);
      } else {
        toast.error(res?.data?.message || "Failed to update trip");
      }
    } catch (error) {
      console.error("Update trip error:", error?.response?.data || error.message);
      toast.error("Failed to update trip");
    } finally {
      setIsLoading(false);
    }
  };

  /* ===========================
     RENDER SECTIONS
  =========================== */
  const renderBasic = () => (
    <div className="container">
      <h3 className="mb-4 fw-bold fs-5">Trip Details</h3>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Trip Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter trip title"
              maxLength={100}
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
            <small className="text-muted">{formData.title?.length || 0}/100 characters</small>
          </div>

          <div className="mb-3">
            <label className="form-label">Trip Overview *</label>
            <textarea
              rows={3}
              className="form-control"
              placeholder="Describe the trip overview..."
              value={formData.overview}
              onChange={(e) => handleInputChange("overview", e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Destination *</label>
            <select
              className="form-select"
              value={formData.destination_id}
              onChange={(e) => handleInputChange("destination_id", e.target.value)}
            >
              <option value="">Select destination</option>
              {destinationList?.map((d) => (
                <option key={d?.id} value={d?.id}>
                  {d?.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label d-block">Destination Type *</label>
            <div className="form-check form-check-inline">
              <input
                type="radio"
                name="destType"
                className="form-check-input"
                checked={formData.destination_type === "Domestic"}
                onChange={() => handleInputChange("destination_type", "Domestic")}
              />
              <label className="form-check-label">Domestic</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                type="radio"
                name="destType"
                className="form-check-input"
                checked={formData.destination_type === "International"}
                onChange={() => handleInputChange("destination_type", "International")}
              />
              <label className="form-check-label">International</label>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label d-block">Categories *</label>
            {categoryList?.length > 0 &&
              categoryList.map((cat) => (
                <div className="form-check" key={cat.id}>
                  <input
                    type="checkbox"
                    name="category"
                    className="form-check-input"
                    checked={formData.category_id.includes(String(cat.id))}
                    onChange={(e) =>
                      handleArrayChange("category_id", String(cat.id), e.target.checked)
                    }
                  />
                  <label className="form-check-label">{cat.name}</label>
                </div>
              ))}
          </div>

          <div className="mb-3">
            <label className="form-label d-block">Trip Theme *</label>
            {["Adventure", "Nature", "Religious", "Wildlife", "Water Activities"].map(
              (cat) => (
                <div className="form-check" key={cat}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={formData.themes.includes(cat)}
                    onChange={(e) => handleArrayChange("themes", cat, e.target.checked)}
                  />
                  <label className="form-check-label">{cat}</label>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <h3 className="mb-4 fw-bold fs-5 mt-5">Location Details</h3>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Pickup city *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter pickup city"
              value={formData.pickup_location}
              onChange={(e) => handleInputChange("pickup_location", e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Drop city *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter drop city"
              value={formData.drop_location}
              onChange={(e) => handleInputChange("drop_location", e.target.value)}
            />
          </div>

          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label">Days *</label>
              <input
                type="number"
                className="form-control"
                placeholder="Days"
                value={formData.days}
                onChange={(e) => handleInputChange("days", e.target.value)}
              />
            </div>
            <div className="col-6 mb-3">
              <label className="form-label">Nights</label>
              <input
                type="number"
                className="form-control"
                placeholder="Nights"
                value={formData.nights}
                onChange={(e) => handleInputChange("nights", e.target.value)}
              />
            </div>
          </div>
          <small className="text-muted">Example: 5 Days 4 Nights should be less than Days!</small>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label d-block">Hotel Category *</label>
            {["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"].map((cat, index) => (
              <div className="form-check" key={cat}>
                <input
                  type="radio"
                  name="hotelCategory"
                  className="form-check-input"
                  checked={formData.hotel_category === (index + 1).toString()}
                  onChange={() => handleInputChange("hotel_category", (index + 1).toString())}
                />
                <label className="form-check-label">{cat}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderItinerary = () => (
    <div className="form-container">
      <h3 className="mb-4 font-bold text-lg">Trip Itinerary</h3>
      {formData.itineraryDays.map((day) => (
        <div
          key={day.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginBottom: "12px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "#f8f9fa",
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => toggleDay(day.id)}
          >
            <span className="font-medium">{day.title}</span>
            {openDay === day.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>

          {openDay === day.id && (
            <div style={{ padding: "16px", background: "#fff" }}>
              <div className="form-group">
                <label>Day Title *</label>
                <input
                  type="text"
                  value={day.title}
                  onChange={(e) => handleItineraryChange(day.id, "title", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  placeholder="Trip Description"
                  value={day.description}
                  onChange={(e) => handleItineraryChange(day.id, "description", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Select Activities</label>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {["City Tour", "Beach Visit", "Trekking", "Sightseeing", "Shopping", "Adventure Sports"].map(
                    (activity) => (
                      <label key={activity} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <input
                          type="checkbox"
                          checked={day.activities.includes(activity)}
                          onChange={(e) => handleActivitiesChange(day.id, activity, e.target.checked)}
                        />
                        {activity}
                      </label>
                    )
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Hotel Name *</label>
                <input
                  type="text"
                  placeholder="Hotel Name"
                  value={day.hotel_name}
                  onChange={(e) => handleItineraryChange(day.id, "hotel_name", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Meal Plan</label>
                <div style={{ display: "flex", gap: "12px" }}>
                  {["Breakfast", "Lunch", "Dinner"].map((meal) => (
                    <label key={meal}>
                      <input
                        type="checkbox"
                        checked={day.meal_plan.includes(meal)}
                        onChange={(e) => handleMealPlanChange(day.id, meal, e.target.checked)}
                      />
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
        onClick={addNewDay}
        style={{
          marginTop: "12px",
          padding: "8px 16px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        + Add Another Day
      </button>
    </div>
  );

  const renderMedia = () => (
    <div className="form-container">
      <div className="media-header">
        <h3>Media Assets</h3>
        <p>Upload images and videos for your trip package</p>
      </div>
      <div style={{ display: "flex", justifyContent: "space-around", gap: 24, flexWrap: "wrap" }}>
        {/* HERO IMAGE */}
        <div className="media-section" style={{ flex: 1, minWidth: "380px" }}>
          <div className="section-title">
            📷 Hero Image / Thumbnail <span className="required">*</span>
          </div>
          <div className="upload-area" onClick={() => document.getElementById("heroImage")?.click()}>
            <div className="upload-icon">📷</div>
            <div className="upload-text">
              <h4>Upload Hero Image</h4>
              <p>Drag and drop or click to browse</p>
              {formData?.hero_image && <p>Selected: {formData?.hero_image}</p>}
            </div>
            <input
              type="file"
              id="heroImage"
              name="hero_image"
              accept=".png,.jpeg,.jpg,.webp"
              className="file-input"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
          </div>

          {formData?.hero_image && (
            <div className="upload-image-div" style={{ position: "relative", marginTop: 10 }}>
              <img src={`${formData?.hero_image}`} alt="Hero" />
              <button
                title="Remove image"
                onClick={removeHeroImage}
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  background: "rgba(255,0,0,0.85)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  fontSize: 16,
                  cursor: "pointer",
                  lineHeight: "24px",
                }}
              >
                ×
              </button>
            </div>
          )}
          <div className="file-restrictions" style={{ marginTop: 8 }}>
            • Use high quality JPG, PNG or WebP format
            <br />
            • Recommended size: 1200x800 pixels
            <br />
            • Maximum file size: 5MB
          </div>
        </div>

        {/* GALLERY */}
        <div className="media-section" style={{ flex: 1, minWidth: "380px" }}>
          <div className="section-title">
            🖼️ Image Gallery <span className="required">*</span>
          </div>
          <div className="upload-area" onClick={() => document.getElementById("galleryImages")?.click()}>
            <div className="upload-icon">🖼️</div>
            <div className="upload-text">
              <h4>Image Gallery</h4>
              <p>Click to select multiple images</p>
            </div>
            <input
              type="file"
              id="galleryImages"
              name="gallery_images"
              accept=".png,.jpeg,.jpg,.webp"
              multiple
              className="file-input"
              style={{ display: "none" }}
              onChange={handleMultipleFileUpload}
            />
          </div>

          {Array.isArray(formData?.gallery_images) && formData.gallery_images.length > 0 && (
            <div
              className="d-flex flex-wrap"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                marginTop: "12px",
              }}
            >
              {formData.gallery_images.map((image, index) => (
                <div
                  className="upload-image-div destination-image-div"
                  key={`${image}-${index}`}
                  style={{
                    position: "relative",
                    width: "140px",
                    height: "140px",
                    overflow: "hidden",
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                >
                  <div>
                    <img
                      src={encodeURI(image)}
                      alt={`Gallery-${index}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <button
                    title="Remove"
                    onClick={() => removeGalleryImage(index)}
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      background: "rgba(255,0,0,0.85)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "50%",
                      width: 22,
                      height: 22,
                      fontSize: 14,
                      cursor: "pointer",
                      lineHeight: "22px",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="file-restrictions" style={{ marginTop: 8 }}>
            Gallery best practices: • Upload 5-10 high-quality images
            <br />
            • Show different attractions and activities
            <br />
            • Include both landscape and close-up shots
            <br />
            • Maintain consistent quality and style
            <br />• Recommended size: 1200x800px minimum
          </div>
        </div>
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className="container">
      <h5 className="mb-3 fw-bold">Pricing Model *</h5>

      <div className="row mb-4">
        <div className="col-md-6">
          <div
            className={`p-3 border rounded d-flex align-items-center ${selectedPricing === "fixed" ? "border-primary" : ""}`}
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
              <label className="form-check-label fw-bold">Fixed Departure</label>
              <div className="small text-muted">Set specific dates with group bookings</div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div
            className={`p-3 border rounded d-flex align-items-center ${selectedPricing === "custom" ? "border-primary" : ""}`}
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
              <label className="form-check-label fw-bold">Customized Trip</label>
              <div className="small text-muted">Flexible dates based on customer preference</div>
            </div>
          </div>
        </div>
      </div>

      {selectedPricing === "fixed" && (
        <>
          <div className="mt-3 destination-faq">
            <div className="accordion" id="accordionExample">
              {fixedPackage.map((trip, index) => (
                <div className="mt-4" key={`pkg-${index}`}>
                  <div className="accordion-item">
                    <h2 className="accordion-header d-flex align-items-center justify-content-between">
                      <button
                        className="accordion-button flex-grow-1 fw-bold"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse${index}`}
                        aria-expanded="true"
                        aria-controls={`collapse${index}`}
                      >
                        Available Slots {index + 1}
                      </button>
                      <div className="ms-3 d-flex gap-2">
                        <button className={`destination-faq-add ${index === 0 && "me-3"}`} onClick={addFixedPackage}>
                          Add
                        </button>
                        {index !== 0 && (
                          <button
                            className="destination-faq-add faq-delete me-3"
                            onClick={() => deleteFixedPackage(index)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </h2>

                    <div id={`collapse${index}`} className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                      <div className="accordion-body">
                        <div className="row mb-3">
                          <div className="col-md-4">
                            <label className="form-label">From Date *</label>
                            <input
                              type="date"
                              className="form-control"
                              value={trip?.from_date}
                              onChange={(e) => updateFixedPackage(index, "from_date", e.target.value)}
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">To Date *</label>
                            <input
                              type="date"
                              className="form-control"
                              value={trip?.to_date}
                              onChange={(e) => updateFixedPackage(index, "to_date", e.target.value)}
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Available Slots *</label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Enter available slots"
                              value={trip?.available_slots}
                              onChange={(e) => updateFixedPackage(index, "available_slots", e.target.value)}
                            />
                          </div>
                        </div>

                        <h6 className="fw-bold mb-4 mt-5">Costing Packages</h6>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Package Title *</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g. Triple Occupancy"
                              value={trip?.title}
                              onChange={(e) => updateFixedPackage(index, "title", e.target.value)}
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Base Price (₹) *</label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Enter base price"
                              value={trip?.base_price}
                              onChange={(e) => updateFixedPackage(index, "base_price", e.target.value)}
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Discount (₹)</label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Enter discount price"
                              value={trip?.discount}
                              onChange={(e) => updateFixedPackage(index, "discount", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-4">
                            <label className="form-label">Booking Amount (₹)</label>
                            <input
                              type="number"
                              className="form-control"
                              value={trip?.booking_amount}
                              placeholder="Enter booking amount"
                              onChange={(e) => updateFixedPackage(index, "booking_amount", e.target.value)}
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">GST Percentage (%)</label>
                            <input
                              type="number"
                              className="form-control"
                              value={trip?.gst_percentage}
                              placeholder="Enter GST percentage"
                              onChange={(e) => updateFixedPackage(index, "gst_percentage", e.target.value)}
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Final Price (₹)</label>
                            <input
                              type="number"
                              className="form-control"
                              readOnly
                              value={trip?.final_price}
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
                  checked={formData.pricing.customized.pricing_type === "Price Per Person"}
                  onChange={() => handleCustomPricingChange("pricing_type", "Price Per Person")}
                />
                <label className="form-check-label">Price Per Person</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  name="pricingType"
                  className="form-check-input"
                  checked={formData.pricing.customized?.pricing_type === "Price Per Package"}
                  onChange={() => handleCustomPricingChange("pricing_type", "Price Per Package")}
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
                value={formData.pricing?.customized?.base_price}
                onChange={(e) => handleCustomPricingChange("base_price", e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Discount (₹)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter discount price"
                value={formData.pricing.customized?.discount}
                onChange={(e) => handleCustomPricingChange("discount", e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">GST Percentage (%)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter GST percentage"
                value={formData.pricing.customized?.gst_percentage || ""}
                onChange={(e) => handleCustomPricingChange("gst_percentage", e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label mt-3">Final Price (₹)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Auto-calculated"
                readOnly
                value={formData.pricing.customized?.final_price}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderDetails = () => (
    <div className="form-container details">
      <div style={{ display: "flex", justifyContent: "space-around", margin: "20px", gap: "20px" }}>
        <div style={{ border: "1px solid black", width: "100%", padding: "20px" }} className="form-container">
          <h3>Trip Highlight</h3>
          <label>Add Trip Highlight</label>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="TajMahal"
              value={highlightsInput}
              onChange={(e) => setHighlightsInput(e.target.value)}
              style={{ flexGrow: 1 }}
            />
            <button
              onClick={() => {
                if (highlightsInput.trim()) {
                  setFormData((p) => ({ ...p, highlights: [...p.highlights, highlightsInput.trim()] }));
                  setHighlightsInput("");
                }
              }}
            >
              +
            </button>
          </div>
          <div>
            {formData.highlights.map((highlight, index) => (
              <div
                key={index}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}
              >
                <span>{highlight}</span>
                <button onClick={() => removeItem("highlights", index)}>×</button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ border: "1px solid black", width: "100%", padding: "20px" }} className="form-container">
          <h3>Inclusions</h3>
          <label>Add Inclusions</label>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="4 Nights"
              value={inclusionsInput}
              onChange={(e) => setInclusionsInput(e.target.value)}
              style={{ flexGrow: 1 }}
            />
            <button
              onClick={() => {
                if (inclusionsInput.trim()) {
                  setFormData((p) => ({ ...p, inclusions: [...p.inclusions, inclusionsInput.trim()] }));
                  setInclusionsInput("");
                }
              }}
            >
              +
            </button>
          </div>
          <div>
            {formData.inclusions.map((inclusion, index) => (
              <div
                key={index}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}
              >
                <span>{inclusion}</span>
                <button onClick={() => removeItem("inclusions", index)}>×</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-around", margin: "20px", gap: "20px" }}>
        <div style={{ border: "1px solid black", width: "100%", padding: "20px" }} className="form-container">
          <h3>Exclusions</h3>
          <label>Add Exclusions</label>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Personal expenses"
              value={exclusionsInput}
              onChange={(e) => setExclusionsInput(e.target.value)}
              style={{ flexGrow: 1 }}
            />
            <button
              onClick={() => {
                if (exclusionsInput.trim()) {
                  setFormData((p) => ({ ...p, exclusions: [...p.exclusions, exclusionsInput.trim()] }));
                  setExclusionsInput("");
                }
              }}
            >
              +
            </button>
          </div>
          <div>
            {formData.exclusions.map((exclusion, index) => (
              <div
                key={index}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}
              >
                <span>{exclusion}</span>
                <button onClick={() => removeItem("exclusions", index)}>×</button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ border: "1px solid black", width: "100%", padding: "20px" }} className="form-container">
          <h3>FAQ (Optional)</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Enter FAQ question"
              value={faqInput?.question}
              onChange={(e) => setFaqInput({ ...faqInput, question: e.target.value })}
              style={{ width: "100%" }}
            />
            <input
              type="text"
              placeholder="Enter FAQ answer"
              value={faqInput?.answer}
              onChange={(e) => setFaqInput({ ...faqInput, answer: e.target.value })}
              style={{ width: "100%" }}
            />
            <button
              onClick={() => {
                if (faqInput?.question?.trim() && faqInput?.answer?.trim()) {
                  setFaqs((prev) => [...prev, faqInput]);
                  setFaqInput({ question: "", answer: "" });
                } else {
                  toast.warn("Please fill both question and answer!");
                }
              }}
            >
              Add FAQ
            </button>
          </div>

          <div>
            {faqs.length > 0 &&
              faqs.map((faq, index) =>
                faq.question && faq.answer ? (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                      borderBottom: "1px solid #ccc",
                      paddingBottom: "5px",
                    }}
                  >
                    <div>
                      <strong>Q:</strong> {faq.question}
                      <br />
                      <strong>A:</strong> {faq.answer}
                    </div>
                    <button
                      style={{
                        color: "white",
                        background: "red",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                      onClick={() => setFaqs((prev) => prev.filter((_, i) => i !== index))}
                    >
                      Delete
                    </button>
                  </div>
                ) : null
              )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPolicies = () => (
    <div className="form-container">
      <div className="form-group">
        <label>Terms and Conditions Content</label>
        <textarea
          rows={3}
          placeholder="Enter terms and conditions"
          value={formData.terms}
          onChange={(e) => handleInputChange("terms", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Cancellation Policy Content</label>
        <textarea
          rows={3}
          placeholder="Enter cancellation policy"
          value={formData.privacy_policy}
          onChange={(e) => handleInputChange("privacy_policy", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Payment Content</label>
        <textarea
          rows={3}
          placeholder="Enter payment details"
          value={formData.payment_terms}
          onChange={(e) => handleInputChange("payment_terms", e.target.value)}
        />
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case "basic":
        return renderBasic();
      case "itinerary":
        return renderItinerary();
      case "media":
        return renderMedia();
      case "pricing":
        return renderPricing();
      case "details":
        return renderDetails();
      case "policies":
        return renderPolicies();
      default:
        return <div>Step Not Found</div>;
    }
  };

  /* ===========================
     VIEW
  =========================== */
  return (
    <div className="tour-container">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="d-flex justify-content-between">
        <div className="tour-header">
          <h2>{id ? "Edit Trip" : "Add New Trip"}</h2>
          <p>Create a comprehensive travel package</p>
        </div>
        <div>
          <button className="admin-add-button mt-0" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: progress }} />
      </div>

      <div className="stepper">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const active = index <= currentIndex;
          return (
            <button key={step.id} onClick={() => setActiveStep(step.id)} className="step-button">
              <div className={`step-circle ${active ? "step-active" : "step-inactive"}`}>
                <Icon />
              </div>
              <span className={`step-label ${active ? "step-label-active" : "step-label-inactive"}`}>
                {step.label}
              </span>
            </button>
          );
        })}
      </div>

      {renderStepContent()}

      <div
        style={{
          marginTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#6b7280", fontSize: "14px" }}>
          {currentIndex + 1}/{steps.length} sections complete
        </span>
        <div style={{ display: "flex", gap: "8px" }}>
          {id ? (
            <button className="button button-green" onClick={handleUpdate} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Trip"}
            </button>
          ) : (
            <button className="button button-green" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Publishing..." : "Publish Trip"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
