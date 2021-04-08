mapboxgl.accessToken = 'pk.eyJ1IjoiZ2lzZGV2ZWxvcG1hcCIsImEiOiJjamZrdmp3bWYwY280MndteDg1dGlmdzF3In0.4m2zz_ISrUCXyz27MdL8_Q';
$(document).ready(function(){
    $('.modal').modal();
  });

  $('.all_tools').click(function() {
    $('.pa_select').toggle();
    $('.country_select').toggle();
    $('.ecoregion_select').toggle();
    $('.live_select').toggle();
    $('.search_icon').toggle();
})


  $(document).ready(function(){
    $('select').formSelect();
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
    $( "#live_var_dropdown" ).hide();
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

  if (features.length) {
    features.forEach(function (feature) {
      var prop = feature.properties;
      var item = document.createElement("a");
      item.href = prop.wikipedia;
      item.target = "_blank";
      item.textContent = prop.adm0_code + " (" + prop.adm0_code + ")";
      item.addEventListener("mouseover", function () {
        popup
          .setLngLat(getFeatureCenter(feature))
          .setText(
           'klajlkdas'
          )
          .addTo(map);
      });
    });
  } 
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
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [15, 22], // starting position[35.890, -75.664]
    zoom: 2.09, // starting zoom
    hash: true,
    minZoom: 2.09,
    opacity: 0.5,
   

    preserveDrawingBuffer: true
});






var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
});
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

map.on('load', function() {

  var busy_tabs ={ spinner: "pulsar",color:'#67aa26',background:'#000000ab'};
// $("#map").busyLoad("show", busy_tabs);

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

// calculate today date
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
if(dd<10) {dd = '0'+dd}
if(mm<10) { mm = '0'+mm}
today = yyyy + '-' + mm + '-' + dd;

// calculate initial date 7 days before today
var date_7 = new Date();
date_7.setDate(date_7.getDate() - 7);
var dd_7 = date_7.getDate();
var mm_7 = date_7.getMonth()+1; //January is 0!
if(dd_7<10) { dd_7 = '0'+dd_7}
if(mm_7<10) { mm_7 = '0'+mm_7}
var StartDate_7 = date_7.getFullYear()+'-'+ mm_7 +'-'+dd_7;

// calculate initial date 30 days before today
var date_30 = new Date();
date_30.setDate(date_30.getDate() - 30);
var dd_30 = date_30.getDate();
var mm_30 = date_30.getMonth()+1; //January is 0!
if(dd_30 < 10) {dd_30 = '0'+dd_30}
if(mm_30 <10) {mm_30 = '0'+mm_30}
var StartDate_30 = date_30.getFullYear()+'-'+ mm_30 +'-'+dd_30;

// calculate initial date 90 days before today
var date_90 = new Date();
date_90.setDate(date_90.getDate() - 90);
var dd_90 = date_90.getDate();
var mm_90 = date_90.getMonth()+1; //January is 0!
if(dd_90 < 10) {dd_90 = '0'+dd_90}
if(mm_90 <10) {mm_90 = '0'+mm_90}
var StartDate_90 = date_90.getFullYear()+'-'+ mm_90 +'-'+dd_90;


var fires_time_7 = StartDate_7+'/'+today
var fires_time_30 = StartDate_30+'/'+today
var fires_time_90 = StartDate_90+'/'+today


map.addLayer({
  "id": "floods",
  "type": "raster",
  "source": {
      "type": "raster",
      "tiles": ["https://cors.bridged.cc/https://globalfloods-ows.ecmwf.int/glofas-ows/ows.py?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.3.0&request=GetMap&crs=EPSG:3857&transparent=true&width=256&height=256&layers=FloodHazard100y&zIndex=70&opacity=1&time="+today],
      "tileSize": 256
      
      },
  "source-layer": "floods",
  'layout': {
    'visibility': 'none'
    }


}, 'waterway-label');

// sst //
map.addLayer({
  "id": "sst",
  "type": "raster",
  "source": {
      "type": "raster",
      "tiles": ["https://cors.bridged.cc/https://coralreefwatch.noaa.gov/data1/vs/google_maps/sst/sst_gm_tiles/{z}/{x}/{y}.png"],
      "tileSize": 256,
      'scheme': "tms",
      },
  "source-layer": "sst",
  'layout': {
    'visibility': 'none'
    }
}, 'waterway-label');

// ssta //Sea Surface Temperature Anomaly 
map.addLayer({
  "id": "ssta",
  "type": "raster",
  "source": {
      "type": "raster",
      "tiles": ["https://cors.bridged.cc/https://coralreefwatch.noaa.gov/data1/vs/google_maps/ssta/ssta_gm_tiles/{z}/{x}/{y}.png"],
      "tileSize": 256,
      'scheme': "tms",
      },
  "source-layer": "ssta",
  'layout': {
    'visibility': 'none'
    }
}, 'waterway-label');

// sst_trend //Sea Surface Trend 
map.addLayer({
  "id": "sst_trend",
  "type": "raster",
  "source": {
      "type": "raster",
      "tiles": ["https://cors.bridged.cc/https://coralreefwatch.noaa.gov/data1/vs/google_maps/sst_trend/sst_trend_gm_tiles/{z}/{x}/{y}.png"],
      "tileSize": 256,
      'scheme': "tms",
      },
  "source-layer": "sst_trend",
  'layout': {
    'visibility': 'none'
    }
}, 'waterway-label');

// baa_max_running //Daily Coral Bleaching Heat Stress Alert Area
map.addLayer({
  "id": "baa_max_running",
  "type": "raster",
  "source": {
      "type": "raster",
      "tiles": ["https://cors.bridged.cc/https://coralreefwatch.noaa.gov/data1/vs/google_maps/baa_max_running/baa_gm_tiles/{z}/{x}/{y}.png"],
      "tileSize": 256,
      'scheme': "tms",
      },
  "source-layer": "baa_max_running",
  'layout': {
    'visibility': 'none'
    }
}, 'waterway-label');



// hs //Coral Bleaching HotSpot
map.addLayer({
  "id": "hs",
  "type": "raster",
  "source": {
      "type": "raster",
      "tiles": ["https://cors.bridged.cc/https://coralreefwatch.noaa.gov/data1/vs/google_maps/hs/hs_gm_tiles/{z}/{x}/{y}.png"],
      "tileSize": 256,
      'scheme': "tms",
      },
  "source-layer": "hs",
  'layout': {
    'visibility': 'none'
    }
}, 'waterway-label');




map.addLayer({
  "id": "fires_1",
  "type": "raster",
  "source": {
      "type": "raster",
      "tiles": ["https://cors.bridged.cc/https://ies-ows.jrc.ec.europa.eu/gwis?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=modis.hs&zIndex=72&opacity=1&time="+today],
      "tileSize": 256,
      'scheme': "tms",
      },
  "source-layer": "fires_1",
  'layout': {
    'visibility': 'none'
    }
}, 'waterway-label');

map.addLayer({
  "id": "fires_7",
  "type": "raster",
  "source": {
      "type": "raster",
      "tiles": ["https://cors.bridged.cc/https://ies-ows.jrc.ec.europa.eu/gwis?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=modis.hs&zIndex=72&opacity=1&time="+fires_time_7],
      "tileSize": 256,
      'scheme': "tms",
      },
  "source-layer": "fires_7",
  'layout': {
    'visibility': 'none'
    }
}, 'waterway-label');

map.addLayer({
  "id": "fires_30",
  "type": "raster",
  "source": {
      "type": "raster",
      "tiles": ["https://cors.bridged.cc/https://ies-ows.jrc.ec.europa.eu/gwis?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=modis.hs&zIndex=72&opacity=1&time="+fires_time_30],
      "tileSize": 256,
      'scheme': "tms",
      },
  "source-layer": "fires_30",
  'layout': {
    'visibility': 'none'
    }
}, 'waterway-label');

map.addLayer({
  "id": "fires_90",
  "type": "raster",
  "source": {
      "type": "raster",
      "tiles": ["https://cors.bridged.cc/https://ies-ows.jrc.ec.europa.eu/gwis?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=modis.hs&zIndex=72&opacity=1&time="+fires_time_90],
      "tileSize": 256,
      'scheme': "tms",
      },
  "source-layer": "fires_90",
  'layout': {
    'visibility': 'none'
    }
}, 'waterway-label');

//temperature
map.addLayer({
"id": "temperature",
"type": "raster",
"source": {
    "type": "raster",
    "tiles": ["https://cors.bridged.cc/https://e.sat.owm.io/vane/2.0/weather/TA2/{z}/{x}/{y}?appid=9de243494c0b295cca9337e1e96b00e2&fill_bound"],
    "tileSize": 256,
   
    },
"source-layer": "temperature",
'layout': {
  'visibility': 'none'
  }
}, 'waterway-label');

//pressure
map.addLayer({
  "id": "pressure",
  "type": "raster",
  "source": {
      "type": "raster",
      "tiles": ["https://a.sat.owm.io/vane/2.0/weather/APM/{z}/{x}/{y}?appid=9de243494c0b295cca9337e1e96b00e2"],
      "tileSize": 256,
     
      },
  "source-layer": "pressure",
  'layout': {
    'visibility': 'none'
    }
  }, 'waterway-label');

//wind_speed
map.addLayer({
  "id": "wind_speed",
  "type": "raster",
  "source": {
      "type": "raster",
      "tiles": ["  https://c.sat.owm.io/vane/2.0/weather/WS10/{z}/{x}/{y}?appid=9de243494c0b295cca9337e1e96b00e2"],
      "tileSize": 256,
     
      },
  "source-layer": "wind_speed",
  'layout': {
    'visibility': 'none'
    }
  }, 'waterway-label');


  //clouds
map.addLayer({
  "id": "clouds",
  "type": "raster",
  "source": {
      "type": "raster",
      "tiles": [" https://c.sat.owm.io/vane/2.0/weather/CL/{z}/{x}/{y}?appid=9de243494c0b295cca9337e1e96b00e2"],
      "tileSize": 256,
     
      },
  "source-layer": "clouds",
  'layout': {
    'visibility': 'none'
    }
  }, 'waterway-label');

    //clouds
var d = new Date();
var hour = d.getHours()-2;
map.addLayer({
  "id": "precipitations",
  "type": "raster",
  "source": {
      "type": "raster",
      "tiles": [" https://c.sat.owm.io/maps/2.0/radar/{z}/{x}/{y}?appid=9de243494c0b295cca9337e1e96b00e2&day="+today+"T"+hour+":00"],
      "tileSize": 256,
     
      },
  "source-layer": "precipitations",
  'layout': {
    'visibility': 'none'
    }
  }, 'waterway-label');






function addEMMNews(){
  var emmGeoJson = {
    "type": "FeatureCollection",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
  };

  jQuery.ajax({
    url: "https://cors.bridged.cc/https://rris.biopama.org/news/news.rss",
    dataType: 'xml',
    success: function(d) {
      var emmArticles = [];
      jQuery(d).find("item").each(function(){
        var emmTitle = jQuery(this).find("title").text();
        var emmLink = jQuery(this).find("link").text();
        var emmGUID = jQuery(this).find("guid").text();
        var emmDate = jQuery(this).find("pubDate").text();
        var emmDescription = jQuery(this).find("description").text();
        var emmPoint = jQuery(this).find("georss\\:point").text();
        //take only the results that have points
        if (emmPoint.length > 2){
          var emmLoc = emmPoint.split(" ");
          var emmXcoord = parseInt(emmLoc[1]);
          var emmYcoord = parseInt(emmLoc[0]);
          emmCoords = [emmXcoord, emmYcoord, 0];
          var emmArticle = { "type": "Feature", "properties": { "id": emmGUID, "title": emmTitle, "link": emmLink, "description": emmDescription, "date": emmDate }, "geometry": { "type": "Point", "coordinates": emmCoords } }
          //console.log(emmArticle);
          emmArticles.push(emmArticle)
        }
      });
      emmGeoJson.features = emmArticles;
      map.addSource("emm-news", {
        type: "geojson",
        data: emmGeoJson,
        cluster: true,
        clusterMaxZoom: 10,
        clusterRadius: 30
      });
      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "emm-news",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#1e90ff",
            5,
            "#1e90ff",
            10,
            "#1e90ff"
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            10,
            5,
            15,
            10,
            20
          ]
        }
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "emm-news",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12
        }
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "emm-news",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#1e90ff",
          "circle-radius": 6,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff"
        }
      });

      // inspect a cluster on click
      map.on('click', 'clusters', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        var clusterId = features[0].properties.cluster_id;
        map.getSource('emm-news').getClusterExpansionZoom(clusterId, function (err, zoom) {
          if (err)
            return;
          var curZoom = map.getZoom();
          
          if (curZoom == zoom){
            console.log(features)
          } else {
            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom + 1
            });
          }
        });
      });
      map.on('click', 'unclustered-point', function (e) {
        console.log(e.features)
        var popText = '';
        var coordinates = e.features[0].geometry.coordinates.slice();
        for (var key in e.features) {
        popText = popText + "<h5>" + e.features[key].properties.title + "</h5>" +
            "<hr>" +
            "<span class='news-desc'>" + e.features[key].properties.description + "</span>" +
            "<hr>" +
            "<div class='pop-news-date'>" + e.features[key].properties.date + "</div>" +
            "<span class='news-link'><a href='" + e.features[key].properties.link + "' target='_blank' class='btn' role='button'>Read More</a></span>";
        }

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(popText)
          .addTo(map);
      });

      map.on('mouseenter', 'clusters', function () {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'clusters', function () {
        map.getCanvas().style.cursor = '';
      });
      map.on('mouseenter', 'unclustered-point', function () {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'unclustered-point', function () {
        map.getCanvas().style.cursor = '';
      });
      
    },
    error: function() {
      console.log("No news")
    }
  });	

}



