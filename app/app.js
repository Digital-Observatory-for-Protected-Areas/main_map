mapboxgl.accessToken = 'pk.eyJ1IjoiZ2lzZGV2ZWxvcG1hcCIsImEiOiJjamZrdmp3bWYwY280MndteDg1dGlmdzF3In0.4m2zz_ISrUCXyz27MdL8_Q';


$(document).ready(function(){
    $('.modal').modal();
  });


$('#downloadLink').click(function() {
        var img = map.getCanvas().toDataURL('image/png')
        this.href = img
    })

$( ".scoring_section" ).click(function() {
  var instance = M.Collapsible.getInstance($('.country_scores_main')); 
instance.close();
});
$( "#country_name" ).click(function() {
  var instance = M.Collapsible.getInstance($('.manual_scores')); 
instance.close();
});

$(document).ready(function(){
    $('.tooltipped').tooltip();
  });
  $(document).ready(function(){
    $('.collapsible').collapsible();
  });


  $( ".search_icon" ).click(function() {
    $( "#geocoder" ).slideToggle( "slow", function() {});
    $( "#country_var_dropdown" ).hide();
    $( ".sidebar" ).hide();
    $( ".calculation-box" ).hide();
  });
  $( ".layers_icon" ).click(function() {
    $( "#country_var_dropdown" ).slideToggle( "slow", function() {});
    $( "#geocoder" ).hide();
    $( ".sidebar" ).hide();
    $( ".top_dropdown" ).hide();
    $( ".calculation-box" ).hide();
    $('.mapbox-gl-draw_trash').click();
    map.setFilter("countries_latest", ["!in", "adm0_code", "xxx"]);
    map.setFilter("grid_points_3", ["in", "adm0_code", "xxx"]);
  });
  $( ".legend_icon" ).click(function() {
    $( ".legend" ).slideToggle( "slow", function() {});
  });
  $( ".zoom_icon" ).click(function() {

map.flyTo({
    center: [20,20],
    zoom:1.5
});

});

var filterEl = document.getElementById('feature-filter');
var listingEl = document.getElementById('feature-listing');


function normalize(str) {
    return str.trim().toLowerCase();
}


function renderListings(features) {
  var empty = document.createElement("p");
  // Clear any existing listings
  // listingEl.innerHTML = "";
  if (features.length) {
    features.forEach(function (feature) {
      var prop = feature.properties;
      var item = document.createElement("a");
      item.href = prop.wikipedia;
      item.target = "_blank";
      item.textContent = prop.adm0_code + " (" + prop.adm0_code + ")";
      item.addEventListener("mouseover", function () {
        // Highlight corresponding feature on the map
        popup
          .setLngLat(getFeatureCenter(feature))
          .setText(
           'klajlkdas'
          )
          .addTo(map);
      });
     // listingEl.appendChild(item);
    });

    // Show the filter input
   // filterEl.parentNode.style.display = "block";
  } 
  // else if (features.length === 0 && filterEl.value !== "") {
  //   empty.textContent = "No results found";
  //  // listingEl.appendChild(empty);
  // }
//    else {
//     empty.textContent = "Drag the map to populate results";
//   //  listingEl.appendChild(empty);

//     // Hide the filter input
// //    filterEl.parentNode.style.display = "none";

//     // remove features filter***
//     map.setFilter("countries_latest", ["has", "id_gaul"]);
//   }
}


function getFeatureCenter(feature) {
	let center = [];
	let latitude = 0;
	let longitude = 0;
	let height = 0;
	let coordinates = [];
	feature.geometry.coordinates.forEach(function (c) {
		let dupe = [];
		if (feature.geometry.type === "MultiPolygon")
			dupe.push(...c[0]); //deep clone to avoid modifying the original array
		else 
			dupe.push(...c); //deep clone to avoid modifying the original array
		dupe.splice(-1, 1); //features in mapbox repeat the first coordinates at the end. We remove it.
		coordinates = coordinates.concat(dupe);
	});
	if (feature.geometry.type === "Point") {
		center = coordinates[0];
	}
	else {
		coordinates.forEach(function (c) {
			latitude += c[0];
			longitude += c[1];
		});
		center = [latitude / coordinates.length, longitude / coordinates.length];
	}

	return center;
}

function getUniqueFeatures(array, comparatorProperty) {
  var existingFeatureKeys = {};
  // Because features come from tiled vector data, feature geometries may be split
  // or duplicated across tile boundaries and, as a result, features may appear
  // multiple times in query results.
  var uniqueFeatures = array.filter(function (el) {
    if (existingFeatureKeys[el.properties[comparatorProperty]]) {
      return false;
    } else {
      existingFeatureKeys[el.properties[comparatorProperty]] = true;
      return true;
    }
  });

  return uniqueFeatures;
}





var zoomThreshold = 4;

