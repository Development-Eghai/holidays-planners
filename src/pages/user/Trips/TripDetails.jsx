import React from "react";
import { useParams } from "react-router-dom";
import TripHero from "../../../components/trips/TripHero";
import TripOverview from "../../../components/trips/TripOverview";
import TripTab from "../../../components/trips/TripTab";
import RelatedTrips from "../../../components/trips/RelatedTrips";
import Blog from "../../../components/charts/BlogComponent";
import FAQ from "../../../components/charts/FAQ";

const TripDetails = () => {
  const { id, slug } = useParams();

  console.log("TripDetails → Route Params:", { slug, id });

  return (
    <div className="trip-container">
      {/* HERO IMAGE SECTION */}
      <TripHero tripId={id} />

      {/* OVERVIEW / DETAILS */}
      <TripOverview tripId={id} />

      {/* ITINERARY & OTHER TABS */}
      <TripTab tripId={id} />

      {/* RELATED TRIPS */}
      <RelatedTrips currentTripId={id} />

      {/* FAQ SECTION */}
      <FAQ tripId={id} />

      {/* BLOG SECTION (temporarily hidden) */}
      {false && <Blog currentTripId={id} />}
    </div>
  );
};

export default TripDetails;