$('#live_layer_container .live_layer').each(function(idx, el){
var element = $(el);
var classname= element.attr('class').split(' ')[1];
$('.live_layer_legend_' + classname).hide();
if (classname=='news'){
  $('.' + classname).click(function() {
    if($(this).hasClass('layer_on')){
      map.setLayoutProperty('cluster-count', 'visibility', 'none');
      map.setLayoutProperty('unclustered-point', 'visibility', 'none');
      map.setLayoutProperty('clusters', 'visibility', 'none');
      $(this).removeClass( "layer_on" );
      $('.live_layer_legend_' + classname).hide();
    }else{
      addEMMNews()
      map.setLayoutProperty('cluster-count', 'visibility', 'visible');
      map.setLayoutProperty('unclustered-point', 'visibility', 'visible');
      map.setLayoutProperty('clusters', 'visibility', 'visible');
      $(this).addClass( "layer_on" );
      $('.live_layer_legend_' + classname).show();
    }
  });
}else{
  $('.' + classname).click(function() {
    if($(this).hasClass('layer_on')){
      map.setLayoutProperty(classname, 'visibility', 'none');
      $(this).removeClass( "layer_on" );
      $('.live_layer_legend_' + classname).hide();
      
    }else{
      map.setLayoutProperty(classname, 'visibility', 'visible');
      $(this).addClass( "layer_on" );
      $('.live_layer_legend_' + classname).show();
    }
  });
}


})











        map.addLayer({
          "id": "dopa_geoserver_wdpa_master_202101_o1",
          "type": "fill",
          "source": {
              "type": "vector",
              "tiles": ["https://geospatial.jrc.ec.europa.eu/geoserver/gwc/service/wmts?layer=dopa_explorer_3:dopa_geoserver_wdpa_master_202101_o1&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=application/x-protobuf;type=mapbox-vector&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}"]
              },
          "source-layer": "dopa_geoserver_wdpa_master_202101_o1",
    
          'paint': { 
            'fill-color': [
              'match',
              ['get', 'marine'],
              '0',
              '#77bb0b',
              '1',
              '#b9cda5',
              '2',
              '#13a6ec',
              /* other */ '#ccc'
              ],
              'fill-opacity': 0.5
              },  'filter': ["in", "wdpaid",'xxx']
    
      }, 'waterway-label');

      map.addLayer({
        "id": "wdpa_high",
        "type": "fill",
        "source": {
            "type": "vector",
            "tiles": ["https://geospatial.jrc.ec.europa.eu/geoserver/gwc/service/wmts?layer=dopa_explorer_3:dopa_geoserver_wdpa_master_202101_o1&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=application/x-protobuf;type=mapbox-vector&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}"]
            },
        "source-layer": "dopa_geoserver_wdpa_master_202101_o1",
  
        'paint': { 
          'fill-color': [
            'match',
            ['get', 'marine'],
            '0',
            '#7fbc41',
            '1',
            '#b9cda5',
            '2',
            '#13a6ec',
            /* other */ '#ccc'
            ],
            'fill-opacity': 1
            }, 'filter': ["in", "wdpaid",'xxx'],
  
    }, 'waterway-label');

    map.addLayer({
      "id": "wdpa_high2",
      "type": "fill",
      "source": {
          "type": "vector",
          "tiles": ["https://geospatial.jrc.ec.europa.eu/geoserver/gwc/service/wmts?layer=dopa_explorer_3:dopa_geoserver_wdpa_master_202101_o1&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=application/x-protobuf;type=mapbox-vector&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}"]
          },
      "source-layer": "dopa_geoserver_wdpa_master_202101_o1",

      'paint': {
        'fill-color': 'white',
        'fill-opacity': 0.3,
        'fill-outline-color': 'white'
      }, 'filter': ["in", "wdpaid",'xxx'],

  }, 'waterway-label');

      map.addLayer({
        "id": "dopa_geoserver_global_dash",
        "type": "fill",
        "source": {
            "type": "vector",
            "tiles": ["https://geospatial.jrc.ec.europa.eu/geoserver/gwc/service/wmts?layer=dopa_explorer_3:dopa_geoserver_global_dash&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=application/x-protobuf;type=mapbox-vector&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}"]
            },
        "source-layer": "dopa_geoserver_global_dash",
  
        'paint': {
          'fill-color': {
            property: 'prot_perc_ind', 
            stops: [
              [0, '#c51b7d'],
              [1, '#de77ae'],
              [2, '#f1b6da'],
              [5, '#fde0ef'],
              [8, '#f7f7f7'],
              [12, '#e6f5d0'],
              [17, '#b8e186'],
              [30, '#7fbc41'],
              [50, '#4d9221']
            ]
          },
          'fill-opacity': 0.8
        }
  
    }, 'waterway-label');

    map.addLayer({
      "id": "country_high",
      "type": "fill",
      "source": {
          "type": "vector",
          "tiles": ["https://geospatial.jrc.ec.europa.eu/geoserver/gwc/service/wmts?layer=dopa_explorer_3:dopa_geoserver_global_dash&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=application/x-protobuf;type=mapbox-vector&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}"]
          },
      "source-layer": "dopa_geoserver_global_dash",

      'paint': {
        'fill-color': 'white',
        'fill-opacity': 0.1,
        'fill-outline-color': 'white'
      }, 'filter': ["in", "wdpaid",'xxx'],

  }, 'waterway-label');

    map.addLayer({
      "id": "dopa_geoserver_ecoregions_master_201905",
      "type": "fill",
      "source": {
          "type": "vector",
          "tiles": ["https://geospatial.jrc.ec.europa.eu/geoserver/gwc/service/wmts?layer=dopa_explorer_3:dopa_geoserver_ecoregions_master_201905&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=application/x-protobuf;type=mapbox-vector&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}"]
          },
      "source-layer": "dopa_geoserver_ecoregions_master_201905",

      'paint': {
        'fill-color': {
          property: 'protection', 
          stops: [
            [0, '#c51b7d'],
            [1, '#de77ae'],
            [2, '#f1b6da'],
            [5, '#fde0ef'],
            [8, '#f7f7f7'],
            [12, '#e6f5d0'],
            [17, '#b8e186'],
            [30, '#7fbc41'],
            [50, '#4d9221']
          ]
        },
        'fill-opacity': 0.8
      },'filter': ["in", "id",'xxx'],

  }, 'waterway-label');

  map.addLayer({
    "id": "ecoregion_high",
    "type": "fill",
    "source": {
        "type": "vector",
        "tiles": ["https://geospatial.jrc.ec.europa.eu/geoserver/gwc/service/wmts?layer=dopa_explorer_3:dopa_geoserver_ecoregions_master_201905&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=application/x-protobuf;type=mapbox-vector&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}"]
        },
    "source-layer": "dopa_geoserver_ecoregions_master_201905",

    'paint': {
      'fill-color': 'white',
      'fill-opacity': 0.1,
      'fill-outline-color': 'white'
    }, 'filter': ["in", "wdpaid",'xxx'],

}, 'waterway-label');

