
function translate( p, dx, dy ){

    p.x += dx;
    p.y += dy;
    return p;

}

function reset(){

    ctx.clearRect( 0,0,w,h );

    var count  = 1024;
    var golden_angle = Math.PI * ( 3 - Math.sqrt(5) );
    for( var i = 0; i < count; i++ ) {

        //spiral
        var theta = i * golden_angle;
        var radius = Math.sqrt(i / count) * h / 3;

        //spiral point around 0, 0
        var spiralPoint = new Point(
            Math.cos(theta) * radius,
            Math.sin(theta) * radius
        );

        //translate this point by half the screen size
        var p = translate( spiralPoint, w/2, h/2 );

        //draw the translated point
        circle( p.x, p.y, 3 );

    }
}


//creates a 2D context
var canvas, w, h, ctx;
window.onload = function(){
    canvas = document.createElement( 'canvas' );
    document.body.appendChild( canvas );
    w = canvas.width = window.innerWidth ;
    h = canvas.height = window.innerHeight ;
    ctx = canvas.getContext("2d");
    reset();
};
function circle( x,y,r ){
    ctx.beginPath();
    ctx.arc( x, y, r, 0, Math.PI * 2 );
    ctx.stroke();
}