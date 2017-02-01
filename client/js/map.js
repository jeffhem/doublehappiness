class GMap {
  constructor() {
    this.mapCanvas = document.querySelector('#map');
  }

  init() {
    this.clickAction();
    setTimeout( () => {
      const styledMapType = new google.maps.StyledMapType(
        [ { "elementType": "geometry", "stylers": [ { "color": "#f5f5f5" } ] }, { "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] }, { "elementType": "labels.text.fill", "stylers": [ { "color": "#616161" } ] }, { "elementType": "labels.text.stroke", "stylers": [ { "color": "#f5f5f5" } ] }, { "featureType": "administrative.land_parcel", "elementType": "labels", "stylers": [ { "visibility": "off" } ] }, { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [ { "color": "#bdbdbd" } ] }, { "featureType": "poi", "elementType": "geometry", "stylers": [ { "color": "#eeeeee" } ] }, { "featureType": "poi", "elementType": "labels.text", "stylers": [ { "visibility": "off" } ] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" } ] }, { "featureType": "poi.business", "stylers": [ { "visibility": "off" } ] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [ { "color": "#e5e5e5" } ] }, { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [ { "color": "#c8ffcc" }, { "lightness": 55 } ] }, { "featureType": "poi.park", "elementType": "labels.text", "stylers": [ { "visibility": "off" } ] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [ { "color": "#9e9e9e" } ] }, { "featureType": "road", "elementType": "geometry", "stylers": [ { "color": "#ffffff" } ] }, { "featureType": "road.arterial", "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" } ] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [ { "color": "#dadada" } ] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [ { "color": "#fe9d7e" } ] }, { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [ { "color": "#616161" } ] }, { "featureType": "road.local", "elementType": "labels", "stylers": [ { "visibility": "off" } ] }, { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [ { "color": "#9e9e9e" } ] }, { "featureType": "transit.line", "elementType": "geometry", "stylers": [ { "color": "#e5e5e5" } ] }, { "featureType": "transit.station", "elementType": "geometry", "stylers": [ { "color": "#eeeeee" } ] }, { "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#c9c9c9" } ] }, { "featureType": "water", "elementType": "geometry.fill", "stylers": [ { "color": "#9bd1fe" }, { "saturation": -65 }, { "lightness": 50 }, { "weight": 1 } ] }, { "featureType": "water", "elementType": "geometry.stroke", "stylers": [ { "visibility": "off" } ] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [ { "color": "#9e9e9e" } ] } ], {name: 'Styled Map'}
      );
      const mo = {lat: 42.348723, lng: -71.081789};
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: mo,
        mapTypeControl: false

      });
      map.mapTypes.set('styled_map', styledMapType);
      map.setMapTypeId('styled_map');

      const contentString = `
        <div><h1 style="font-weight:700">Mandarin Oriental, Boston</h1>776 Boylston Street, Boston, MA 02199</div>`;

      const infowindow = new google.maps.InfoWindow({
          content: contentString
        });

      const image = '../img/map-marker.png';

      const marker = new google.maps.Marker({
        position: mo,
        animation: google.maps.Animation.DROP,
        map: map,
        icon: image
      });

      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });

      google.maps.event.addListener(map, 'idle', function () {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      });

    }, 200);
  }

  // stop propagate click event to the parent
  clickAction() {
     this.mapCanvas.addEventListener('click', (evt) => {
       evt.stopPropagation();
     })
  }
};

export let gmap = new GMap;