var layer_country = document.getElementById('layer_country');
layer_country.addEventListener('change', function() {
  var layer_country_value = document.getElementById('layer_country').value;
  console.log(layer_country_value)
  if (layer_country_value =='prot_mar_perc_ind'){
    map.setFilter("dopa_geoserver_global_dash", [">", "prot_mar_perc_ind", 0]);
    map.setPaintProperty('dopa_geoserver_global_dash', 'fill-color', 
    ['interpolate',['linear'],['get', layer_country_value],
    0, '#c51b7d',0.5, '#de77ae',1, '#f1b6da',2, '#fde0ef',5, '#f7f7f7',8, '#e6f5d0',12, '#b8e186',17, '#7fbc41',30, '#4d9221',
  ]);
  $('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Marine Protection</p>"+
  "<div><span class='square_pa'style='background-color: #c51b7d'></span>0%</div>"+
  "<div><span class='square_pa'style='background-color: #de77ae'></span>0,5%</div>"+
  "<div><span class='square_pa'style='background-color: #f1b6da'></span>1%</div>"+
  "<div><span class='square_pa'style='background-color: #fde0ef'></span>2%</div>"+
  "<div><span class='square_pa'style='background-color: #f7f7f7'></span>5%</div>"+
  "<div><span class='square_pa'style='background-color: #e6f5d0'></span>8%</div>"+
  "<div><span class='square_pa'style='background-color: #b8e186'></span>12%</div>"+
  "<div><span class='square_pa'style='background-color: #7fbc41'></span>17%</div>"+
  "<div><span class='square_pa'style='background-color: #4d9221'></span>30% or more</div>"+
  "</div>");
  

}else if (layer_country_value =='prot_terr_perc_ind') {

  map.setFilter("dopa_geoserver_global_dash", ["!in", "prot_mar_perc_ind", 'XXX']);
    map.setPaintProperty('dopa_geoserver_global_dash', 'fill-color', 
    ['interpolate',['linear'],['get', layer_country_value],
    0, '#c51b7d',1, '#de77ae',2, '#f1b6da',5, '#fde0ef',8, '#f7f7f7',12, '#e6f5d0',17, '#b8e186',30, '#7fbc41',50, '#4d9221',
  ]);
  $('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Terrestrial Protection</p>"+
  "<div><span class='square_pa'style='background-color: #c51b7d'></span>0%</div>"+
  "<div><span class='square_pa'style='background-color: #de77ae'></span>1%</div>"+
  "<div><span class='square_pa'style='background-color: #f1b6da'></span>2%</div>"+
  "<div><span class='square_pa'style='background-color: #fde0ef'></span>5%</div>"+
  "<div><span class='square_pa'style='background-color: #f7f7f7'></span>8%</div>"+
  "<div><span class='square_pa'style='background-color: #e6f5d0'></span>12%</div>"+
  "<div><span class='square_pa'style='background-color: #b8e186'></span>17%</div>"+
  "<div><span class='square_pa'style='background-color: #7fbc41'></span>30%</div>"+
  "<div><span class='square_pa'style='background-color: #4d9221'></span>50% or more</div>"+
  "</div>");
  }else if (layer_country_value =='protconn_ind') {

    map.setFilter("dopa_geoserver_global_dash", ["!in", "prot_mar_perc_ind", 'XXX']);
      map.setPaintProperty('dopa_geoserver_global_dash', 'fill-color', 
      ['interpolate',['linear'],['get', layer_country_value],
      0, '#c51b7d',1, '#de77ae',2, '#f1b6da',5, '#fde0ef',8, '#f7f7f7',12, '#e6f5d0',17, '#b8e186',30, '#7fbc41',50, '#4d9221',
    ]);
    $('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Terrestrial Connectivity</p>"+
    "<div><span class='square_pa'style='background-color: #c51b7d'></span>0%</div>"+
    "<div><span class='square_pa'style='background-color: #de77ae'></span>1%</div>"+
    "<div><span class='square_pa'style='background-color: #f1b6da'></span>2%</div>"+
    "<div><span class='square_pa'style='background-color: #fde0ef'></span>5%</div>"+
    "<div><span class='square_pa'style='background-color: #f7f7f7'></span>8%</div>"+
    "<div><span class='square_pa'style='background-color: #e6f5d0'></span>12%</div>"+
    "<div><span class='square_pa'style='background-color: #b8e186'></span>17%</div>"+
    "<div><span class='square_pa'style='background-color: #7fbc41'></span>30%</div>"+
    "<div><span class='square_pa'style='background-color: #4d9221'></span>50% or more</div>"+
    "</div>");
    } else if (layer_country_value =='prot_perc_ind') {

      map.setFilter("dopa_geoserver_global_dash", ["!in", "prot_mar_perc_ind", 'XXX']);
        map.setPaintProperty('dopa_geoserver_global_dash', 'fill-color', 
        ['interpolate',['linear'],['get', layer_country_value],
        0, '#c51b7d',1, '#de77ae',2, '#f1b6da',5, '#fde0ef',8, '#f7f7f7',12, '#e6f5d0',17, '#b8e186',30, '#7fbc41',50, '#4d9221',
      ]);
      $('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Overall Protection</p>"+
      "<div><span class='square_pa'style='background-color: #c51b7d'></span>0%</div>"+
      "<div><span class='square_pa'style='background-color: #de77ae'></span>1%</div>"+
      "<div><span class='square_pa'style='background-color: #f1b6da'></span>2%</div>"+
      "<div><span class='square_pa'style='background-color: #fde0ef'></span>5%</div>"+
      "<div><span class='square_pa'style='background-color: #f7f7f7'></span>8%</div>"+
      "<div><span class='square_pa'style='background-color: #e6f5d0'></span>12%</div>"+
      "<div><span class='square_pa'style='background-color: #b8e186'></span>17%</div>"+
      "<div><span class='square_pa'style='background-color: #7fbc41'></span>30%</div>"+
      "<div><span class='square_pa'style='background-color: #4d9221'></span>50% or more</div>"+
      "</div>");
      } else if (layer_country_value =='forest_perc_ind') {

        map.setFilter("dopa_geoserver_global_dash", ["!in", "prot_mar_perc_ind", 'XXX']);
          map.setPaintProperty('dopa_geoserver_global_dash', 'fill-color', 
          ['interpolate',['linear'],['get', layer_country_value],
          0, '#c51b7d',1, '#de77ae',2, '#f1b6da',5, '#fde0ef',8, '#f7f7f7',12, '#e6f5d0',17, '#b8e186',30, '#4d9221',50, '#4d9221',
        ]);
        $('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Forest Cover</p>"+
        "<div><span class='square_pa'style='background-color: #c51b7d'></span>0%</div>"+
        "<div><span class='square_pa'style='background-color: #de77ae'></span>1%</div>"+
        "<div><span class='square_pa'style='background-color: #f1b6da'></span>2%</div>"+
        "<div><span class='square_pa'style='background-color: #fde0ef'></span>5%</div>"+
        "<div><span class='square_pa'style='background-color: #f7f7f7'></span>8%</div>"+
        "<div><span class='square_pa'style='background-color: #e6f5d0'></span>12%</div>"+
        "<div><span class='square_pa'style='background-color: #b8e186'></span>17%</div>"+
        "<div><span class='square_pa'style='background-color: #7fbc41'></span>30%</div>"+
        "<div><span class='square_pa'style='background-color: #4d9221'></span>50% or more</div>"+
        "</div>");
        }else if (layer_country_value =='forest_gain_perc_ind') {

          map.setFilter("dopa_geoserver_global_dash", ["!in", "prot_mar_perc_ind", 'XXX']);
            map.setPaintProperty('dopa_geoserver_global_dash', 'fill-color', 
            ['interpolate',['linear'],['get', layer_country_value],
            0, '#c51b7d',0.2, '#de77ae',0.4, '#f1b6da',0.6, '#fde0ef',0.8, '#f7f7f7',1, '#e6f5d0',1.2, '#b8e186',1.4, '#7fbc41',2, '#4d9221',
          ]);
          $('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Forest Gain</p>"+
          "<div><span class='square_pa'style='background-color: #c51b7d'></span>0.0%</div>"+
          "<div><span class='square_pa'style='background-color: #de77ae'></span>0.2%</div>"+
          "<div><span class='square_pa'style='background-color: #f1b6da'></span>0.4%</div>"+
          "<div><span class='square_pa'style='background-color: #fde0ef'></span>0.6%</div>"+
          "<div><span class='square_pa'style='background-color: #f7f7f7'></span>0.8%</div>"+
          "<div><span class='square_pa'style='background-color: #e6f5d0'></span>1.0%</div>"+
          "<div><span class='square_pa'style='background-color: #b8e186'></span>1.2%</div>"+
          "<div><span class='square_pa'style='background-color: #7fbc41'></span>1.4%</div>"+
          "<div><span class='square_pa'style='background-color: #4d9221'></span>2.0% or more</div>"+
          "</div>");
          }else if (layer_country_value =='forest_loss_perc_ind') {

            map.setFilter("dopa_geoserver_global_dash", ["!in", "prot_mar_perc_ind", 'XXX']);
              map.setPaintProperty('dopa_geoserver_global_dash', 'fill-color', 
              ['interpolate',['linear'],['get', layer_country_value],
              0, '#c51b7d',1, '#de77ae',2, '#f1b6da',3, '#fde0ef',4, '#f7f7f7',5, '#e6f5d0',6, '#b8e186',7, '#7fbc41',8, '#4d9221',
            ]);
            $('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Forest Loss</p>"+
            "<div><span class='square_pa'style='background-color: #c51b7d'></span>0%</div>"+
            "<div><span class='square_pa'style='background-color: #de77ae'></span>1%</div>"+
            "<div><span class='square_pa'style='background-color: #f1b6da'></span>2%</div>"+
            "<div><span class='square_pa'style='background-color: #fde0ef'></span>3%</div>"+
            "<div><span class='square_pa'style='background-color: #f7f7f7'></span>4%</div>"+
            "<div><span class='square_pa'style='background-color: #e6f5d0'></span>5%</div>"+
            "<div><span class='square_pa'style='background-color: #b8e186'></span>6%</div>"+
            "<div><span class='square_pa'style='background-color: #7fbc41'></span>7%</div>"+
            "<div><span class='square_pa'style='background-color: #4d9221'></span>8% or more</div>"+
            "</div>");
            }else if (layer_country_value =='water_p_netchange_perc_ind') {

              map.setFilter("dopa_geoserver_global_dash", ["!in", "prot_mar_perc_ind", 'XXX']);
                map.setPaintProperty('dopa_geoserver_global_dash', 'fill-color', 
                ['interpolate',['linear'],['get', layer_country_value],
                -10, '#c51b7d',-5, '#de77ae',0, '#f1b6da',5, '#fde0ef',10, '#f7f7f7',15, '#e6f5d0',20, '#b8e186',25, '#7fbc41',30, '#4d9221',
              ]);
              $('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Surface Water Change</p>"+
              "<div><span class='square_pa'style='background-color: #c51b7d'></span>-10%</div>"+
              "<div><span class='square_pa'style='background-color: #de77ae'></span>-5%</div>"+
              "<div><span class='square_pa'style='background-color: #f1b6da'></span>0%</div>"+
              "<div><span class='square_pa'style='background-color: #fde0ef'></span>5%</div>"+
              "<div><span class='square_pa'style='background-color: #f7f7f7'></span>10%</div>"+
              "<div><span class='square_pa'style='background-color: #e6f5d0'></span>15%</div>"+
              "<div><span class='square_pa'style='background-color: #b8e186'></span>20%</div>"+
              "<div><span class='square_pa'style='background-color: #7fbc41'></span>25%</div>"+
              "<div><span class='square_pa'style='background-color: #4d9221'></span>30% or more</div>"+
              "</div>");
              }else if (layer_country_value =='tot_carbon_ind') {

                map.setFilter("dopa_geoserver_global_dash", ["!in", "prot_mar_perc_ind", 'XXX']);
                  map.setPaintProperty('dopa_geoserver_global_dash', 'fill-color', 
                  ['interpolate',['linear'],['get', layer_country_value],
                  0, '#c51b7d',0.5, '#de77ae',1, '#f1b6da',1.5, '#fde0ef',2, '#f7f7f7',2.5, '#e6f5d0',3, '#b8e186',4, '#7fbc41',5, '#4d9221',
                ]);
                $('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Total Carbon (Pg)</p>"+
                "<div><span class='square_pa'style='background-color: #c51b7d'></span>0</div>"+
                "<div><span class='square_pa'style='background-color: #de77ae'></span>0.5</div>"+
                "<div><span class='square_pa'style='background-color: #f1b6da'></span>1</div>"+
                "<div><span class='square_pa'style='background-color: #fde0ef'></span>1.5</div>"+
                "<div><span class='square_pa'style='background-color: #f7f7f7'></span>2</div>"+
                "<div><span class='square_pa'style='background-color: #e6f5d0'></span>2.5</div>"+
                "<div><span class='square_pa'style='background-color: #b8e186'></span>3</div>"+
                "<div><span class='square_pa'style='background-color: #7fbc41'></span>4</div>"+
                "<div><span class='square_pa'style='background-color: #4d9221'></span>5 or more</div>"+
                "</div>");
                }else if (layer_country_value =='tot_species_ind') {

                  map.setFilter("dopa_geoserver_global_dash", ["!in", "prot_mar_perc_ind", 'XXX']);
                    map.setPaintProperty('dopa_geoserver_global_dash', 'fill-color', 
                    ['interpolate',['linear'],['get', layer_country_value],
                    0, '#c51b7d',250, '#de77ae',500, '#f1b6da',1000, '#fde0ef',1500, '#f7f7f7',2000, '#e6f5d0',3000, '#b8e186',4000, '#7fbc41',5000, '#4d9221',
                  ]);
                  $('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Number of Species</p>"+
                  "<div><span class='square_pa'style='background-color: #c51b7d'></span>0</div>"+
                  "<div><span class='square_pa'style='background-color: #de77ae'></span>250</div>"+
                  "<div><span class='square_pa'style='background-color: #f1b6da'></span>500</div>"+
                  "<div><span class='square_pa'style='background-color: #fde0ef'></span>1000</div>"+
                  "<div><span class='square_pa'style='background-color: #f7f7f7'></span>1500</div>"+
                  "<div><span class='square_pa'style='background-color: #e6f5d0'></span>2000</div>"+
                  "<div><span class='square_pa'style='background-color: #b8e186'></span>3000</div>"+
                  "<div><span class='square_pa'style='background-color: #7fbc41'></span>4000</div>"+
                  "<div><span class='square_pa'style='background-color: #4d9221'></span>5000 or more</div>"+
                  "</div>");
                  }else if (layer_country_value =='species_endem_ind') {

                    map.setFilter("dopa_geoserver_global_dash", ["!in", "prot_mar_perc_ind", 'XXX']);
                      map.setPaintProperty('dopa_geoserver_global_dash', 'fill-color', 
                      ['interpolate',['linear'],['get', layer_country_value],
                      0, '#c51b7d',10, '#de77ae',25, '#f1b6da',50, '#fde0ef',100, '#f7f7f7',150, '#e6f5d0',200, '#b8e186',500, '#7fbc41',1000, '#4d9221',
                    ]);
                    $('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Number of Endemic Species</p>"+
                    "<div><span class='square_pa'style='background-color: #c51b7d'></span>0</div>"+
                    "<div><span class='square_pa'style='background-color: #de77ae'></span>10</div>"+
                    "<div><span class='square_pa'style='background-color: #f1b6da'></span>25</div>"+
                    "<div><span class='square_pa'style='background-color: #fde0ef'></span>50</div>"+
                    "<div><span class='square_pa'style='background-color: #f7f7f7'></span>100</div>"+
                    "<div><span class='square_pa'style='background-color: #e6f5d0'></span>150</div>"+
                    "<div><span class='square_pa'style='background-color: #b8e186'></span>200</div>"+
                    "<div><span class='square_pa'style='background-color: #7fbc41'></span>500</div>"+
                    "<div><span class='square_pa'style='background-color: #4d9221'></span>1000 or more</div>"+
                    "</div>");
                    }else if (layer_country_value =='threat_species_ind') {

                      map.setFilter("dopa_geoserver_global_dash", ["!in", "prot_mar_perc_ind", 'XXX']);
                        map.setPaintProperty('dopa_geoserver_global_dash', 'fill-color', 
                        ['interpolate',['linear'],['get', layer_country_value],
                        0, '#c51b7d',5, '#de77ae',10, '#f1b6da',20, '#fde0ef',40, '#f7f7f7',60, '#e6f5d0',100, '#b8e186',200, '#7fbc41',300, '#4d9221',
                      ]);
                      $('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Number of Threatened Species</p>"+
                      "<div><span class='square_pa'style='background-color: #c51b7d'></span>0</div>"+
                      "<div><span class='square_pa'style='background-color: #de77ae'></span>5</div>"+
                      "<div><span class='square_pa'style='background-color: #f1b6da'></span>10</div>"+
                      "<div><span class='square_pa'style='background-color: #fde0ef'></span>20</div>"+
                      "<div><span class='square_pa'style='background-color: #f7f7f7'></span>40</div>"+
                      "<div><span class='square_pa'style='background-color: #e6f5d0'></span>60</div>"+
                      "<div><span class='square_pa'style='background-color: #b8e186'></span>100</div>"+
                      "<div><span class='square_pa'style='background-color: #7fbc41'></span>200</div>"+
                      "<div><span class='square_pa'style='background-color: #4d9221'></span>300 or more</div>"+
                      "</div>");
                      }else if (layer_country_value =='species_endem_threat_ind') {

                        map.setFilter("dopa_geoserver_global_dash", ["!in", "prot_mar_perc_ind", 'XXX']);
                          map.setPaintProperty('dopa_geoserver_global_dash', 'fill-color', 
                          ['interpolate',['linear'],['get', layer_country_value],
                          0, '#c51b7d',5, '#de77ae',10, '#f1b6da',20, '#fde0ef',40, '#f7f7f7',60, '#e6f5d0',100, '#b8e186',200, '#7fbc41',300, '#4d9221',
                        ]);
                        $('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Number of Threatened Endemic Species</p>"+
                        "<div><span class='square_pa'style='background-color: #c51b7d'></span>0</div>"+
                        "<div><span class='square_pa'style='background-color: #de77ae'></span>5</div>"+
                        "<div><span class='square_pa'style='background-color: #f1b6da'></span>10</div>"+
                        "<div><span class='square_pa'style='background-color: #fde0ef'></span>20</div>"+
                        "<div><span class='square_pa'style='background-color: #f7f7f7'></span>40</div>"+
                        "<div><span class='square_pa'style='background-color: #e6f5d0'></span>60</div>"+
                        "<div><span class='square_pa'style='background-color: #b8e186'></span>100</div>"+
                        "<div><span class='square_pa'style='background-color: #7fbc41'></span>200</div>"+
                        "<div><span class='square_pa'style='background-color: #4d9221'></span>300 or more</div>"+
                        "</div>");
                        }else if (layer_country_value =='tot_pop_ind') {

                          map.setFilter("dopa_geoserver_global_dash", ["!in", "prot_mar_perc_ind", 'XXX']);
                            map.setPaintProperty('dopa_geoserver_global_dash', 'fill-color', 
                            ['interpolate',['linear'],['get', layer_country_value],
                            0, '#c51b7d',10000000, '#de77ae',20000000, '#f1b6da',50000000, '#fde0ef',100000000, '#f7f7f7',250000000, '#e6f5d0',500000000, '#b8e186',750000000, '#7fbc41',1000000000, '#4d9221',
                          ]);
                          $('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Total Population </p>"+
                          "<div><span class='square_pa'style='background-color: #c51b7d'></span>0M</div>"+
                          "<div><span class='square_pa'style='background-color: #de77ae'></span>10M</div>"+
                          "<div><span class='square_pa'style='background-color: #f1b6da'></span>20M</div>"+
                          "<div><span class='square_pa'style='background-color: #fde0ef'></span>50M</div>"+
                          "<div><span class='square_pa'style='background-color: #f7f7f7'></span>100M</div>"+
                          "<div><span class='square_pa'style='background-color: #e6f5d0'></span>250M</div>"+
                          "<div><span class='square_pa'style='background-color: #b8e186'></span>500M</div>"+
                          "<div><span class='square_pa'style='background-color: #7fbc41'></span>750M</div>"+
                          "<div><span class='square_pa'style='background-color: #4d9221'></span>1B or more</div>"+
                          "</div>");
                          }else if (layer_country_value =='dens_pop_ind') {

                            map.setFilter("dopa_geoserver_global_dash", ["!in", "prot_mar_perc_ind", 'XXX']);
                              map.setPaintProperty('dopa_geoserver_global_dash', 'fill-color', 
                              ['interpolate',['linear'],['get', layer_country_value],
                              0, '#c51b7d',10, '#de77ae',25, '#f1b6da',50, '#fde0ef',75, '#f7f7f7',100, '#e6f5d0',150, '#b8e186',200, '#7fbc41',250, '#4d9221',
                            ]);
                            $('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Population Density</p>"+
                            "<div><span class='square_pa'style='background-color: #c51b7d'></span>0 per km<sup>2</sup></div>"+
                            "<div><span class='square_pa'style='background-color: #de77ae'></span>10 per km<sup>2</sup></div>"+
                            "<div><span class='square_pa'style='background-color: #f1b6da'></span>25 per km<sup>2</sup></div>"+
                            "<div><span class='square_pa'style='background-color: #fde0ef'></span>50 per km<sup>2</sup></div>"+
                            "<div><span class='square_pa'style='background-color: #f7f7f7'></span>75 per km<sup>2</sup></div>"+
                            "<div><span class='square_pa'style='background-color: #e6f5d0'></span>100 per km<sup>2</sup></div>"+
                            "<div><span class='square_pa'style='background-color: #b8e186'></span>150 per km<sup>2</sup></div>"+
                            "<div><span class='square_pa'style='background-color: #7fbc41'></span>200 per km<sup>2</sup></div>"+
                            "<div><span class='square_pa'style='background-color: #4d9221'></span>250 per km<sup>2</sup> or more</div>"+
                            "</div>");
                            }else if (layer_country_value =='growth_pop_ind') {

                              map.setFilter("dopa_geoserver_global_dash", ["!in", "prot_mar_perc_ind", 'XXX']);
                                map.setPaintProperty('dopa_geoserver_global_dash', 'fill-color', 
                                ['interpolate',['linear'],['get', layer_country_value],
                                -2, '#c51b7d',-1.5, '#de77ae',-1, '#f1b6da',0, '#fde0ef',1, '#f7f7f7',1.5, '#e6f5d0',2, '#b8e186',2.5, '#7fbc41',3, '#4d9221',
                              ]);
                              $('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Population Growth</p>"+
                              "<div><span class='square_pa'style='background-color: #c51b7d'></span>-2% or less</div>"+
                              "<div><span class='square_pa'style='background-color: #de77ae'></span>-1.5%</div>"+
                              "<div><span class='square_pa'style='background-color: #f1b6da'></span>-1%</div>"+
                              "<div><span class='square_pa'style='background-color: #fde0ef'></span>0%</div>"+
                              "<div><span class='square_pa'style='background-color: #f7f7f7'></span>1%</div>"+
                              "<div><span class='square_pa'style='background-color: #e6f5d0'></span>1.5%</div>"+
                              "<div><span class='square_pa'style='background-color: #b8e186'></span>2%</div>"+
                              "<div><span class='square_pa'style='background-color: #7fbc41'></span>2.5%</div>"+
                              "<div><span class='square_pa'style='background-color: #4d9221'></span>3% or more</div>"+
                              "</div>");
                              }else if (layer_country_value =='agri_area_ind') {

                                map.setFilter("dopa_geoserver_global_dash", ["!in", "prot_mar_perc_ind", 'XXX']);
                                  map.setPaintProperty('dopa_geoserver_global_dash', 'fill-color', 
                                  ['interpolate',['linear'],['get', layer_country_value],
                                  0, '#c51b7d',5, '#de77ae',10, '#f1b6da',20, '#fde0ef',30, '#f7f7f7',40, '#e6f5d0',50, '#b8e186',60, '#7fbc41',70, '#4d9221',
                                ]);
                                $('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Agricultiural Lands (% of land area)</p>"+
                                "<div><span class='square_pa'style='background-color: #c51b7d'></span>0%</div>"+
                                "<div><span class='square_pa'style='background-color: #de77ae'></span>5%</div>"+
                                "<div><span class='square_pa'style='background-color: #f1b6da'></span>10%</div>"+
                                "<div><span class='square_pa'style='background-color: #fde0ef'></span>20%</div>"+
                                "<div><span class='square_pa'style='background-color: #f7f7f7'></span>30%</div>"+
                                "<div><span class='square_pa'style='background-color: #e6f5d0'></span>40%</div>"+
                                "<div><span class='square_pa'style='background-color: #b8e186'></span>50%</div>"+
                                "<div><span class='square_pa'style='background-color: #7fbc41'></span>60%</div>"+
                                "<div><span class='square_pa'style='background-color: #4d9221'></span>70% or more</div>"+
                                "</div>");
                                }else if (layer_country_value =='land_natural_perc_ind') {

                                  map.setFilter("dopa_geoserver_global_dash", ["!in", "prot_mar_perc_ind", 'XXX']);
                                    map.setPaintProperty('dopa_geoserver_global_dash', 'fill-color', 
                                    ['interpolate',['linear'],['get', layer_country_value],
                                    0, '#c51b7d',30, '#de77ae',40, '#f1b6da',50, '#fde0ef',60, '#f7f7f7',70, '#e6f5d0',80, '#b8e186',90, '#7fbc41',100, '#4d9221',
                                  ]);
                                  $('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Natural Area (% of land area)</p>"+
                                  "<div><span class='square_pa'style='background-color: #c51b7d'></span>0%</div>"+
                                  "<div><span class='square_pa'style='background-color: #de77ae'></span>30%</div>"+
                                  "<div><span class='square_pa'style='background-color: #f1b6da'></span>40%</div>"+
                                  "<div><span class='square_pa'style='background-color: #fde0ef'></span>50%</div>"+
                                  "<div><span class='square_pa'style='background-color: #f7f7f7'></span>60%</div>"+
                                  "<div><span class='square_pa'style='background-color: #e6f5d0'></span>70%</div>"+
                                  "<div><span class='square_pa'style='background-color: #b8e186'></span>80%</div>"+
                                  "<div><span class='square_pa'style='background-color: #7fbc41'></span>90%</div>"+
                                  "<div><span class='square_pa'style='background-color: #4d9221'></span>100%</div>"+
                                  "</div>");
                                  }else if (layer_country_value =='land_degradation_ind') {

                                    map.setFilter("dopa_geoserver_global_dash", ["!in", "prot_mar_perc_ind", 'XXX']);
                                      map.setPaintProperty('dopa_geoserver_global_dash', 'fill-color', 
                                      ['interpolate',['linear'],['get', layer_country_value],
                                      0, '#c51b7d',1, '#de77ae',2, '#f1b6da',5, '#fde0ef',10, '#f7f7f7',20, '#e6f5d0',30, '#b8e186',40, '#7fbc41',50, '#4d9221',
                                    ]);
                                    $('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Degraded land (% of land area)</p>"+
                                    "<div><span class='square_pa'style='background-color: #c51b7d'></span>0%</div>"+
                                    "<div><span class='square_pa'style='background-color: #de77ae'></span>1%</div>"+
                                    "<div><span class='square_pa'style='background-color: #f1b6da'></span>2%</div>"+
                                    "<div><span class='square_pa'style='background-color: #fde0ef'></span>5%</div>"+
                                    "<div><span class='square_pa'style='background-color: #f7f7f7'></span>10%</div>"+
                                    "<div><span class='square_pa'style='background-color: #e6f5d0'></span>20%</div>"+
                                    "<div><span class='square_pa'style='background-color: #b8e186'></span>30%</div>"+
                                    "<div><span class='square_pa'style='background-color: #7fbc41'></span>40%</div>"+
                                    "<div><span class='square_pa'style='background-color: #4d9221'></span>50% or more</div>"+
                                    "</div>");
                                    }
    
  

});


