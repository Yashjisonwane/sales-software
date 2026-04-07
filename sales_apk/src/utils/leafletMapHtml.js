/**
 * Geo helpers + Leaflet HTML for Explore maps (real job/lead coordinates).
 * Default view: Indore area when there are no valid pins.
 */
export const DEFAULT_MAP_CENTER = { lat: 22.7196, lng: 75.8577 };
export const DEFAULT_ZOOM_EMPTY = 12;
export const DEFAULT_ZOOM_SINGLE = 14;

export function pickLatLng(entity) {
  if (!entity || typeof entity !== 'object') return null;
  const lat = entity.latitude ?? entity.lat;
  const lng = entity.longitude ?? entity.lng ?? entity.lon;
  const la = typeof lat === 'number' ? lat : parseFloat(lat);
  const lo = typeof lng === 'number' ? lng : parseFloat(lng);
  if (!Number.isFinite(la) || !Number.isFinite(lo)) return null;
  if (Math.abs(la) > 90 || Math.abs(lo) > 180) return null;
  return { latitude: la, longitude: lo };
}

/**
 * @param {Array<{ latitude: number, longitude: number, color: string, id: string, recordType: string }>} pins
 */
export function buildLeafletPinsMapHtml(pins) {
  const safe = (pins || []).filter(
    (p) =>
      p &&
      Number.isFinite(p.latitude) &&
      Number.isFinite(p.longitude) &&
      p.id != null
  );
  const pinsJson = JSON.stringify(
    safe.map((p) => ({
      latitude: p.latitude,
      longitude: p.longitude,
      color: p.color || '#0E56D0',
      id: String(p.id),
      recordType: p.recordType || 'job',
    }))
  );

  const centerLat = DEFAULT_MAP_CENTER.lat;
  const centerLng = DEFAULT_MAP_CENTER.lng;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
<style>
  html,body,#map{margin:0;padding:0;height:100%;width:100%;}
  .leaflet-control-zoom,.leaflet-control-attribution{display:none!important;}
</style>
</head>
<body>
<div id="map"></div>
<script>
(function(){
  var pins = ${pinsJson};
  var map = L.map('map', { zoomControl: false, attributionControl: false });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

  var bounds = [];
  pins.forEach(function (pin) {
    var dot =
      '<div style="width:30px;height:30px;border-radius:50%;background:' +
      pin.color +
      ';border:3px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;"><svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg></div><div style="width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:9px solid ' +
      pin.color +
      ';margin:auto;margin-top:-2px;"></div>';
    var icon = L.divIcon({ html: dot, className: '', iconSize: [30, 40], iconAnchor: [15, 40] });
    var m = L.marker([pin.latitude, pin.longitude], { icon: icon }).addTo(map);
    bounds.push([pin.latitude, pin.longitude]);
    m.on('click', function () {
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: 'pinPress', pin: { id: pin.id, recordType: pin.recordType } })
        );
      }
    });
  });

  if (bounds.length === 0) {
    map.setView([${centerLat}, ${centerLng}], ${DEFAULT_ZOOM_EMPTY});
  } else if (bounds.length === 1) {
    map.setView(bounds[0], ${DEFAULT_ZOOM_SINGLE});
  } else {
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 16 });
  }
})();
<\/script>
</body>
</html>`;
}
