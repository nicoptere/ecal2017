
//radians
var RAD = Math.PI / 180;

function reset() {

    //stores some vairables
    var points = [];
    var angles = [];
    var speeds = [];
    for( var i = 0; i < 20; i++ ){

        //point position
        points.push( [w/2, h/2] );
        //starting angle
        angles.push( Math.random() * Math.PI * 2 );
        //rotation speed
        speeds.push( 5 + Math.random() * 25 );

    }

    ctx.clearRect(0,0,w,h);
    ctx.beginPath();
    for( i = 0; i < 2000; i++ ){

        //iterate over points
        points.forEach( function( p, id ){

            //move to current position
            ctx.moveTo( p[0], p[1] );

            //updates angle
            angles[id] += ( Math.random() - .5 ) * RAD * speeds[id];

            //updates poistion
            p[0] += Math.sin( angles[id] );
            p[1] += Math.cos( angles[id] );

            //draws line to new position
            ctx.lineTo( p[0], p[1] );

        });
    }
    ctx.stroke();
}

//utils
//creates a 2D context

window.addEventListener("message", receiveMessage, false);
function receiveMessage(event) {
    if( event.data == "slide:start" ){
        window.addEventListener("mousedown", reset, false);
        reset();
    }
    if( event.data == "slide:stop" ){
        window.removeEventListener("mousedown", reset, false);
        ctx.clearRect( 0,0,w,h );
    }
}
var canvas, w, h, ctx;
window.onload = function(){
    canvas = document.createElement( 'canvas' );
    document.body.appendChild( canvas );
    w = canvas.width = window.innerWidth ;
    h = canvas.height = window.innerHeight ;
    ctx = canvas.getContext("2d");
    window.addEventListener("mousedown", reset, false);
    reset();
};
