const map = L.map("map").setView([48.82750, 2.34870], 10);

//I know… i pushed my access token to mapbox, there is no data behind, it's just to fetch the map.
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
  {
    maxZoom: 20,
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
  },
).addTo(map);

var myRenderer = L.canvas({ padding: 0.4 });

const nodes = {};

document.getElementById("btn-graph").onclick = function () {
  const graph = document.getElementById("textarea-graph").value;
  const separator = document.getElementById("separator").value;
  const file = graph.split("\n");
  const nodes = {};
  for (const line of file) {
    const column = line.split(separator);
    if (column.length == 3) {
      const node = column[0];
      nodes[node] = { latitude: column[1], longitude: column[2] };
    }
    if (document.getElementById("links").checked == true) {
      if (column.length == 2) {
        const source = [nodes[column[0]].latitude, nodes[column[0]].longitude];
        const target = [nodes[column[1]].latitude, nodes[column[1]].longitude];
        const polyline = [source, target];
        const distance = haversine_distance(
          source[0],
          source[1],
          target[0],
          target[1],
        );
        L.polyline(polyline, { color: "blue" }).addTo(map).bindTooltip(
          `${distance.toFixed(2)} m`,
          { sticky: true },
        );
      }
    }
  }
  if (document.getElementById("nodes").checked == true) {
    displayNodes(nodes);
  }
  const first = nodes[Object.keys(nodes)[0]];
  const last = nodes[Object.keys(nodes)[Object.keys(nodes).length - 1]];
  map.fitBounds([[first.latitude, first.longitude], [
    last.latitude,
    last.longitude,
  ]]);
};

function displayNodes(nodes) {
  for (const node in nodes) {
    L.circleMarker(
      [nodes[node].latitude, nodes[node].longitude],
      {
        renderer: myRenderer,
        radius: 5,
      },
    ).addTo(map).bindTooltip(node);
  }
}

function haversine_distance(latitude1, longitude1, latitude2, longitude2) {
  const R = 6371008.7714; // IUGG  mean earth radius
  const d_lat = (latitude2 - latitude1) * (Math.PI / 180);
  const d_lon = (longitude2 - longitude1) * (Math.PI / 180);
  const lat1 = latitude1 * (Math.PI / 180);
  const lat2 = latitude2 * (Math.PI / 180);
  const a = Math.sin(d_lat / 2) * Math.sin(d_lat / 2) +
    Math.sin(d_lon / 2) * Math.sin(d_lon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}