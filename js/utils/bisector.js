
function angle(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.atan2(dy, dx);
}
function determinant( p, a, b ){return ( ( a.x - b.x ) * ( p.y - b.y ) ) - ( ( p.x - b.x ) * ( a.y - b.y ) );}
function isLeft( p, a, b ){return determinant( p, a, b ) >= 0;}
function bisector( a,b,c, length ) {
    var ang = ( angle(a, b) + angle(a, c) ) * .5;
    var p = new Point(  a.x + Math.cos(ang) * length,
                        a.y + Math.sin(ang) * length );
    if( isLeft( p, b, c ) ){
        p = new Point(  a.x + Math.cos(ang) * -length,
            a.y + Math.sin(ang) * -length );
    }
    return p;
}