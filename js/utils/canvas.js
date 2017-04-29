
var canvas = document.createElement( 'canvas' );
document.body.appendChild( canvas );
var w = canvas.width = window.innerWidth ;
var h = canvas.height = window.innerHeight ;
var ctx = canvas.getContext("2d");

function getContext( w, h ){
    var canvas = document.createElement( 'canvas' );
    canvas.width = w || window.innerWidth;
    canvas.height = h || window.innerHeight;
    return canvas.getContext("2d");
}