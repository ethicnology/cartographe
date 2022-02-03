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
  const file = graph.split("\n");
  let last_pos = null;
  const nodes = {};
  for (const line of file) {
    const column = line.split("␟");
    if (column.length == 3) {
      const node = column[0];
      nodes[node] = { latitude: column[1], longitude: column[2] };
    }
    if (document.getElementById("links").checked == true) {
      if (column.length == 2) {
        let polyline = [];
        polyline.push([nodes[column[0]].latitude, nodes[column[0]].longitude]);
        polyline.push([nodes[column[1]].latitude, nodes[column[1]].longitude]);
        last_pos = L.polyline(polyline, { color: "blue" }).addTo(map);
      }
    }
  }
  if (document.getElementById("nodes").checked == true) {
    displayNodes(nodes);
  }
};

function displayNodes(nodes) {
  for (const node in nodes) {
    const marker = L.circleMarker(
      [nodes[node].latitude, nodes[node].longitude],
      {
        renderer: myRenderer,
        radius: 5,
      },
    ).addTo(map);
    marker.bindTooltip(node, { permanent: false, direction: "top" });
  }
}
