function buildMapsUrl(originLat, originLng, destLat, destLng, name = "hospital") {
  const hasDestination = Number.isFinite(Number(destLat)) && Number.isFinite(Number(destLng));
  const hasOrigin = Number.isFinite(Number(originLat)) && Number.isFinite(Number(originLng));
  if (hasDestination && hasOrigin) {
    return `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=driving`;
  }
  if (hasDestination) {
    return `https://www.google.com/maps/search/?api=1&query=${destLat},${destLng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name || "hospital")}`;
}

module.exports = buildMapsUrl;
