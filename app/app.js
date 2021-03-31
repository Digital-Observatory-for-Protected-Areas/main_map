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
    center: [20, 20], // starting position[35.890, -75.664]
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
              '#77bb0a',
              '1',
              '#d37c10',
              '2',
              '#13a6ec',
              /* other */ '#ccc'
              ],
              'fill-opacity': 0.3
              }
    
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
            '#77bb0a',
            '1',
            '#d37c10',
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
        "id": "dopa_geoserver_countries_master_201905",
        "type": "fill",
        "source": {
            "type": "vector",
            "tiles": ["https://geospatial.jrc.ec.europa.eu/geoserver/gwc/service/wmts?layer=dopa_explorer_3:dopa_geoserver_countries_master_201905&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=application/x-protobuf;type=mapbox-vector&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}"]
            },
        "source-layer": "dopa_geoserver_countries_master_201905",
  
        'paint': {
          'fill-color': {
            property: 't_pro_per', 
            stops: [
              [0, '#e44930'],
              [1, '#f3715c'],
              [2, '#f8981d'],
              [5, '#f5ca71'],
              [8, '#eed844'],
              [12, '#b6d661'],
              [17, '#79ac41'],
              [30, '#196131'],
              [50, '#064219']
            ]
          },
          'fill-opacity': 0.6
        }, 'filter': ["in", "id",'xxx'],
  
    }, 'waterway-label');

    map.addLayer({
      "id": "country_high",
      "type": "fill",
      "source": {
          "type": "vector",
          "tiles": ["https://geospatial.jrc.ec.europa.eu/geoserver/gwc/service/wmts?layer=dopa_explorer_3:dopa_geoserver_countries_master_201905&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=application/x-protobuf;type=mapbox-vector&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}"]
          },
      "source-layer": "dopa_geoserver_countries_master_201905",

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
            [0, '#e44930'],
            [1, '#f3715c'],
            [2, '#f8981d'],
            [5, '#f5ca71'],
            [8, '#eed844'],
            [12, '#b6d661'],
            [17, '#79ac41'],
            [30, '#196131'],
            [50, '#064219']
          ]
        },
        'fill-opacity': 0.6
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
  map.setPaintProperty('dopa_geoserver_countries_master_201905', 'fill-color', 
  ['interpolate',['linear'],['get', layer_country_value],
  
  0, '#e44930',1, '#f3715c',2, '#f8981d',5, '#f5ca71',8, '#eed844',12, '#b6d661',17, '#79ac41',30, '#196131',50, '#064219',
]);
});

$('.search_icon').click(function() {
  map.setFilter("dopa_geoserver_countries_master_201905", ["in", "id", "xxx"]);
  map.setFilter("dopa_geoserver_ecoregions_master_201905", ["in", "id", "xxx"]);
  map.setFilter("dopa_geoserver_wdpa_master_202101_o1", ["!in", "id", "xxx"]);
  $('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Protected Areas</p>"+
  "<div><span class='square_pa'style='background-color: #77bb0a'></span>Terrestrial</div>"+
  "<div><span class='square_pa'style='background-color: #d37c10'></span>Coastal</div>"+
  "<div><span class='square_pa'style='background-color: #13a6ec'></span>Marine</div>"+
  "</div>");
  $('#pa_stats').hide();

})

$('.country_select').click(function() {
  map.setFilter("dopa_geoserver_countries_master_201905", ["!in", "id", "xxx"]);
  map.setFilter("dopa_geoserver_ecoregions_master_201905", ["in", "id", "xxx"]);
  map.setFilter("dopa_geoserver_wdpa_master_202101_o1", ["in", "id", "xxx"]);
  map.setFilter("country_high", ["in", "id", "xxx"]);
  map.setFilter("ecoregion_high", ["in", "id", "xxx"]);
  map.setFilter("wdpa_high", ["in", "id", "xxx"]);
  map.setFilter("wdpa_high2", ["in", "id", "xxx"]);
  $('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Country Protection</p>"+
  "<div><span class='square_pa'style='background-color: #e44930'></span>0%</div>"+
  "<div><span class='square_pa'style='background-color: #f3715c'></span>1%</div>"+
  "<div><span class='square_pa'style='background-color: #f8981d'></span>2%</div>"+
  "<div><span class='square_pa'style='background-color: #f5ca71'></span>5%</div>"+
  "<div><span class='square_pa'style='background-color: #eed844'></span>8%</div>"+
  "<div><span class='square_pa'style='background-color: #b6d661'></span>12%</div>"+
  "<div><span class='square_pa'style='background-color: #79ac41'></span>17%</div>"+
  "<div><span class='square_pa'style='background-color: #196131'></span>30%</div>"+
  "<div><span class='square_pa'style='background-color: #064219'></span>50% or more</div>"+
  "</div>");
  $('#pa_stats').hide();
})