$( ".live_select" ).click(function() {
  if($('#live_layer_container').is(':visible')) {
    $( "#live_layer_container" ).hide( "slow", function() {});
    $('.live_select').removeClass('clickedtool');
  }else{
    $( "#live_layer_container" ).show( "slow", function() {});
    $('.live_select').addClass('clickedtool');
    $('.pa_select').removeClass('clickedtool');
    $('.country_select').removeClass('clickedtool');
    $('.ecoregion_select').removeClass('clickedtool');
    map.setFilter("dopa_geoserver_wdpa_master_202101_o1", ["in", "id", "xxx"]);
    map.setFilter("wdpa_high", ["in", "id", "xxx"]);
    map.setFilter("wdpa_high2", ["in", "id", "xxx"]);
  }
  if($('.pa_select').hasClass('clickedtool')){
    $('.pa_select').removeClass('clickedtool');
  }else{
  }
  if($('.ecoregion_select').hasClass('clickedtool')){
    $('.ecoregion_select').removeClass('clickedtool');
  }else{
  }
  if($('.country_select').hasClass('clickedtool')){
    $('.country_select').removeClass('clickedtool');
  }else{
  }
 
  $('.legend').empty();
  $('#pa_stats').hide();
  $('#pa_title').hide();
  $( "#country_var_dropdown" ).hide();
  $( "#pa_stats" ).hide();
  $( "#geocoder" ).hide();
  $( ".sidebar" ).hide();
  $( ".top_dropdown" ).hide();
  $( ".calculation-box" ).hide();
  $('.mapbox-gl-draw_trash').click();
  map.setFilter("country_high", ["in", "id", "xxx"]);
  map.setFilter("ecoregion_high", ["in", "id", "xxx"]);
  map.setFilter("dopa_geoserver_global_dash", ["in", "id", "xxx"]);
  map.setFilter("dopa_geoserver_ecoregions_master_201905", ["in", "id", "xxx"]);
});



