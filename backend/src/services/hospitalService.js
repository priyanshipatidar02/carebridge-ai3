const axios = require("axios");
const buildMapsUrl = require("../utils/mapsUrl");

function estimateTravelTime(distanceKm = 0) {
  return `${Math.max(1, Math.ceil((Number(distanceKm) / 25) * 60))} min approx`;
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = deg => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function getNearbyHospitals(lat, lng) {
  const originLat = Number(lat);
  const originLng = Number(lng);
  if (!Number.isFinite(originLat) || !Number.isFinite(originLng)) return [];

  if (!process.env.MAPS_API_KEY || process.env.MAPS_API_KEY === "placeholder") {
    return [];
  }

  try {
    // Geoapify-compatible Places API. Use Geoapify key as MAPS_API_KEY.
    const url = "https://api.geoapify.com/v2/places";
    const params = {
      categories: "healthcare.hospital",
      filter: `circle:${originLng},${originLat},25000`,
      bias: `proximity:${originLng},${originLat}`,
      limit: 8,
      apiKey: process.env.MAPS_API_KEY
    };
    const { data } = await axios.get(url, { params, timeout: 15000 });
    return (data.features || []).map((f) => {
      const props = f.properties || {};
      const coords = f.geometry?.coordinates || [];
      const destLng = Number(coords[0]);
      const destLat = Number(coords[1]);
      const distanceKm = props.distance ? Number(props.distance) / 1000 : haversineKm(originLat, originLng, destLat, destLng);
      const name = props.name || "Nearby healthcare facility";
      return {
        name,
        address: props.formatted || [props.address_line1, props.address_line2].filter(Boolean).join(", "),
        distanceKm: Number(distanceKm.toFixed(2)),
        estimatedTravelTime: estimateTravelTime(distanceKm),
        phone: props.contact?.phone || props.phone || "",
        mapsUrl: buildMapsUrl(originLat, originLng, destLat, destLng, name),
        lat: destLat,
        lng: destLng
      };
    });
  } catch (error) {
    console.error("Hospital service error:", error.response?.data || error.message);
    return [];
  }
}

module.exports = { getNearbyHospitals, estimateTravelTime };
