
// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd

function pseudoRandom(x, y) {
    return ( ( Math.sin( x * 12.9898 + y * 78.233) ) * 43758.5453123 ) % 1;
}

function noise(x, y) {

    var ix = Math.floor(x);
    var iy = Math.floor(y);

    // Four corners in 2D of a tile
    var a = pseudoRandom(ix,iy);
    var b = pseudoRandom(ix+1, iy);
    var c = pseudoRandom(ix, iy+1);
    var d = pseudoRandom(ix+1, iy+1);

    var fx = (x % 1);
    var fy = (y % 1);
    var ux = fx * fx * (3.0 - 2.0 * fx);
    var uy = fy * fy * (3.0 - 2.0 * fy);

    return (a * (1-ux) + b * ux) + (c - a)* uy * (1.0 - ux) + (d - b) * ux * uy;

}

function FBM( x, y ){
    var OCTAVES = 6;
    var value = 0;
    var amplitude = .5;
    for (var i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(x,y);
        x *= 2.;
        y *= 2.;
        amplitude *= .5;
    }
    return value;
}

function reset() {

    var cellSize = 10;
    var i, j, value;
    for (i = 0; i <= w; i += cellSize) {
        for (j = 0; j <= h; j += cellSize) {

            value = Math.random();
            if( j > h / 4 ){
                value = pseudoRandom( i, j );
            }
            if( j > h / 2 ){
                value = .5 * ( noise( i * .02, j * .02 ) + 1 );
            }
            if( j > h * .75 ){
                value = .5 * ( FBM( i * .02, j * .02 ) + 1 );
            }

            var c = parseInt( value * 0xFF );
            ctx.fillStyle = 'rgb('+c+','+c+','+c+')';
            ctx.fillRect( i,j,cellSize, cellSize);

        }
    }
}


//creates a 2D context
var canvas, w, h, ctx;
canvas = document.createElement( 'canvas' );
document.body.appendChild( canvas );
w = canvas.width = window.innerWidth ;
h = canvas.height = window.innerHeight ;
ctx = canvas.getContext("2d");
reset();