$('.search_icon').click(function() {
 

  $('#live_var_dropdown').click();
  map.setFilter("dopa_geoserver_global_dash", ["in", "id", "xxx"]);
  map.setFilter("dopa_geoserver_ecoregions_master_201905", ["in", "id", "xxx"]);
  map.setFilter("dopa_geoserver_wdpa_master_202101_o1", ["!in", "id", "xxx"]);
  $('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Protected Areas</p>"+
  "<div><span class='square_pa'style='background-color: #7fbc41'></span>Terrestrial</div>"+
  "<div><span class='square_pa'style='background-color: #b9cda5'></span>Coastal</div>"+
  "<div><span class='square_pa'style='background-color: #13a6ec'></span>Marine</div>"+
  "</div>");
  $('#pa_stats').hide();
  $('#pa_title').hide();

})









$('.country_select').click(function() {
  if($('.country_select').hasClass('clickedtool')){
    $('.country_select').removeClass('clickedtool');
    map.setFilter("dopa_geoserver_ecoregions_master_201905", ["in", "id", "xxx"]);
    map.setFilter("dopa_geoserver_global_dash", ["in", "id", "xxx"]);
    map.setFilter("dopa_geoserver_wdpa_master_202101_o1", ["in", "id", "xxx"]);
    map.setFilter("country_high", ["in", "id", "xxx"]);
    map.setFilter("ecoregion_high", ["in", "id", "xxx"]);
    map.setFilter("wdpa_high", ["in", "id", "xxx"]);
    map.setFilter("wdpa_high2", ["in", "id", "xxx"]);
    $('#pa_title').hide();
    $('#pa_stats').hide();
    $('#live_layer_container').hide();
    $(".select-dropdown").val("Select a layer");
    $('.legend').empty();
  }else{
    $('.country_select').addClass('clickedtool');
    map.setFilter("dopa_geoserver_ecoregions_master_201905", ["in", "id", "xxx"]);
    map.setFilter("dopa_geoserver_global_dash", ["!in", "id", "xxx"]);
    map.setFilter("dopa_geoserver_wdpa_master_202101_o1", ["in", "id", "xxx"]);
    map.setFilter("country_high", ["in", "id", "xxx"]);
    map.setFilter("ecoregion_high", ["in", "id", "xxx"]);
    map.setFilter("wdpa_high", ["in", "id", "xxx"]);
    map.setFilter("wdpa_high2", ["in", "id", "xxx"]);
    map.setPaintProperty('dopa_geoserver_global_dash', 'fill-color', 
    ['interpolate',['linear'],['get', 'prot_perc_ind'],
    0, '#c51b7d',1, '#de77ae',2, '#f1b6da',5, '#fde0ef',8, '#f7f7f7',12, '#e6f5d0',17, '#b8e186',30, '#7fbc41',50, '#4d9221',
  ]);
    $('#pa_title').hide();
    $('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Overall Protection</p>"+
    "<div><span class='square_pa'style='background-color: #c51b7d'></span>0%</div>"+
    "<div><span class='square_pa'style='background-color: #de77ae'></span>1%</div>"+
    "<div><span class='square_pa'style='background-color: #f1b6da'></span>2%</div>"+
    "<div><span class='square_pa'style='background-color: #fde0ef'></span>5%</div>"+
    "<div><span class='square_pa'style='background-color: #f7f7f7'></span>8%</div>"+
    "<div><span class='square_pa'style='background-color: #e6f5d0'></span>12%</div>"+
    "<div><span class='square_pa'style='background-color: #b8e186'></span>17%</div>"+
    "<div><span class='square_pa'style='background-color: #7fbc41'></span>30%</div>"+
    "<div><span class='square_pa'style='background-color: #4d9221'></span>50% or more</div>"+
    "</div>");
    $('#pa_title').hide();
  $('#pa_stats').hide();
  $('#live_layer_container').hide();
  $(".select-dropdown").val("Select a layer");
  }
  if($('.pa_select').hasClass('clickedtool')){
    $('.pa_select').removeClass('clickedtool');
  }else{
  }
  if($('.ecoregion_select').hasClass('clickedtool')){
    $('.ecoregion_select').removeClass('clickedtool');
  }else{
  }
  if($('.live_select').hasClass('clickedtool')){
    $('.live_select').removeClass('clickedtool');
  }else{
  }

})


$('.ecoregion_select').click(function() {
  if($('.ecoregion_select').hasClass('clickedtool')){
    $('.ecoregion_select').removeClass('clickedtool');
    map.setFilter("dopa_geoserver_ecoregions_master_201905", ["in", "id", "xxx"]);
    map.setFilter("dopa_geoserver_global_dash", ["in", "id", "xxx"]);
    map.setFilter("dopa_geoserver_wdpa_master_202101_o1", ["in", "id", "xxx"]);
    map.setFilter("country_high", ["in", "id", "xxx"]);
    map.setFilter("ecoregion_high", ["in", "id", "xxx"]);
    map.setFilter("wdpa_high", ["in", "id", "xxx"]);
    map.setFilter("wdpa_high2", ["in", "id", "xxx"]);
    $('#pa_title').hide();
    $('#country_var_dropdown').hide();
    $('#pa_stats').hide();
    $('.legend').empty();
  }else{
    $('.ecoregion_select').addClass('clickedtool');
    map.setFilter("dopa_geoserver_ecoregions_master_201905", ["!in", "id", "xxx"]);
    map.setFilter("dopa_geoserver_global_dash", ["in", "id", "xxx"]);
    map.setFilter("dopa_geoserver_wdpa_master_202101_o1", ["in", "id", "xxx"]);
    map.setFilter("country_high", ["in", "id", "xxx"]);
    map.setFilter("ecoregion_high", ["in", "id", "xxx"]);
    map.setFilter("wdpa_high", ["in", "id", "xxx"]);
    map.setFilter("wdpa_high2", ["in", "id", "xxx"]);
    $('#pa_title').hide();
    $('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Ecoregion Protection</p>"+
    "<div><span class='square_pa'style='background-color: #c51b7d'></span>0%</div>"+
    "<div><span class='square_pa'style='background-color: #de77ae'></span>1%</div>"+
    "<div><span class='square_pa'style='background-color: #f1b6da'></span>2%</div>"+
    "<div><span class='square_pa'style='background-color: #fde0ef'></span>5%</div>"+
    "<div><span class='square_pa'style='background-color: #f7f7f7'></span>8%</div>"+
    "<div><span class='square_pa'style='background-color: #e6f5d0'></span>12%</div>"+
    "<div><span class='square_pa'style='background-color: #b8e186'></span>17%</div>"+
    "<div><span class='square_pa'style='background-color: #7fbc41'></span>30%</div>"+
    "<div><span class='square_pa'style='background-color: #4d9221'></span>50% or more</div>"+
    "</div>");
    $('#country_var_dropdown').hide();
    $('#pa_stats').hide();
    $('#live_layer_container').hide();
  }
  if($('.pa_select').hasClass('clickedtool')){
    $('.pa_select').removeClass('clickedtool');
  }else{
  }
  if($('.country_select').hasClass('clickedtool')){
    $('.country_select').removeClass('clickedtool');
  }else{
  }
  if($('.live_select').hasClass('clickedtool')){
    $('.live_select').removeClass('clickedtool');
  }else{
  }

})


$('.pa_select').click(function() {
  $('#geocoder').show();
  if($('.pa_select').hasClass('clickedtool')){
    $('.pa_select').removeClass('clickedtool');
    map.setFilter("dopa_geoserver_wdpa_master_202101_o1", ["in", "id", "xxx"]);
  }else{
    map.setFilter("dopa_geoserver_wdpa_master_202101_o1", ["!in", "id", "xxx"]);
    $('.pa_select').addClass('clickedtool');
  }

  if($('.country_select').hasClass('clickedtool')){
    $('.country_select').removeClass('clickedtool');
  }else{
  }
  if($('.ecoregion_select').hasClass('clickedtool')){
    $('.ecoregion_select').removeClass('clickedtool');
  }else{

  }

  $('#pa_stats').hide();
  $('#live_var_dropdown').click();
  $('#live_var_dropdown').hide();
  map.setFilter("dopa_geoserver_global_dash", ["in", "id", "xxx"]);
  map.setFilter("dopa_geoserver_ecoregions_master_201905", ["in", "id", "xxx"]);
  map.setFilter("country_high", ["in", "id", "xxx"]);
  map.setFilter("ecoregion_high", ["in", "id", "xxx"]);
  map.setFilter("wdpa_high", ["in", "id", "xxx"]);
  map.setFilter("wdpa_high2", ["in", "id", "xxx"]);
  $('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Protected Areas</p>"+
  "<div><span class='square_pa'style='background-color: #7fbc41'></span>Terrestrial</div>"+
  "<div><span class='square_pa'style='background-color: #b9cda5'></span>Coastal</div>"+
  "<div><span class='square_pa'style='background-color: #13a6ec'></span>Marine</div>"+
  "</div>");
  $('#country_var_dropdown').hide();
})

