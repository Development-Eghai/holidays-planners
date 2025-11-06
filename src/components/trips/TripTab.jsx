import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  Star,
  ArrowRight,
  Send,
  CreditCard,
} from "lucide-react";

const API_KEY = "x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ";
const BASE_URL = "https://api.yaadigo.com/secure/api/trips/";

export default function TripTab({ tripId }) {
  const [tripData, setTripData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showFullOverview, setShowFullOverview] = useState(false);

  useEffect(() => {
    if (!tripId) return;
    const fetchTrip = async () => {
      try {
        const res = await axios.get(`${BASE_URL}${tripId}/`, {
          headers: { "x-api-key": API_KEY },
        });
        const data = res.data.data || res.data;
        setTripData(data);
      } catch (error) {
        console.error("Error fetching trip:", error);
      }
    };
    fetchTrip();
  }, [tripId]);

  const handleTabChange = (tabId) => {
    if (tabId !== activeTab) {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveTab(tabId);
        setIsAnimating(false);
      }, 150);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview & Highlights" },
    { id: "itinerary", label: "Itinerary" },
    { id: "inclusions", label: "Inclusions" },
    { id: "exclusions", label: "Exclusions" },
    { id: "other", label: "Other Info" },
  ];

  if (!tripData)
    return (
      <div className="text-center py-20 text-gray-500">Loading trip...</div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ================= LEFT SIDE: TABS ================= */}
          <div className="lg:col-span-7">
            <section>
              {/* Tabs */}
              <div className="bg-gradient-to-r from-cyan-100 via-blue-50 to-cyan-100 rounded-2xl shadow-xl overflow-hidden animate-slide-down">
                <div className="flex overflow-x-auto scrollbar-hide">
                  {tabs.map((tab, index) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`relative px-6 py-5 font-semibold whitespace-nowrap transition-all duration-500 flex-shrink-0 group ${
                        activeTab === tab.id
                          ? "text-cyan-700 bg-white shadow-lg"
                          : "text-gray-600 hover:text-cyan-600 hover:bg-white/50"
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 animate-expand"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div
                className={`bg-white rounded-2xl shadow-2xl mt-6 p-8 border border-gray-100 transition-all duration-300 ${
                  isAnimating
                    ? "opacity-0 translate-y-4"
                    : "opacity-100 translate-y-0 animate-fade-in-up"
                }`}
              >
                {/* ---------------- OVERVIEW ---------------- */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 animate-slide-in-left">
                      <div className="h-10 w-1.5 bg-gradient-to-b from-cyan-600 to-blue-600 rounded-full"></div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        Overview & Highlights
                      </h2>
                    </div>

                    {/* From → To */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-cyan-50 to-blue-50 border-l-4 border-cyan-600 rounded-r-2xl p-6 shadow-md animate-slide-in-right hover:shadow-lg transition-shadow duration-300">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-1" />
                        <p className="text-gray-800 font-medium leading-relaxed">
                          {tripData.pickup_location
                            ? `${tripData.pickup_location} → ${tripData.drop_location}`
                            : "Route information not available"}
                        </p>
                      </div>
                    </div>

                    {/* Overview */}
                    <div className="text-gray-700 leading-relaxed space-y-4 animate-fade-in">
                      <p className="text-lg">
                        {showFullOverview
                          ? tripData.overview
                          : `${tripData.overview?.slice(0, 400)}...`}
                      </p>
                      <button
                        onClick={() => setShowFullOverview(!showFullOverview)}
                        className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:text-cyan-700 transition-all duration-300 hover:gap-3 group"
                      >
                        {showFullOverview ? "Read Less" : "Read More"}
                        <span className="group-hover:translate-x-1 transition-transform">
                          {showFullOverview ? "←" : "→"}
                        </span>
                      </button>
                    </div>

                    {/* Highlights */}
                    {tripData.highlights && (
                      <div className="mt-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Star className="w-6 h-6 text-yellow-500" />
                          Trip Highlights
                        </h3>
                        <ul className="grid md:grid-cols-2 gap-3">
                          {tripData.highlights
                            .split("\n")
                            .filter((h) => h.trim() !== "")
                            .map((highlight, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2 text-gray-700 bg-yellow-50 rounded-lg px-3 py-2 border border-yellow-100 hover:shadow-md transition-all"
                              >
                                <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-1" />
                                <span>{highlight.replace("•", "").trim()}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* ---------------- ITINERARY ---------------- */}
                {activeTab === "itinerary" && (
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 animate-slide-in-left">
                      <div className="h-10 w-1.5 bg-gradient-to-b from-cyan-600 to-blue-600 rounded-full"></div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        Itinerary
                      </h2>
                    </div>
                    <div className="space-y-6 mt-8">
                      {tripData.itinerary?.length ? (
                        tripData.itinerary.map((item, index) => (
                          <div
                            key={index}
                            className="group relative pl-8 pb-8 animate-slide-up"
                            style={{ animationDelay: `${index * 0.15}s` }}
                          >
                            {index !== tripData.itinerary.length - 1 && (
                              <div className="absolute left-2.5 top-8 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 to-blue-400 opacity-30"></div>
                            )}
                            <div className="absolute left-0 top-1 w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full shadow-lg flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
                              <Calendar className="w-3 h-3 text-white" />
                            </div>
                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-cyan-200">
                              <div className="flex items-baseline gap-3 mb-2">
                                <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-bold rounded-full">
                                  Day {item.day_number}
                                </span>
                                <h3 className="text-xl font-bold text-gray-900">
                                  {item.title}
                                </h3>
                              </div>
                              <p className="text-gray-700 leading-relaxed mt-3">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">
                          Itinerary not available.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* ---------------- INCLUSIONS ---------------- */}
                {activeTab === "inclusions" && (
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 animate-slide-in-left">
                      <div className="h-10 w-1.5 bg-gradient-to-b from-cyan-600 to-blue-600 rounded-full"></div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        What's Included
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                      {tripData.inclusions
                        ?.split(",")
                        .map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl hover:shadow-lg transition-all duration-300 border border-green-100 hover:border-green-300 animate-scale-in group"
                          >
                            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-800 leading-relaxed font-medium">
                              {item.trim()}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* ---------------- EXCLUSIONS ---------------- */}
                {activeTab === "exclusions" && (
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 animate-slide-in-left">
                      <div className="h-10 w-1.5 bg-gradient-to-b from-cyan-600 to-blue-600 rounded-full"></div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        What's Not Included
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                      {tripData.exclusions
                        ?.split(",")
                        .map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-4 p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl hover:shadow-lg transition-all duration-300 border border-red-100 hover:border-red-300 animate-scale-in group"
                          >
                            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-800 leading-relaxed font-medium">
                              {item.trim()}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* ---------------- OTHER INFO ---------------- */}
                {activeTab === "other" && (
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 animate-slide-in-left">
                      <div className="h-10 w-1.5 bg-gradient-to-b from-cyan-600 to-blue-600 rounded-full"></div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        Important Information
                      </h2>
                    </div>
                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 border-l-4 border-blue-600 rounded-r-2xl p-8 shadow-lg animate-fade-in-up">
                      <p className="text-gray-800 leading-relaxed text-lg relative z-10">
                        {tripData.terms || "No additional info available."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* ================= RIGHT SIDE: CONTACT & BOOKING ================= */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6 lg:self-start">
            {/* Customize Trip */}
            <div className="relative overflow-hidden bg-white rounded-xl shadow-2xl border-4 border-cyan-500 animate-float">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-500 to-cyan-600 opacity-10 animate-gradient-shift"></div>
              <div className="relative z-10 p-6">
                <h3 className="text-xl font-bold text-cyan-700 mb-2">
                  Customize Trip
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Have specific requirements? Fill out this form to get a custom
                  quote.
                </p>
                <form className="space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-400 outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-400 outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-400 outline-none"
                  />
                  <textarea
                    placeholder="Tell us your requirements..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-400 outline-none"
                    rows={3}
                  ></textarea>
                  <button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" /> Send Custom Query
                  </button>
                </form>
              </div>
            </div>

            {/* Quick Booking */}
            <div className="relative overflow-hidden bg-white rounded-xl shadow-2xl border-4 border-blue-500 animate-float">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 opacity-10 animate-gradient-shift"></div>
              <div className="relative z-10 p-6">
                <h3 className="text-xl font-bold text-blue-700 mb-2">
                  Quick Booking
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Reserve your spot instantly with flexible payment options.
                </p>
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-5 mb-4 border-2 border-cyan-200 text-center">
                  <p className="text-sm text-gray-600 font-medium mb-1">
                    Starting from
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    ₹
                    {tripData.pricing?.customized?.final_price?.toLocaleString() ||
                      "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">per person</p>
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <CreditCard className="w-5 h-5" /> Book Now
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
