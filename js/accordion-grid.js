$.fn.accordionGrid = function(){

  var brands = this;
  var viewportWidth = $(window).width();
  var cols = 3;
  var blockSize = 290;
  if ((viewportWidth >= 768) && (viewportWidth <= 990)) {
    cols = 2;
  }else if(viewportWidth < 768){
    cols = 1;
    blockSize = 260;
  }

  //set the height of the grid container (to push down the 
  // element below it)
  var rows = Math.ceil(brands.find('.brand').length / cols);
  brands.css({
    'height': rows * blockSize,
    'width': cols * blockSize
  });

    setGrid();  

  $(window).on('resize orientationchange', function(){
    viewportWidth = $(window).width();
    cols = 3;
    if((viewportWidth >= 768) && (viewportWidth <= 990)){
      cols = 2;
    }else if(viewportWidth < 768){
      cols = 1;
      blockSize = 260;
    }
    rows = Math.ceil(brands.find('.brand').length / cols);
    brands.css({
      'height': rows * blockSize,
      'width': cols * blockSize
    });

      setGrid();
  });

  brands.find('.brand').hover(function(){
    var brandBlock = $(this);
    var index = $(brandBlock).data('brand_index');
    //var col = index % cols;
    var col_number = $(brandBlock).data('col');
    var row_number = $(brandBlock).data('row');
    var leftPos = (cols == 3) ? col_number * (blockSize / 2) : 0;
    var largeImage = $(brandBlock).data('large_image');

    $(brandBlock).css('z-index', '99');
    if(typeof largeImage !== 'undefined' || largeImage){
      $(brandBlock).css('background-image', 'url(' + largeImage + ')');
    }
    $(brandBlock).find('.caption').addClass('right-arrow');
    $(brandBlock).clearQueue();
    $(brandBlock).stop();

    if(cols > 1){
      $(brandBlock).animate({
        height: blockSize * 2,
        width: blockSize * 2,
        top: Math.max(0, (row_number * blockSize) - blockSize),
        left: leftPos
      });
    }

    if(cols == 3){
      squishOtherBlocks(col_number, row_number);
    }

  }, function(){
    setGrid();
  });

  function setGrid(){
    brands.find('.brand').each(function(index){
      var brandBlock = $(this);
      var row = Math.floor(index / cols);
      var col = index % cols;
      var leftPos = col * blockSize;
      var topPos = row * blockSize;

      $(brandBlock).attr('data-brand_index', index);
      $(brandBlock).attr('data-col', col);
      $(brandBlock).attr('data-row', row);
      var smallImage = $(brandBlock).data('small_image');

      $(brandBlock).removeClass('big-caption');
      if(cols > 1){
        $(brandBlock).find('.caption').removeClass('right-arrow');
      }

      $(brandBlock).clearQueue();
      $(brandBlock).stop(); 
      $(brandBlock).animate({
        width: blockSize,
        height: blockSize,
        top: topPos,
        left: leftPos
      }, 400, function(){
        $(brandBlock).css('z-index', '0');
        $(brandBlock).css('background-image', 'url(' + smallImage + ')');
      });
    });
  }
  function squishOtherBlocks(col_number, row_number){
    $('.brand').addClass('big-caption');
    //if()
    var other_row = row_number - 1;
    if(row_number == 0){
      other_row = row_number + 1;
    }
    /*
    for(var i=0; i<cols; i++){
      if(i !== col_number){
        //var leftPos = (i * blockSize) + (blockSize / i);
        var leftPos = (col_number-3+i * blockSize) + (blockSize / i);

        $('[data-col=' + i + '][data-row=' + row_number + '], [data-col=' + i + '][data-row=' + other_row + ']').animate({
          'width':blockSize / 2,
          'left': leftPos
        });
        console.log(leftPos);
      }
    }*/
    
    switch(col_number){
      case 0:
        $('[data-col=1][data-row=' + row_number + '], [data-col=1][data-row=' + other_row + ']').animate({
          'width': blockSize / 2,
          'left': (1 * blockSize) + (blockSize)
        });
        $('[data-col=2][data-row=' + row_number + '], [data-col=2][data-row=' + other_row + ']').animate({
          'width': blockSize / 2,
          'left': (2 * blockSize) + (blockSize / 2)
        });
      break;
      case 1:
        $('[data-col=0][data-row=' + row_number + '], [data-col=0][data-row=' + other_row + ']').animate({
          'width': blockSize / 2
        });
        $('[data-col=2][data-row=' + row_number + '], [data-col=2][data-row=' + other_row + ']').animate({
          'width': blockSize / 2,
          'left': (2 * blockSize) + (blockSize / 2)
        });
      break;
      case 2:
        $('[data-col=0][data-row=' + row_number + '], [data-col=0][data-row=' + other_row + ']').animate({
          'width': blockSize / 2
        });
        $('[data-col=1][data-row=' + row_number + '], [data-col=1][data-row=' + other_row + ']').animate({
          'width': blockSize / 2,
          'left': blockSize / 2
        });
      break;
    }
  }
}
/*
$(window).load(function(){
  setTimeout(removeLoader, 300);
  function removeLoader(){
    $('.loader').fadeOut();
  }
});*/

