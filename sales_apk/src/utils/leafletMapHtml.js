/**
 * Geo helpers + OpenFreeMap (MapLibre) HTML for APK maps.
 * Kept file/function names stable for backward compatibility.
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
<link rel="stylesheet" href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css"/>
<script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"><\/script>
<style>
  html,body,#map{margin:0;padding:0;height:100%;width:100%;}
  .maplibregl-ctrl-top-right,.maplibregl-ctrl-bottom-right,.maplibregl-ctrl-bottom-left{display:none!important;}
</style>
</head>
<body>
<div id="map"></div>
<script>
(function(){
  var pins = ${pinsJson};
  var map = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: [${centerLng}, ${centerLat}],
    zoom: ${DEFAULT_ZOOM_EMPTY},
    attributionControl: false
  });

  var bounds = [];
  var markerEls = [];
  pins.forEach(function(pin){
    var el = document.createElement('div');
    if (pin.recordType === 'self') {
      // Prominent Google-like blue location dot for current user.
      el.innerHTML =
        '<div style="position:relative;width:28px;height:28px;">' +
        '<div style="position:absolute;inset:0;border-radius:999px;background:rgba(37,99,235,0.28);animation:selfPulse 1.8s ease-out infinite;"></div>' +
        '<div style="position:absolute;left:6px;top:6px;width:16px;height:16px;border-radius:999px;background:#2563EB;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.25);"></div>' +
        '</div>';
      el.style.width = '28px';
      el.style.height = '28px';
    } else {
      el.innerHTML =
        '<div style="width:30px;height:30px;border-radius:50%;background:' +
        pin.color +
        ';border:3px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;"><svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg></div><div style="width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:9px solid ' +
        pin.color +
        ';margin:auto;margin-top:-2px;"></div>';
      el.style.width = '30px';
      el.style.height = '40px';
    }
    el.style.cursor = 'pointer';
    var marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([pin.longitude, pin.latitude])
      .addTo(map);
    markerEls.push(marker);
    bounds.push([pin.longitude, pin.latitude]);
    el.addEventListener('click', function(){
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: 'pinPress', pin: { id: pin.id, recordType: pin.recordType } })
        );
      }
    });
  });

  map.on('load', function(){
    var selfPin = pins.find(function(p){ return p.recordType === 'self'; });
    if (selfPin && Number.isFinite(selfPin.latitude) && Number.isFinite(selfPin.longitude)) {
      map.jumpTo({ center: [selfPin.longitude, selfPin.latitude], zoom: 15 });
    } else if (bounds.length === 0) {
      map.jumpTo({ center: [${centerLng}, ${centerLat}], zoom: ${DEFAULT_ZOOM_EMPTY} });
    } else if (bounds.length === 1) {
      map.jumpTo({ center: bounds[0], zoom: ${DEFAULT_ZOOM_SINGLE} });
    } else {
      var minLng = bounds[0][0], minLat = bounds[0][1], maxLng = bounds[0][0], maxLat = bounds[0][1];
      for (var i = 1; i < bounds.length; i++) {
        minLng = Math.min(minLng, bounds[i][0]);
        minLat = Math.min(minLat, bounds[i][1]);
        maxLng = Math.max(maxLng, bounds[i][0]);
        maxLat = Math.max(maxLat, bounds[i][1]);
      }
      map.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 48, maxZoom: 16, duration: 0 });
    }
  });
})();
<\/script>
<style>
@keyframes selfPulse {
  0% { transform: scale(0.5); opacity: 0.8; }
  70% { transform: scale(1.5); opacity: 0; }
  100% { transform: scale(1.5); opacity: 0; }
}
</style>
</body>
</html>`;
}