var bounds = [
[-180, -70], // Southwest coordinates
[180, 80] // Northeast coordinates
];

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-streets-v10',
    center: [20, 20], // starting position[35.890, -75.664]
    zoom: 2.09, // starting zoom
    hash: true,
    minZoom: 1,
    opacity: 0.5,
   

    preserveDrawingBuffer: true
});





var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
});
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));




map.on('load', function() {

  var busy_tabs ={ spinner: "pulsar",color:'#67aa26',background:'##ffffff63'};
 $("#map").busyLoad("show", busy_tabs);




 map.addSource('single-point', {
  "type": "geojson",
  "data": {
      "type": "FeatureCollection",
      "features": []
  }
});
map.addLayer({
     "id": "point",
     "source": "single-point",
     "type": "circle",
     "paint": {
         "circle-radius": 0,
         "circle-color": "#007cbf"
     }
 });









var miolayer = map.getLayer('point');


geocoder.on('result', function(ev) {
  map.getSource('single-point').setData(ev.result.geometry);

  var latlon = ev.result.center;
  console.info(latlon)
  var lat = latlon[0]
  var lon = latlon[1]
  var pointsel = map.project(latlon)

  var ll = new mapboxgl.LngLat(lat, lon);


map.fire('click', { lngLat: ll, point:pointsel })



});

        map.addLayer({
          "id": "dopa_geoserver_wdpa_master_202101",
          "type": "fill",
          "source": {
              "type": "vector",
              "tiles": ["https://geospatial.jrc.ec.europa.eu/geoserver/gwc/service/wmts?layer=dopa_explorer_3:dopa_geoserver_wdpa_master_202101&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=application/x-protobuf;type=mapbox-vector&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}"]
              },
          "source-layer": "dopa_geoserver_wdpa_master_202101",
    
          'paint': { 
            'fill-color': [
              'match',
              ['get', 'marine'],
              '0',
              '#77bb0a',
              '1',
              '#d37c10',
              '2',
              '#13a6ec',
              /* other */ '#ccc'
              ],
              'fill-opacity': 0.6
    
    
                    }
    
      }, 'waterway-label');


 

      map.on('click', 'dopa_geoserver_wdpa_master_202101', function (e) {
        new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML('<a href="https://dopa.gis-ninja.eu/wdpa/'+e.features[0].properties.wdpaid+'" target="_blank">'+e.features[0].properties.name+'</a><hr><br><i>IUCN Category: <b>'+e.features[0].properties.iucn_cat+'</b></i><br><i>Reported Area: <b>'+e.features[0].properties.rep_area+'</b></i><br><i>Designation: <b>'+e.features[0].properties.desig_eng+'</b></i>')
        .addTo(map);
        });
         
        // Change the cursor to a pointer when the mouse is over the states layer.
        map.on('mouseenter', 'dopa_geoserver_wdpa_master_202101', function () {
        map.getCanvas().style.cursor = 'pointer';
        });
         
        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'dopa_geoserver_wdpa_master_202101', function () {
        map.getCanvas().style.cursor = '';
        });
        









    map.on("moveend", function () {
    var features = map.queryRenderedFeatures({ layers: ["dopa_geoserver_wdpa_master_202101"] });

    if (features) {
      var uniqueFeatures = getUniqueFeatures(features, "wdpaid");
      renderListings(uniqueFeatures);
      airports = uniqueFeatures;
    }
  });

  map.on("mousemove", "dopa_geoserver_wdpa_master_202101", function (e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = "pointer";

    // Populate the popup and set its coordinates based on the feature.
    var feature = e.features[0];
    var wdpa_id = e.features[0].properties.wdpaid;
    var wdpa_name = e.features[0].properties.name;


    popup.setLngLat(e.lngLat) .setHTML('<a href="https://dopa.gis-ninja.eu/wdpa/'+e.features[0].properties.wdpaid+'">'+e.features[0].properties.name+'</a><hr><br><i>IUCN Category: <b>'+e.features[0].properties.iucn_cat+'</b></i><br><i>Reported Area: <b>'+e.features[0].properties.rep_area+'</b></i><br><i>Designation: <b>'+e.features[0].properties.desig_eng+'</b></i>').addTo(map);
  });

  map.on("mouseleave", "dopa_geoserver_wdpa_master_202101", function () {
    map.getCanvas().style.cursor = "";
    map.getCanvas().style.cursor = "";
    popup.remove();
  });

  
  var tilesLoaded = map.areTilesLoaded();
  if (tilesLoaded == true){
    setTimeout(function(){
      $("#map").busyLoad("hide", {animation: "fade"});
   console.log('3')
    }, 300);

 }else{
    setTimeout(function(){
      $("#map").busyLoad("hide", {animation: "fade"});
      console.log('5')
    }, 1000);
     
  }


// Create a popup, but don't add it to the map yet.
var popup = new mapboxgl.Popup({
closeButton: false,
closeOnClick: false
});
 







}); // map on load function






// Create a popup, but don't add it to the map yet.
var popup = new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: true
});

map.addControl(new mapboxgl.NavigationControl());