//this one will show for minimum of 300ms or keep waiting
// until page loads
var loader = (function(window, $loadingScreen){
  var elapsed = false;
  var loaded = false;

  setTimeout(function(){
    elapsed = true;
    if(loaded){
      removeLoader();
    }
  }, 300);

  var removeLoader = function(){
    $('.loader').fadeOut();
  }

  $(window).on('load', function(){
    if(elapsed){
      removeLoader();
    }
  });
}(window, $('.loader')));

jQuery(document).ready(function($){

  $('.brands').accordionGrid();

  $('a.arrow').on('click', function(e){
    var self = $(this);
    var direction = $(this).data('direction');
    e.preventDefault();
    $('body').addClass('trans-' + direction);
    setTimeout(function(){
      document.location = $(self).attr('href');
    }, 750);
  });

  $('.acf-map').each(function () {
    map = new_map($(this));
  });
  
});

/*
*  new_map
*
*  This function will render a Google Map onto the selected jQuery element
*
*  @type	function
*  @date	8/11/2013
*  @since	4.3.0
*
*  @param	$el (jQuery element)
*  @return	n/a
*/
function new_map($el) {
  // var
  var $markers = $el.find('.marker');
  // vars
  var args = {
    zoom: 16,
    center: new google.maps.LatLng(0, 0),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  // create map	        	
  var map = new google.maps.Map($el[0], args);

  // add a markers reference
  map.markers = [];
  // add markers
  $markers.each(function () {
    add_marker($(this), map);
  });

  // center map
  center_map(map);

  // return
  return map;
}

/*
*  add_marker
*
*  This function will add a marker to the selected Google Map
*
*  @type	function
*  @date	8/11/2013
*  @since	4.3.0
*
*  @param	$marker (jQuery element)
*  @param	map (Google Map object)
*  @return	n/a
*/
function add_marker($marker, map) {
  // var
  var latlng = new google.maps.LatLng($marker.attr('data-lat'), $marker.attr('data-lng'));

  // create marker
  var marker = new google.maps.Marker({
    position: latlng,
    map: map
  });

  // add to array
  map.markers.push(marker);

  // if marker contains HTML, add it to an infoWindow
  if ($marker.html()) {
    // create info window
    var infowindow = new google.maps.InfoWindow({
      content: $marker.html(),
      //pixelOffset: new google.maps.Size(-200, 150)
    });

    // show info window when marker is clicked
    google.maps.event.addListener(marker, 'click', function () {
      infowindow.open(map, marker);
    });
    infowindow.open(map,marker);
  }
}

/*
*  center_map
*
*  This function will center the map, showing all markers attached to this map
*
*  @type	function
*  @date	8/11/2013
*  @since	4.3.0
*
*  @param	map (Google Map object)
*  @return	n/a
*/
function center_map(map) {
  // vars
  var bounds = new google.maps.LatLngBounds();

  // loop through all markers and create bounds
  $.each(map.markers, function (i, marker) {
    var latlng = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
    bounds.extend(latlng);
  });

  // only 1 marker?
  if (map.markers.length == 1) {
    // set center of map
    map.setCenter(bounds.getCenter());
    map.setZoom(16);
  }
  else {
    // fit to bounds
    map.fitBounds(bounds);
  }

}

/*
*  document ready
*
*  This function will render each map when the document is ready (page has loaded)
*
*  @type	function
*  @date	8/11/2013
*  @since	5.0.0
*
*  @param	n/a
*  @return	n/a
*/
// global var
var map = null;