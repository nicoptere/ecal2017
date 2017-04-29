

function lineIntersection( p1, p2, p3, p4 ) {
    // Get the segments' parameters.
    var dx12 = Math.round( p2.x - p1.x );
    var dy12 = Math.round( p2.y - p1.y );
    var dx34 = Math.round( p4.x - p3.x );
    var dy34 = Math.round( p4.y - p3.y );
    var denominator = (dy12 * dx34 - dx12 * dy34);
    var t1 = ((p1.x - p3.x) * dy34 + (p3.y - p1.y) * dx34) / denominator;
    if ( t1 == Number.POSITIVE_INFINITY || t1 == Number.NEGATIVE_INFINITY ) {
        return null;
    }
    return new Point(p1.x + dx12 * t1, p1.y + dy12 * t1);
}


function lineIntersectLines( p1, p2, lines ){

    var tmp = [];
    // console.log ("", p1.x, p1.y, p2.x, p2.y)
    lines.forEach( function( line, i ){

        var ip = lineSegmentIntersection(p1, p2, line[0], line[1] );
        if( ip ){
            // console.log ("\t", ip.x, ip.y);
            tmp.push(ip);//, i]);
        }
    });
    tmp.sort( function( a,b ){
        return distance( a, p1 ) - distance( b, p1 );
    } );

    return tmp;
}

function lineSegmentIntersection(r0, r1, a, b)
{
    var s1, s2;
    s1 = r1.clone().sub( r0 );
    s2 = b.clone().sub( a );

    var s, t;
    s = (-s1.y * (r0.x - a.x) + s1.x * (r0.y - a.y)) / (-s2.x * s1.y + s1.x * s2.y);
    t = (s2.x * (r0.y - a.y) - s2.y * (r0.x - a.x)) / (-s2.x * s1.y + s1.x * s2.y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1){
        // Collision detected
        // Return the point of intersection
        return new Point(r0.x + (t * s1.x), r0.y + (t * s1.y));
    }

    return false; // No collision
}