$('.ecoregion_select').click(function() {
  map.setFilter("dopa_geoserver_countries_master_201905", ["!in", "id", "xxx"]);
  map.setFilter("dopa_geoserver_ecoregions_master_201905", ["in", "id", "xxx"]);
  map.setFilter("dopa_geoserver_wdpa_master_202101_o1", ["in", "id", "xxx"]);
  map.setFilter("country_high", ["in", "id", "xxx"]);
  map.setFilter("ecoregion_high", ["in", "id", "xxx"]);
  map.setFilter("wdpa_high", ["in", "id", "xxx"]);
  map.setFilter("wdpa_high2", ["in", "id", "xxx"]);
  $('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Ecoregion Protection</p>"+
  "<div><span class='square_pa'style='background-color: #e44930'></span>0%</div>"+
  "<div><span class='square_pa'style='background-color: #f3715c'></span>1%</div>"+
  "<div><span class='square_pa'style='background-color: #f8981d'></span>2%</div>"+
  "<div><span class='square_pa'style='background-color: #f5ca71'></span>5%</div>"+
  "<div><span class='square_pa'style='background-color: #eed844'></span>8%</div>"+
  "<div><span class='square_pa'style='background-color: #b6d661'></span>12%</div>"+
  "<div><span class='square_pa'style='background-color: #79ac41'></span>17%</div>"+
  "<div><span class='square_pa'style='background-color: #196131'></span>30%</div>"+
  "<div><span class='square_pa'style='background-color: #064219'></span>50% or more</div>"+
  "</div>");
  $('#country_var_dropdown').hide();
  $('#pa_stats').hide();
  
})

$('.pa_select').click(function() {
  map.setFilter("dopa_geoserver_countries_master_201905", ["in", "id", "xxx"]);
  map.setFilter("dopa_geoserver_ecoregions_master_201905", ["in", "id", "xxx"]);
  map.setFilter("dopa_geoserver_wdpa_master_202101_o1", ["!in", "id", "xxx"]);
  map.setFilter("country_high", ["in", "id", "xxx"]);
  map.setFilter("ecoregion_high", ["in", "id", "xxx"]);
  map.setFilter("wdpa_high", ["in", "id", "xxx"]);
  map.setFilter("wdpa_high2", ["in", "id", "xxx"]);
  $('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Protected Areas</p>"+
  "<div><span class='square_pa'style='background-color: #77bb0a'></span>Terrestrial</div>"+
  "<div><span class='square_pa'style='background-color: #d37c10'></span>Coastal</div>"+
  "<div><span class='square_pa'style='background-color: #13a6ec'></span>Marine</div>"+
  "</div>");
  $('#country_var_dropdown').hide();
})

$('.legend').html("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Protected Areas</p>"+
"<div><span class='square_pa'style='background-color: #77bb0a'></span>Terrestrial</div>"+
"<div><span class='square_pa'style='background-color: #d37c10'></span>Coastal</div>"+
"<div><span class='square_pa'style='background-color: #13a6ec'></span>Marine</div>"+
"</div>");