$('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Overall Protection</p>"+
"<div><span class='square_pa'style='background-color: #c51b7d'></span>0%</div>"+
"<div><span class='square_pa'style='background-color: #de77ae'></span>1%</div>"+
"<div><span class='square_pa'style='background-color: #f1b6da'></span>2%</div>"+
"<div><span class='square_pa'style='background-color: #fde0ef'></span>5%</div>"+
"<div><span class='square_pa'style='background-color: #f7f7f7'></span>8%</div>"+
"<div><span class='square_pa'style='background-color: #e6f5d0'></span>12%</div>"+
"<div><span class='square_pa'style='background-color: #b8e186'></span>17%</div>"+
"<div><span class='square_pa'style='background-color: #7fbc41'></span>30%</div>"+
"<div><span class='square_pa'style='background-color: #4d9221'></span>50% or more</div>"+
"</div>");


 
// PA Popup
      map.on('click', 'dopa_geoserver_wdpa_master_202101_o1', function (e) {
     
    


        if($('#live_layer_container').is(':visible')) {
          $('#pa_stats').addClass("relPosition");
          $('#pa_title').addClass("relPosition_t");
          $('#geocoder').hide();
         //$('#country_var_dropdown').show().prependTo('#pa_stats');
      }else{
        $('#pa_stats').removeClass("relPosition");
        $('#pa_title').removeClass("relPosition_t");
        $('#geocoder').show();
      }
      
      $('#pa_stats').empty().prepend('<img id="theImg" src="img/load_.gif" />').append('<div id="pa_titles">Calculating statistics for <br><b>'+e.features[0].properties.name+'</b></div>')
      .append('<div id="pa_stat"></div>');
      if($('#country_var_dropdown').is(':visible')) {
        $('#geocoder').hide();
     }else{
      $('#geocoder').show();
     }  

        $('#pa_stats').show();

        map.setFilter("wdpa_high2", ["in", "wdpaid", e.features[0].properties.wdpaid]);
        var marine = e.features[0].properties.marine;
        var prod_base_url_services = 'https://dopa-services.jrc.ec.europa.eu/services/d6dopa40'
        var base_url_services = prod_base_url_services;
        var url = base_url_services +'/protected_sites/get_wdpa_terrestrial_radarplot?wdpaid=' + e.features[0].properties.wdpaid;
        var url_marine = base_url_services +'/protected_sites/get_wdpa_marine_radarplot?wdpaid=' + e.features[0].properties.wdpaid;
        var url_coastal = base_url_services +'/protected_sites/get_wdpa_terrestrial_radarplot?wdpaid=' +e.features[0].properties.wdpaid;
        if (marine == '0'){
        $.ajax({
          url: url,
          dataType: 'json',
          success: function(d) {
            console.log(d);
              if (d.metadata.recordCount == 0) {
              } else {
                  var title = [];
                  var country_avg = [];
                  var site_norm_value = [];
                  $(d.records).each(function(i, data) {
                      switch (data.title) {
                          case 'Agriculture':
                          for (var prop in data) {
                                  if (prop == 'title') {
                                      title.push("Agriculture")
                                  }
                                  else if (prop == 'country_avg') {
                                      if(data[prop]>=0)
                                      country_avg.push(data[prop]);
                                      else
                                      country_avg.push(0);
                                  }
                                  else if (prop == 'site_norm_value') {
                                      if(data[prop]>=0)
                                      site_norm_value.push(data[prop]);
                                      else
                                      site_norm_value.push(0);
                                  }
                                  else {
                                  }
                              }
                              break;
                          case 'Population':
                          for (var prop in data) {
                                  if (prop == 'title') {
                                      title.push("Population")
                                  }
                                  else if (prop == 'country_avg') {
                                      if(data[prop]>=0)
                                      country_avg.push(data[prop]);
                                      else
                                      country_avg.push(0);
                                  }
                                  else if (prop == 'site_norm_value') {
        
                                      if(data[prop]>=0){
                                      site_norm_value.push(data[prop]);
                                    }
                                      else{
                                      site_norm_value.push(0);
                                    }
                                  }
                                  else {
                                  }
                              }
                              break;
                          case 'Internal Roads':
                          for (var prop in data) {
                                            if (prop == 'title') {
                                                title.push("Internal Roads")
                                            }
                               else if (prop == 'country_avg') {
                                   if(data[prop]>=0)
                                   country_avg.push(data[prop]);
                                   else
                                   country_avg.push(0);
                                            }
                               else if (prop == 'site_norm_value') {
                                   if(data[prop]>=0)
                                   site_norm_value.push(data[prop]);
                                   else
                                   site_norm_value.push(0);
                                            }
                               else {
                               }
                             }
                              break;
        
                          case 'Amphibians indicator':
                          for (var prop in data) {
                                  if (prop == 'title') {
                                      title.push("Amphibians")
                                  }
                                  else if (prop == 'country_avg') {
                                      if(data[prop]>=0)
                                      country_avg.push(data[prop]);
                                      else
                                      country_avg.push(0);
                                  }
                                  else if (prop == 'site_norm_value') {
                                      if(data[prop]>=0)
                                      site_norm_value.push(data[prop]);
                                      else
                                      site_norm_value.push(0);
                                  }
                                  else {
                                  }
                              }
                              break;
                          case 'Mammals indicator':
        
                          for (var prop in data) {
                                  if (prop == 'title') {
                                      title.push("Mammals")
        
                                  }
                                  else if (prop == 'country_avg') {
                                      if(data[prop]>=0)
                                      country_avg.push(data[prop]);
                                      else
                                      country_avg.push(0);
                                  }
                                  else if (prop == 'site_norm_value') {
        
                                      if(data[prop]>=0)
                                      site_norm_value.push(data[prop]);
                                    else
                                      site_norm_value.push(0);
        
                                }
                                  else {
                                  }
                              }
                              break;
                          case 'Birds indicator':
                          for (var prop in data) {
                                  if (prop == 'title') {
                                      title.push("Birds")
                                  }
                                  else if (prop == 'country_avg') {
                                      if(data[prop]>=0)
                                      country_avg.push(data[prop]);
                                      else
                                      country_avg.push(0);
                                  }
                                  else if (prop == 'site_norm_value') {
                                      if(data[prop]>=0)
                                      site_norm_value.push(data[prop]);
                                      else
                                      site_norm_value.push(0);
                                  }
                                  else {
                                  }
                              }
                              break;
                          case 'Popn. change':
                          for (var prop in data) {
                                  if (prop == 'title') {
                                      title.push("Pop. Change")
                                  }
                                  else if (prop == 'country_avg') {
                                      if(data[prop]>=0)
                                      country_avg.push(data[prop]);
                                      else
                                      country_avg.push(0);
                                  }
                                  else if (prop == 'site_norm_value') {
        
                                      if(data[prop]>=0){
                                      site_norm_value.push(data[prop]);
                                    }
                                      else{
                                      site_norm_value.push(0);
                                    }
                                  }
                                  else {
                                  }
                              }
                              break;
                          case 'Terrestrial HDI':
                          for (var prop in data) {
                                  if (prop == 'title') {
                                      title.push(" Terrestrial Habitat Diversity")
                                  }
                                  else if (prop == 'country_avg') {
                                      if(data[prop]>=0)
                                      country_avg.push(data[prop]);
                                      else
                                      country_avg.push(0);
                                  }
                                  else if (prop == 'site_norm_value') {
        
                                      if(data[prop]>=0){
                                      site_norm_value.push(data[prop]);
                                    }
                                      else{
                                      site_norm_value.push(0);
                                    }
                                  }
                                  else {
                                  }
                              }
                              break;
        
                          default:
                              break;
                      }
        
        
                  });
        
                  Highcharts.chart('pa_stats', {
        
                      chart: {
                     
                       backgroundColor:'rgba(255, 255, 255, 0)',
                       style: {
                  
                        color: "#ffffff"
                    },
                          polar: true,
                           zoomType: 'xy',
                           height: 350,
                           width: 350,
                           events: {
                                   load: function(event) {
                                       $('#theImg').hide();
                                    }
                               }
                      },
                      title: {
                        style: {
                          color: '#FFFFFF',
                          font: '16px "Montserrat"'
                       },
                          text: 'Biodiversity Variables and Human Pressures'
                      },
                      subtitle: {
                          text: ""
                      },
                      credits: {
                          enabled: true,
                          text: '© DOPA Services',
                          href: 'http://dopa.jrc.ec.europa.eu/en/services'
                      },
                      xAxis: {
                              categories: title,
                              labels: {
                              style: {
                              color: '#a6b3b7',
                              fontSize:'11px'
                              }
                            },
                          tickmarkPlacement: 'on',
                          lineWidth: 0
                      },
                      tooltip: {
                          formatter: function() {
                              var s = [];
        
                              $.each(this.points, function(i, point) {
                                  if(point.series.name == "Country Average"){
                                      s.push('<span style="color:rgb(130, 162, 145);font-weight:bold;">'+ point.key +' <br>'+ point.series.name +' : '+
                                      point.y +'<span>');
                                  }
                                  else{
                                      s.push('<span style="color:#184c52;">'+ point.series.name +' : '+
                                      point.y +'<span>');
                                  }
                              });
                              return s.join('<br>');
                          },
                          shared: true
                      },
                      yAxis: {
                          lineWidth: 0,
                          min: 0,
                          tickInterval: 10,
                          gridLineInterpolation: 'polygon'
                      },
                      legend: {
                        labelFormatter: function () {
                          return '<span style="color:' + this.color + ';">' + this.name + '</span>';
                      },
                      enabled: true,
                      verticalAlign: 'bottom',
                      itemMarginTop: -15,
                      itemStyle: {
                      color: '#3a3e37',
                      'font-size':'10px',
                      'font-weight':'100'
                      }
                      },
        
                      series: [{
                          type: 'area',
                          marker: {
                            enabled: false
                          },
                          name: 'Country Average',
                          data: country_avg,
                          color: '#d6eab9'
                      },
                      {
                          type: 'line',
                          marker: {
                            enabled: true
                          },
                          name: 'Protected Area',
                          data: site_norm_value,
                          color: '#78a635'
                      }]
        
                  });
                }
              }
            });

        }else if (marine == '1'){

          $.ajax({
            url: url_coastal,
            dataType: 'json',
            success: function(d) {
                if (d.metadata.recordCount == 0) {
  
                } else {
                    var title = [];
                    var country_avg = [];
                    var site_norm_value = [];
                    $(d.records).each(function(i, data) {
                        switch (data.title) {
                            case 'Agriculture':
                            for (var prop in data) {
                                    if (prop == 'title') {
                                        title.push("Agriculture")
                                    }
                                    else if (prop == 'country_avg') {
                                        if(data[prop]>=0)
                                        country_avg.push(data[prop]);
                                        else
                                        country_avg.push(0);
                                    }
                                    else if (prop == 'site_norm_value') {
                                        if(data[prop]>=0)
                                        site_norm_value.push(data[prop]);
                                        else
                                        site_norm_value.push(0);
                                    }
                                    else {
                                    }
                                }
                                break;
                            case 'Population':
                            for (var prop in data) {
                                    if (prop == 'title') {
                                        title.push("Population")
                                    }
                                    else if (prop == 'country_avg') {
                                        if(data[prop]>=0)
                                        country_avg.push(data[prop]);
                                        else
                                        country_avg.push(0);
                                    }
                                    else if (prop == 'site_norm_value') {
                                        if(data[prop]>=0){
                                        site_norm_value.push(data[prop]);
                                      }
                                        else{
                                        site_norm_value.push(0);
                                      }
                                    }
                                    else {
                                    }
                                }
                                break;
                            case 'Internal Roads':
                            for (var prop in data) {
                                              if (prop == 'title') {
                                                  title.push("Internal Roads")
                                              }
                                  else if (prop == 'country_avg') {
                                      if(data[prop]>=0)
                                      country_avg.push(data[prop]);
                                      else
                                      country_avg.push(0);
                                              }
                                  else if (prop == 'site_norm_value') {
                                      if(data[prop]>=0)
                                      site_norm_value.push(data[prop]);
                                      else
                                      site_norm_value.push(0);
                                              }
                                  else {
                                  }
                                }
                                break;
      
                            case 'amphibians indicator':
                            for (var prop in data) {
                                    if (prop == 'title') {
                                        title.push("Amphibians")
                                    }
                                    else if (prop == 'country_avg') {
                                        if(data[prop]>=0)
                                        country_avg.push(data[prop]);
                                        else
                                        country_avg.push(0);
                                    }
                                    else if (prop == 'site_norm_value') {
                                        if(data[prop]>=0)
                                        site_norm_value.push(data[prop]);
                                        else
                                        site_norm_value.push(0);
                                    }
                                    else {
                                    }
                                }
                                break;
                            case 'mammals indicator':
      
                            for (var prop in data) {
                                    if (prop == 'title') {
                                        title.push("Mammals")
      
                                    }
                                    else if (prop == 'country_avg') {
                                        if(data[prop]>=0)
                                        country_avg.push(data[prop]);
                                        else
                                        country_avg.push(0);
                                    }
                                    else if (prop == 'site_norm_value') {
                                        if(data[prop]>=0)
                                        site_norm_value.push(data[prop]);
                                      else
                                        site_norm_value.push(0);
      
                                  }
                                    else {
                                    }
                                }
                                break;
                            case 'birds indicator':
                            for (var prop in data) {
                                    if (prop == 'title') {
                                        title.push("Birds")
                                    }
                                    else if (prop == 'country_avg') {
                                        if(data[prop]>=0)
                                        country_avg.push(data[prop]);
                                        else
                                        country_avg.push(0);
                                    }
                                    else if (prop == 'site_norm_value') {
                                        if(data[prop]>=0)
                                        site_norm_value.push(data[prop]);
                                        else
                                        site_norm_value.push(0);
                                    }
                                    else {
                                    }
                                }
                                break;
                            case 'Popn. change':
                            for (var prop in data) {
                                    if (prop == 'title') {
                                        title.push("Pop. Change")
                                    }
                                    else if (prop == 'country_avg') {
                                        if(data[prop]>=0)
                                        country_avg.push(data[prop]);
                                        else
                                        country_avg.push(0);
                                    }
                                    else if (prop == 'site_norm_value') {
      
                                        if(data[prop]>=0){
                                        site_norm_value.push(data[prop]);
                                      }
                                        else{
                                        site_norm_value.push(0);
      
                                      }
                                    }
                                    else {
                                    }
                                }
                                break;
                            case 'Terrestrial HDI':
                            for (var prop in data) {
                                    if (prop == 'title') {
                                        title.push(" Coastal Habitat Diversity")
                                    }
                                    else if (prop == 'country_avg') {
                                        if(data[prop]>=0)
                                        country_avg.push(data[prop]);
                                        else
                                        country_avg.push(0);
                                    }
                                    else if (prop == 'site_norm_value') {
      
                                        if(data[prop]>=0){
                                        site_norm_value.push(data[prop]);
      
                                      }
                                        else{
                                        site_norm_value.push(0);
                                      }
                                    }
                                    else {
                                    }
                                }
                                break;
      
                            default:
                                break;
                        }
                    });
      
                    Highcharts.chart('pa_stats', {
                        chart: {
                          backgroundColor:'rgba(255, 255, 255, 0)',
                            polar: true,
                              zoomType: 'xy',
                              height: 350,
                              width: 350,
                              events: {
                                    
                                  }
                        },
                        title: {
                          style: {
                            color: '#FFFFFF',
                            font: '16px "Montserrat"'
                         },
                            text: 'Biodiverty Variables and Human Pressures'
                        },
                        subtitle: {
                            text: ""
                        },
      
                        credits: {
                            enabled: true,
                            text: '© DOPA Services',
                            href: 'http://dopa.jrc.ec.europa.eu/en/services'
                        },
                        xAxis: {
                            categories: title,
                            tickmarkPlacement: 'on',
                            lineWidth: 0
                        },
                        tooltip: {
                            formatter: function() {
                                var s = [];
      
                                $.each(this.points, function(i, point) {
                                    if(point.series.name == "Country Average"){
                                        s.push('<span style="color:rgb(130, 162, 145);font-weight:bold;">'+ point.key +' <br>'+ point.series.name +' : '+
                                        point.y +'<span>');
                                    }
                                    else{
                                        s.push('<span style="color:#184c52;">'+ point.series.name +' : '+
                                        point.y +'<span>');
                                    }
                                });
      
                                return s.join('<br>');
                            },
                            shared: true
                        },
                        yAxis: {
                            lineWidth: 0,
                            min: 0,
                            tickInterval: 10,
                            gridLineInterpolation: 'polygon'
                        },
                        legend: {
                          labelFormatter: function () {
                            return '<span style="color:' + this.color + ';">' + this.name + '</span>';
                        },
                        enabled: true,
                        verticalAlign: 'bottom',
                        itemMarginTop: -15,
                        itemStyle: {
                        color: '#3a3e37',
                        'font-size':'10px',
                        'font-weight':'100'
                        }
                        },
                        series: [{
                            type: 'area',
                            marker: {
                                enabled: false
                            },
                            name: 'Country Average',
                            data: country_avg,
                            color: '#d6eab9'
                        },
                        {
                            type: 'line',
                            marker: {
                                enabled: true
                            },
                            name: 'Protected Area',
                            data: site_norm_value,
                            color: '#78a635'
                        }]
                    });
                  }
                }
              });

        } else if (marine == '2'){

          $.ajax({
            url: url_marine,
            dataType: 'json',
            success: function(d) {
                if (d.metadata.recordCount == 0) {
                  
                } else {
                    var title = [];
                    var country_avg = [];
                    var site_norm_value = [];
                    $(d.records).each(function(i, data) {
                        switch (data.title) {
                            case 'amphibians indicator':
                            for (var prop in data) {
                                    if (prop == 'title') {
                                        title.push("Amphibians")
                                    }
                                    else if (prop == 'site_norm_value') {
                                        if(data[prop]>=0)
                                        site_norm_value.push(data[prop]);
                                        else
                                        site_norm_value.push(0);
                                    }
                                    else {
                                    }
                                }
                                break;
                                case 'anthozoa corals indicator':
                                for (var prop in data) {
                                        if (prop == 'title') {
                                            title.push("Anthozoa Corals")
                                        }
      
                                        else if (prop == 'site_norm_value') {
                                            if(data[prop]>=0)
                                            site_norm_value.push(data[prop]);
                                            else
                                            site_norm_value.push(0);
                                        }
                                        else {
                                        }
                                    }
                                    break;
                                    case 'hydrozoa corals indicator':
                                    for (var prop in data) {
                                            if (prop == 'title') {
                                                title.push("Hydrozoa Corals")
                                            }
      
                                            else if (prop == 'site_norm_value') {
                                                if(data[prop]>=0)
                                                site_norm_value.push(data[prop]);
                                                else
                                                site_norm_value.push(0);
                                            }
                                            else {
                                            }
                                        }
                                        break;
                                        case 'sharks_rays indicator':
                                        for (var prop in data) {
                                                if (prop == 'title') {
                                                    title.push("Sharks and Rays")
                                                }
      
                                                else if (prop == 'site_norm_value') {
                                                    if(data[prop]>=0)
                                                    site_norm_value.push(data[prop]);
                                                    else
                                                    site_norm_value.push(0);
                                                }
                                                else {
                                                }
                                            }
                                            break;
                            case 'mammals indicator':
      
                            for (var prop in data) {
                                    if (prop == 'title') {
                                        title.push("Mammals")
                                    }
                                    else if (prop == 'site_norm_value') {
                                        if(data[prop]>=0)
                                        site_norm_value.push(data[prop]);
                                      else
                                        site_norm_value.push(0);
                                  }
                                    else {
                                    }
                                }
                                break;
                            case 'birds indicator':
                            for (var prop in data) {
                                    if (prop == 'title') {
                                        title.push("Birds")
                                    }
                                    else if (prop == 'site_norm_value') {
                                        if(data[prop]>=0)
                                        site_norm_value.push(data[prop]);
                                        else
                                        site_norm_value.push(0);
                                    }
                                    else {
                                    }
                                }
                                break;
                            case 'marine indicator':
                            for (var prop in data) {
                                    if (prop == 'title') {
                                        title.push(" Marine Habitat Diversity")
                                    }
      
                                    else if (prop == 'site_norm_value') {
      
                                        if(data[prop]>=0){
                                        site_norm_value.push(data[prop]);
      
                                      }
                                        else{
                                        site_norm_value.push(0);
      
                                      }
                                    }
                                    else {
                                    }
                                }
                                break;
      
                            default:
                                break;
                        }
                    });
                    Highcharts.chart('pa_stats', {
                        chart: {
                          backgroundColor:'rgba(255, 255, 255, 0)',
                          polar: true,
                          zoomType: 'xy',
                          height: 350,
                          width: 350,
                              events: {
                                  
                                  }
                        },
                        title: {
                          style: {
                            color: '#FFFFFF',
                            font: '16px "Montserrat"'
                         },
                            text: 'Marine Biodiverty Variables'
                        },
                        subtitle: {
                            text: ""
                        },
                        credits: {
                            enabled: true,
                            text: '© DOPA Services',
                            href: 'http://dopa.jrc.ec.europa.eu/en/services'
                        },
                        xAxis: {
                            categories: title,
                            tickmarkPlacement: 'on',
                            lineWidth: 0
                        },
                        tooltip: {
                            formatter: function() {
                                var s = [];
                                $.each(this.points, function(i, point) {
                                  s.push('<span style="color:#184c52;">'+ point.key +' : '+ Math.round((point.y)*100)/100  +'<span>');
                                });
                                return s.join('<br>');
                            },
                            shared: true
                        },
                        yAxis: {
                            lineWidth: 0,
                            min: 0,
                            tickInterval: 10,
                            gridLineInterpolation: 'polygon'
                        },
                        legend: {
                          labelFormatter: function () {
                            return '<span style="color:' + this.color + ';">' + this.name + '</span>';
                        },
                        enabled: true,
                        verticalAlign: 'bottom',
                        itemMarginTop: -15,
                        itemStyle: {
                        color: '#3a3e37',
                        'font-size':'10px',
                        'font-weight':'100'
                        }
                        },
      
                        series: [{
                            type: 'line',
                            marker: {
                                enabled: true
                            },
                            name: 'Protected Area',
                            data: site_norm_value,
                            color: '#78a635'
                        }]
                    });
                  }
                }
              });
        }
    



        new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML('<a href="https://dopa.gis-ninja.eu/wdpa/'+e.features[0].properties.wdpaid+'" target="_blank">'+e.features[0].properties.name+
        '</a><br><i>WDPA ID <b class = "higlightpa">'+e.features[0].properties.wdpaid+
        '</b></i><br><i>Status <b class = "higlightpa">'+e.features[0].properties.status+
        '</b></i><br><i>Status Year <b class = "higlightpa">'+e.features[0].properties.status_yr+
        '</b></i><br><i>IUCN Category <b class = "higlightpa">'+e.features[0].properties.iucn_cat+
        '</b></i><br><i>Reported Area <b class = "higlightpa">'+e.features[0].properties.rep_area+ ' km<sup>2</sup>'+
        '</b></i><br><i>Designation <b class = "higlightpa"> '+e.features[0].properties.desig_eng+'</b></i>')
        .addTo(map);
        });
         
        map.on('mouseenter', 'dopa_geoserver_wdpa_master_202101_o1', function () {
        map.getCanvas().style.cursor = 'pointer';
        });
         
        map.on('mouseleave', 'dopa_geoserver_wdpa_master_202101_o1', function () {
        map.getCanvas().style.cursor = '';
        });
        map.on("moveend", function () {
          var features = map.queryRenderedFeatures({ layers: ["dopa_geoserver_wdpa_master_202101_o1"] });
          if (features) {
          var uniqueFeatures = getUniqueFeatures(features, "wdpaid");
          renderListings(uniqueFeatures);
          airports = uniqueFeatures;
          }
          });
          
          map.on("mousemove", "dopa_geoserver_wdpa_master_202101_o1", function (e) {
            map.setFilter("wdpa_high", ["in", "wdpaid", e.features[0].properties.wdpaid]);
          map.getCanvas().style.cursor = "pointer";
          popup.setLngLat(e.lngLat)         .setHTML('<a href="https://dopa.gis-ninja.eu/wdpa/'+e.features[0].properties.wdpaid+'" target="_blank">'+e.features[0].properties.name+
          '</a><br><i>WDPA ID <b class = "higlightpa">'+e.features[0].properties.wdpaid+
          '</b></i><br><i>Status <b class = "higlightpa">'+e.features[0].properties.status+
          '</b></i><br><i>Status Year <b class = "higlightpa">'+e.features[0].properties.status_yr+
          '</b></i><br><i>IUCN Category <b class = "higlightpa">'+e.features[0].properties.iucn_cat+
          '</b></i><br><i>Reported Area <b class = "higlightpa">'+(e.features[0].properties.rep_area).toLocaleString()+ ' km<sup>2</sup>'+
          '</b></i><br><i>Designation <b class = "higlightpa"> '+e.features[0].properties.desig_eng+'</b></i>')
          .addTo(map);
        
        });
          
          map.on("mouseleave", "dopa_geoserver_wdpa_master_202101_o1", function () {
          map.getCanvas().style.cursor = "";
          map.getCanvas().style.cursor = "";
          popup.remove();
          });
