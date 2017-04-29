
function distance( a, b ){
    var dx = a[0]-b[0];
    var dy = a[1]-b[1];
    return Math.sqrt( dx*dx + dy*dy );
}

// Return points representing an enlarged polygon.
function offsetPolygon( polygon, offset, output ){
    var tmp = [];
    var points = polygon.points;
    var count = points.length;
    for(var j = 0; j < count; j++){

        // finds the previous, current and next point
        var i = (j - 1);
        if (i < 0) i += count;
        var k = (j + 1) % count;

        var pre = points[ i ];
        var cur = points[ j ];
        var nex = points[ k ];

        //create 2 lines, parallel to both edges at a given distance 'offset'

        //computes a normal vector to the direction of the: prev -> current edge of length offset
        var l1 = distance(cur, pre);
        var n1 = [
            -( ( cur[1] - pre[1] ) / l1 ) * offset,
             ( ( cur[0] - pre[0] ) / l1 ) * offset
        ];

        //does the same for the : current -> next edge
        var l2 = distance(cur, nex);
        var n2 = [
            -( ( nex[1] - cur[1] ) / l2 ) * offset,
             ( ( nex[0] - cur[0] ) / l2 ) * offset
        ];

        //and create 2 points at both ends of the edge to obtain a parallel line
        var p1 = [ pre[0]+n1[0], pre[1]+n1[1]];
        var p2 = [ cur[0]+n1[0], cur[1]+n1[1]];
        var p3 = [ cur[0]+n2[0], cur[1]+n2[1]];
        var p4 = [ nex[0]+n2[0], nex[1]+n2[1]];

        // console.log( p1, p2, p3, p4 );
        var ip = lineIntersection( p1, p2, p3, p4 );
        if( ip != null ) {
            tmp.push( ip );
        }

    }
    polygon.points = tmp;
    return tmp;
}

function lineIntersection( p1, p2, p3, p4 ){

    //then finds the intersection of the lines parallel to bothe edges
    var dx12 = ( p2[0] - p1[0] );
    var dy12 = ( p2[1] - p1[1] );
    var dx34 = ( p4[0] - p3[0] );
    var dy34 = ( p4[1] - p3[1] );

    var denominator = (dy12 * dx34 - dx12 * dy34);
    var t1 = ((p1[0] - p3[0]) * dy34 + (p3[1] - p1[1]) * dx34) / denominator;

    //invalid
    if ( t1 == Number.POSITIVE_INFINITY || t1 == Number.NEGATIVE_INFINITY ) {
        return null;
    }
    return [ p1[0] + dx12 * t1, p1[1] + dy12 * t1 ];
}

function project( p, a, b) {
    var dx = b[0] - a[0];
    var dy = b[1] - a[1];
    var t = ( ( p[0] - a[0] ) * dx + ( p[1] - a[1] ) * dy) / ( dx * dx + dy * dy );
    return [ a[0] + t * dx, a[1] + t * dy ];
}