$('.ecoregion_select').click(function() {
  map.setFilter("dopa_geoserver_countries_master_201905", ["in", "id", "xxx"]);
  map.setFilter("dopa_geoserver_ecoregions_master_201905", ["!in", "id", "xxx"]);
  map.setFilter("dopa_geoserver_wdpa_master_202101_o1", ["in", "id", "xxx"]);
})


 
// PA Popup
      map.on('click', 'dopa_geoserver_wdpa_master_202101_o1', function (e) {
        $('#pa_stats').empty();
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
                                  //  load: function(event) {
                                  //     $('#theImg').hide();
                                  //  }
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
          '</b></i><br><i>Reported Area <b class = "higlightpa">'+e.features[0].properties.rep_area+ ' km<sup>2</sup>'+
          '</b></i><br><i>Designation <b class = "higlightpa"> '+e.features[0].properties.desig_eng+'</b></i>')
          .addTo(map);
        
        });
          
          map.on("mouseleave", "dopa_geoserver_wdpa_master_202101_o1", function () {
          map.getCanvas().style.cursor = "";
          map.getCanvas().style.cursor = "";
          popup.remove();
          });
// Country Popup
        map.on('click', 'dopa_geoserver_countries_master_201905', function (e) {
          map.setFilter("country_high", ["in", "iso2_digit", e.features[0].properties.iso2_digit]);
          new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML('<a href="https://dopa.gis-ninja.eu/country/'+e.features[0].properties.iso2_digit+'" target="_blank">'+e.features[0].properties.name_c+'</a><br><div class = "marine_eco"></div>'+
          " <ul><li>"+
          "<div><span class = 'coll_item_title' > Terrestrial Protection ("+e.features[0].properties.t_pro_per.toLocaleString()+")</span>"+
            "<div id='progressbar'><div style='width:"+e.features[0].properties.t_pro_per+"%'></div></div>"+
            "<span class = 'coll_item_title' > Marine Protection(" +e.features[0].properties.m_prot_per.toLocaleString()+")</span>"+
            "<div id='progressbar'><div style='width:" +e.features[0].properties.m_prot_per+"%'></div></div>"+
            "<span class = 'coll_item_title' > Terrestrial Connectivity ("+e.features[0].properties.t_conn_per.toLocaleString()+")</span>"+
            "<div id='progressbar'><div style='width:"+e.features[0].properties.t_conn_per+"%'></div></div>"+
            "</div></li></ul>")
          .addTo(map);
          });
          
          map.on('mouseenter', 'dopa_geoserver_countries_master_201905', function () {
          map.getCanvas().style.cursor = 'pointer';
          });
           
          map.on('mouseleave', 'dopa_geoserver_countries_master_201905', function () {
          map.getCanvas().style.cursor = '';
          });

          map.on("moveend", function () {
            var features = map.queryRenderedFeatures({ layers: ["dopa_geoserver_countries_master_201905"] });
            if (features) {
            var uniqueFeatures = getUniqueFeatures(features, "iso2_digit");
           
            renderListings(uniqueFeatures);
            country = uniqueFeatures;
            }
            });
            
            map.on("mousemove", "dopa_geoserver_countries_master_201905", function (e) {
            map.getCanvas().style.cursor = "pointer";
            map.setFilter("country_high", ["in", "iso2_digit", e.features[0].properties.iso2_digit]);
            popup.setLngLat(e.lngLat)
            .setHTML('<a href="https://dopa.gis-ninja.eu/country/'+e.features[0].properties.iso2_digit+'" target="_blank">'+e.features[0].properties.name_c+'</a><br><div class = "marine_eco"></div>'+
            " <ul><li>"+
            "<div><span class = 'coll_item_title' > Terrestrial Protection ("+e.features[0].properties.t_pro_per.toLocaleString()+")</span>"+
              "<div id='progressbar'><div style='width:"+e.features[0].properties.t_pro_per+"%'></div></div>"+
              "<span class = 'coll_item_title' > Marine Protection(" +e.features[0].properties.m_prot_per.toLocaleString()+")</span>"+
              "<div id='progressbar'><div style='width:" +e.features[0].properties.m_prot_per+"%'></div></div>"+
              "<span class = 'coll_item_title' > Terrestrial Connectivity ("+e.features[0].properties.t_conn_per.toLocaleString()+")</span>"+
              "<div id='progressbar'><div style='width:"+e.features[0].properties.t_conn_per+"%'></div></div>"+
              "</div></li></ul>")
            .addTo(map);
           });
            map.on("mouseleave", "dopa_geoserver_countries_master_201905", function () {
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


var popup = new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: true
});

map.addControl(new mapboxgl.NavigationControl());