// Country Popup
        map.on('click', 'dopa_geoserver_global_dash', function (e) {

          map.setFilter("dopa_geoserver_wdpa_master_202101_o1", ["in", "iso3", e.features[0].properties.iso3_digit]);

          map.setFilter("dopa_geoserver_global_dash", ["!in", "iso2_digit", e.features[0].properties.iso2_digit]);

          $('#country_var_dropdown').show();

          if($('#prot_legend').length == 0) {
             $('.legend').append("<br><div id='prot_legend'> <p class='country_sel_legend_title'>Protected Areas</p>"+
            "<div><span class='square_pa'style='background-color: #7fbc41'></span>Terrestrial</div>"+
            "<div><span class='square_pa'style='background-color: #b9cda5'></span>Coastal</div>"+
            "<div><span class='square_pa'style='background-color: #13a6ec'></span>Marine</div>"+
            "</div>");
          }else{

          }

 

          if($('#live_layer_container').is(':visible')) {
            $('#pa_stats').addClass("relPosition");
            $('#country_var_dropdown').addClass("relPosition");
           $('#country_var_dropdown').show().prependTo('#pa_stats');
        }else{
          $('#pa_stats').removeClass("relPosition");
        }
          map.setFilter("country_high", ["in", "iso2_digit", e.features[0].properties.iso2_digit]);
          var prot_mar_perc_ind = e.features[0].properties.prot_mar_perc_ind;
          if (prot_mar_perc_ind == null){
            prot_mar_perc_ind = 0
          } else{
            prot_mar_perc_ind = prot_mar_perc_ind
          }
          var prot_mar_perc_rank = e.features[0].properties.prot_mar_perc_rank;
          if (prot_mar_perc_rank == null){
            prot_mar_perc_rank = 'No marine area detected'
          } else{
            prot_mar_perc_rank = prot_mar_perc_rank
          }
          $('#pa_stats').show();



        
             var country_stats_rest = "https://geospatial.jrc.ec.europa.eu/geoserver/wfs?request=getfeature&version=1.0.0&service=wfs&typename=dopa_explorer_3:dopa_geoserver_global_dash&propertyname=name_c,iso3_digit,iso2_digit,&SORTBY=iso2_digit&CQL_FILTER=iso2_digit='"+e.features[0].properties.iso2_digit+"'&outputFormat=application%2Fjson";
             console.log(country_stats_rest);
             $.ajax({
                 url: country_stats_rest,
                 dataType: 'json',
                 success: function(d) {
                    
                         var bbox = [];
                         console.log(d.features[0].properties.bbox[0]);
                         
                         var x1 = d.features[0].properties.bbox[0];
                         var x2 = d.features[0].properties.bbox[1];
                         var x3 = d.features[0].properties.bbox[2];
                         var x4 = d.features[0].properties.bbox[3];
                        
                         
                         map.fitBounds([
                            [x3,x4],
                            [x1,x2]
                          ])
        
 
                       
                   },
               });
         
             


          $('#pa_stats').html(
          "<div>"+
          "<div id='c_title'><a href='https://dopa.gis-ninja.eu/country/"+e.features[0].properties.iso2_digit+"' target='_blank'>"+e.features[0].properties.name_c+"</a><br><br></div>"+
          "<div id='p_title'>Protection & Connectivity</div>"+
          "<span class = 'coll_item_title' >Overall Protection ("+e.features[0].properties.prot_perc_ind.toLocaleString()+"% Rank: "+e.features[0].properties.prot_perc_rank+")</span>"+
          "<a class='btn modal-trigger' href='#modal-overall_protection'><span class='material-icons'>info</span></a>"+
          "<div id='progressbar'><div style='width:"+e.features[0].properties.prot_perc_ind+"%'></div></div>"+

          "<span class = 'coll_item_title' > Terrestrial Protection ("+e.features[0].properties.prot_terr_perc_ind.toLocaleString()+"% Rank: "+e.features[0].properties.prot_terr_perc_rank+")</span>"+
          "<a class='btn modal-trigger' href='#modal-overall_protection'><span class='material-icons'>info</span></a>"+
          "<div id='progressbar'><div style='width:"+e.features[0].properties.prot_terr_perc_ind+"%'></div></div>"+

          "<span class = 'coll_item_title' > Marine Protection(" +prot_mar_perc_ind.toLocaleString()+"% Rank: "+prot_mar_perc_rank+")</span>"+
          "<a class='btn modal-trigger' href='#modal-overall_protection'><span class='material-icons'>info</span></a>"+
          "<div id='progressbar'><div style='width:"+prot_mar_perc_ind+"%'></div></div>"+

          "<span class = 'coll_item_title' > Terrestrial Connectivity ("+e.features[0].properties.protconn_ind.toLocaleString()+"% Rank: "+e.features[0].properties.protconn_rank+")</span>"+
          "<a class='btn modal-trigger' href='#modal-overall_protection'><span class='material-icons'>info</span></a>"+
          "<div id='progressbar'><div style='width:"+e.features[0].properties.protconn_ind+"%'></div></div>"+

          // Ecosystem Indicators
          "<div id='p_title'>Ecosystems</div>"+
          "<span class = 'coll_item_title' > Forest Cover ("+e.features[0].properties.forest_perc_ind+"% Rank: "+e.features[0].properties.forest_perc_rank+")</span>"+
          "<a class='btn modal-trigger' href='#modal-overall_protection'><span class='material-icons'>info</span></a>"+
          "<div id='progressbar'><div style='width:"+e.features[0].properties.forest_perc_ind+"%'></div></div>"+
        
          "<span class = 'coll_item_title' > Forest Gain ("+e.features[0].properties.forest_gain_perc_ind+"% Rank: "+e.features[0].properties.forest_gain_perc_rank+")</span>"+
          "<a class='btn modal-trigger' href='#modal-overall_protection'><span class='material-icons'>info</span></a>"+
          "<div id='progressbar'><div style='width:"+e.features[0].properties.forest_gain_perc_ind+"%'></div></div>"+
          
          "<span class = 'coll_item_title' > Forest Loss ("+e.features[0].properties.forest_loss_perc_ind+"% Rank: "+e.features[0].properties.forest_loss_perc_rank+")</span>"+
          "<a class='btn modal-trigger' href='#modal-overall_protection'><span class='material-icons'>info</span></a>"+
          "<div id='progressbar'><div style='width:"+e.features[0].properties.forest_loss_perc_ind+"%'></div></div>"+

          "<span class = 'coll_item_title' > Natural Areas ("+e.features[0].properties.land_natural_perc_ind.toLocaleString()+"% Rank: "+e.features[0].properties.land_natural_perc_rank+")</span>"+
          "<a class='btn modal-trigger' href='#modal-overall_protection'><span class='material-icons'>info</span></a>"+
          "<div id='progressbar'><div style='width:"+e.features[0].properties.land_natural_perc_ind+"%'></div></div>"+

          "<span class = 'coll_item_title' > Net change of Permanent Surface Water (Rank: "+e.features[0].properties.water_p_netchange_perc_rank+")</span>"+
          "<a class='btn modal-trigger' href='#modal-overall_protection'><span class='material-icons'>info</span></a>"+
          "<div id='numind'>"+e.features[0].properties.water_p_netchange_perc_rank.toLocaleString()+"%</div></div>"+

          "<span class = 'coll_item_title' > Land Degradation ("+e.features[0].properties.land_degradation_ind+"% Rank: "+e.features[0].properties.land_degradation_rank+" )</span>"+
          "<a class='btn modal-trigger' href='#modal-overall_protection'><span class='material-icons'>info</span></a>"+
          "<div id='progressbar'><div style='width:"+e.features[0].properties.land_degradation_ind+"%'></div></div>"+
          // Ecosystem Services
          "<div id='p_title'>Ecosystem Services</div>"+

          "<span class = 'coll_item_title' > Total Carbon (Rank: "+e.features[0].properties.tot_carbon_rank+")</span>"+
          "<a class='btn modal-trigger' href='#modal-overall_protection'><span class='material-icons'>info</span></a>"+
          "<div id='numind'>"+e.features[0].properties.tot_carbon_ind.toLocaleString()+"Pg</div></div>"+

          // Species Indicators
          "<div id='p_title'>Species</div>"+
          "<span class = 'coll_item_title' > Number of Species (Rank: "+e.features[0].properties.tot_species_rank+")</span>"+
          "<a class='btn modal-trigger' href='#modal-overall_protection'><span class='material-icons'>info</span></a>"+
          "<div id='numind'>"+e.features[0].properties.tot_species_ind+"</div></div>"+

          "<span class = 'coll_item_title' > Number of Endemic Species (Rank: "+e.features[0].properties.species_endem_rank+")</span>"+
          "<a class='btn modal-trigger' href='#modal-overall_protection'><span class='material-icons'>info</span></a>"+
          "<div id='numind'>"+e.features[0].properties.species_endem_ind+"</div></div>"+

          "<span class = 'coll_item_title' > Number of Threatened Species(Rank: "+e.features[0].properties.threat_species_rank+")</span>"+
          "<a class='btn modal-trigger' href='#modal-overall_protection'><span class='material-icons'>info</span></a>"+
          "<div id='numind'>"+e.features[0].properties.threat_species_ind+"</div></div>"+

          "<span class = 'coll_item_title' > Number of Threatened Endemic Species ( Rank:"+e.features[0].properties.species_endem_threat_rank+")</span>"+
          "<a class='btn modal-trigger' href='#modal-overall_protection'><span class='material-icons'>info</span></a>"+
          "<div id='numind'>"+e.features[0].properties.species_endem_threat_ind+"</div></div>"+

           // Pressure Indicators
          "<div id='p_title'>Human Dynamics</div>"+
          "<span class = 'coll_item_title' > Total Population ("+e.features[0].properties.tot_pop_ind.toLocaleString()+" Rank: "+e.features[0].properties.tot_pop_rank+")</span>"+
          "<a class='btn modal-trigger' href='#modal-overall_protection'><span class='material-icons'>info</span></a>"+
          "<div id='numind'>"+e.features[0].properties.tot_pop_ind.toLocaleString()+"</div></div>"+

          "<span class = 'coll_item_title' > Population Density (Rank: "+e.features[0].properties.dens_pop_rank+")</span>"+
          "<a class='btn modal-trigger' href='#modal-overall_protection'><span class='material-icons'>info</span></a>"+
          "<div id='numind'>"+e.features[0].properties.dens_pop_ind.toLocaleString()+"</div></div>"+

          "<span class = 'coll_item_title' > Population Growth (Rank: "+e.features[0].properties.growth_pop_rank+")</span>"+
          "<a class='btn modal-trigger' href='#modal-overall_protection'><span class='material-icons'>info</span></a>"+
          "<div id='numind'>"+e.features[0].properties.growth_pop_ind.toLocaleString()+"</div></div>"+

          "<span class = 'coll_item_title' > Agricultural Areas ("+e.features[0].properties.agri_area_ind.toLocaleString()+"% Rank: "+e.features[0].properties.agri_area_rank+")</span>"+
          "<a class='btn modal-trigger' href='#modal-overall_protection'><span class='material-icons'>info</span></a>"+
          "<div id='progressbar'><div style='width:"+e.features[0].properties.agri_area_ind+"%'></div></div>"+

          "</div></li></ul>");
          });
          
          map.on('mouseenter', 'dopa_geoserver_global_dash', function () {
          map.getCanvas().style.cursor = 'pointer';
          });
           
          map.on('mouseleave', 'dopa_geoserver_global_dash', function () {
          map.getCanvas().style.cursor = '';
          });

          map.on("moveend", function () {
            var features = map.queryRenderedFeatures({ layers: ["dopa_geoserver_global_dash"] });
            if (features) {
            var uniqueFeatures = getUniqueFeatures(features, "iso2_digit");
           
            renderListings(uniqueFeatures);
            country = uniqueFeatures;
            }
            });
            
            map.on("mousemove", "dopa_geoserver_global_dash", function (e) {
            map.getCanvas().style.cursor = "pointer";
            map.setFilter("country_high", ["in", "iso2_digit", e.features[0].properties.iso2_digit]);
            var prot_mar_perc_ind = e.features[0].properties.prot_mar_perc_ind;
            if (prot_mar_perc_ind == null){
              prot_mar_perc_ind = 0
            } else{
              prot_mar_perc_ind = prot_mar_perc_ind
            }
            popup.setLngLat(e.lngLat)
            .setHTML('<a href="https://dopa.gis-ninja.eu/country/'+e.features[0].properties.iso2_digit+'" target="_blank">'+e.features[0].properties.name_c+'</a><br><div class = "marine_eco"></div>'+
            " <ul><li>"+
            "<div><span class = 'coll_item_title' > Terrestrial Protection ("+e.features[0].properties.prot_terr_perc_ind.toLocaleString()+")</span>"+
              "<div id='progressbar'><div style='width:"+e.features[0].properties.prot_terr_perc_ind+"%'></div></div>"+
              "<span class = 'coll_item_title' > Marine Protection(" +prot_mar_perc_ind.toLocaleString()+")</span>"+
              "<div id='progressbar'><div style='width:" +prot_mar_perc_ind+"%'></div></div>"+
              "<span class = 'coll_item_title' > Terrestrial Connectivity ("+e.features[0].properties.protconn_ind.toLocaleString()+")</span>"+
              "<div id='progressbar'><div style='width:"+e.features[0].properties.protconn_ind+"%'></div></div>"+
              "</div></li></ul>")
            .addTo(map);
           });
            map.on("mouseleave", "dopa_geoserver_global_dash", function () {
            map.getCanvas().style.cursor = "";
            map.getCanvas().style.cursor = "";
            popup.remove();
            });
