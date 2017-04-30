function circle( x,y,r ){
    ctx.beginPath();
    ctx.arc( x, y, r, 0, Math.PI * 2 );
    ctx.stroke();
}
function reset(){

    //measures of an equalateral triangle
    var sides = 3;
    var L = 2 * Math.sin( Math.PI / sides ); //side length
    var A = L / ( 2 * Math.tan( Math.PI / sides ) ); //apothem
    var H = ( 1 + A ); //radius + apothem

    var size = 50;
    L *= size;
    H *= size;

    var mx = 2 * Math.ceil( w / L );
    var my = Math.ceil( h / H );

    for( var i = 0; i < w; i+= mx ){

        for( var j = 0; j <= h; j+= my ){

            //cell indices
            var cx = Math.round( i/mx );
            var cy = Math.round( j/my );

            //coordinates
            var x = ( cx ) * L/2;
            var y = ( cy ) * H;

            //triangular
            if(( Math.abs( cx ) % 2 == 1 && Math.abs( cy ) % 2 == 0 )
                || ( Math.abs( cx ) % 2 == 0 && Math.abs( cy ) % 2 == 1 ) ){

                circle( x, y, 5 );

                //hexagonal
                if( Math.abs( Math.abs( cx ) % 4 ) == 0
                    ||  Math.abs( Math.abs( cy ) % 2 ) == 0 ){
                    circle( x, y, 10 );
                }
            }else{
                circle( x, y, 1 );
            }
        }
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
