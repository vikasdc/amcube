var map;
var myLatLng = {lat: 17.4562961, lng: 78.3682928};
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: 17,
    
  });
  var marker = new google.maps.Marker({
position: myLatLng,
map: map,
draggable:true,
icon:'../assets/img/placeholder.png',
animation:google.maps.Animation.DROP,
title: 'Amcubes, 91 Springboard, Mytri Square, 2-41/11, 6/2, Gachibowli - Miyapur Rd, Prashanth Nagar Colony, Hyderabad, Telangana 500084'});
marker.setMap(map);
var infowindow = new google.maps.InfoWindow({
  content:"<h6 class='mx-2 text-primary font-weight-light'>Amcubes, 91 Springboard, Mytri Square, 2-41/11, 6/2, Gachibowli - Miyapur Rd, Prashanth Nagar Colony, Hyderabad, Telangana 500084</h6>"
});
infowindow.open(map, marker); 
marker.addListener('mouseover',function(){
infowindow.open(map, marker);      
})
marker.addListener('mouseout',function(){
infowindow.close();
})

}