// Ecoregion Popup
          map.on('click', 'dopa_geoserver_ecoregions_master_201905', function (e) {
            map.setFilter("ecoregion_high", ["in", "id", e.features[0].properties.id]);
            var marine = e.features[0].properties.is_marine;
              if (marine == 'yes') {
                 
                marine = 'Marine Ecoregion';

              }else{
                marine = 'Terrestrial Ecoregion';
              }


            new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML('<a href="https://dopa.gis-ninja.eu/ecoregion/'+e.features[0].properties.id+'" target="_blank">'+e.features[0].properties.eco_name+'</a><br><div class = "marine_eco">'+marine+'</div>'+
            "<div><span class = 'coll_item_title' >Protection ("+e.features[0].properties.protection.toLocaleString()+")</span>"+
            "<div id='progressbar'><div style='width:"+e.features[0].properties.protection+"%'></div></div>"+
            "<span class = 'coll_item_title' > Terrestrial Connectivity ("+e.features[0].properties.connect.toLocaleString()+")</span>"+
            "<div id='progressbar'><div style='width:"+e.features[0].properties.connect+"%'></div></div>"+
            "</div></li></ul>")
            .addTo(map);
            });
             
            map.on('mouseenter', 'dopa_geoserver_ecoregions_master_201905', function () {
            map.getCanvas().style.cursor = 'pointer';
            });
             
            map.on('mouseleave', 'dopa_geoserver_ecoregions_master_201905', function () {
            map.getCanvas().style.cursor = '';
            });

            map.on("moveend", function () {

              var features = map.queryRenderedFeatures({ layers: ["dopa_geoserver_ecoregions_master_201905"] });
              if (features) {
              var uniqueFeatures = getUniqueFeatures(features, "id");
              renderListings(uniqueFeatures);
              airports = uniqueFeatures;
              }
              });
              
              map.on("mousemove", "dopa_geoserver_ecoregions_master_201905", function (e) {
                map.setFilter("ecoregion_high", ["in", "id", e.features[0].properties.id]);
                var marine = e.features[0].properties.is_marine;
                if (marine == 'yes') {
                   
                  marine = 'Marine Ecoregion';
  
                }else{
                  marine = 'Terrestrial Ecoregion';
                }
              map.getCanvas().style.cursor = "pointer";
              popup.setLngLat(e.lngLat) 
              .setHTML('<a href="https://dopa.gis-ninja.eu/ecoregion/'+e.features[0].properties.id+'" target="_blank">'+e.features[0].properties.eco_name+'</a><br><div class = "marine_eco">'+marine+'</div>'+
              "<div><span class = 'coll_item_title' >Protection ("+e.features[0].properties.protection.toLocaleString()+")</span>"+
              "<div id='progressbar'><div style='width:"+e.features[0].properties.protection+"%'></div></div>"+
              "<span class = 'coll_item_title' > Terrestrial Connectivity ("+e.features[0].properties.connect.toLocaleString()+")</span>"+
              "<div id='progressbar'><div style='width:"+e.features[0].properties.connect+"%'></div></div>"+
              "</div></li></ul>")
              .addTo(map);
              });
              map.on("mouseleave", "dopa_geoserver_ecoregions_master_201905", function () {
              map.getCanvas().style.cursor = "";
              map.getCanvas().style.cursor = "";
              popup.remove();
              });


    setTimeout(function(){
      $("#map").busyLoad("hide", {animation: "fade"});
      console.log('5')
    }, 6000);
     



// Create a popup, but don't add it to the map yet.
var popup = new mapboxgl.Popup({
closeButton: false,
closeOnClick: false
});
 

}); // map on load function


var popup = new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: true
});

map.addControl(new mapboxgl.NavigationControl());


