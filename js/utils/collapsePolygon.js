
function collapse( polygon ) {

    var points = polygon.points;
    var count = points.length;

    if( count <= 3 ){
        var ip = LineIntersection( points[0].last, points[0], points[1].last, points[1] );
        points.forEach( function( p ) {
            appendToSolution( ip, p.origin );
        });
        return null;
    }

    //check if the polygon is still valid
    var valid = true;
    var edges = polygon.edges;
    for (var i = 0; i < edges.length; i++ ) {

        var i0 = edges[ i ][0];
        var i1 = edges[ i ][1];

        var cur = polygon.points[i0];
        var nex = polygon.points[i1];

        if( cur == undefined || nex == undefined ){
            console.log( "fuck", i0, i1, polygon.points.length );
            return null
        }

        //checks the before / after edge direction
        var d0 = cur.last.direction( nex.last );
        var d1 = cur.direction( nex );

        //if they're heading in opposite directions,
        // the edge was flipped during the last offset and must be deleted
        if( d0.dot( d1 ) < 0 ){
            valid = false;
//                break;
        }
    }

    if( !valid ){

        var tmp = [];
        for (var i = 0; i < edges.length; i++ ) {

            i0 = edges[ i ][0];
            i1 = edges[ i ][1];

            cur = polygon.points[i0];
            nex = polygon.points[i1];

            ip = SegmentIntersection( cur, cur.last, nex, nex.last );
            if( ip ){

                appendToSolution( ip, cur.origin );
                appendToSolution( ip, nex.origin );

                ip.last = new Point();
                ip.last.x = cur.x;
                ip.last.y = cur.y;
                tmp.push( ip );

            }else{
                tmp.push( cur );
            }

        }

        if( tmp.length <= 2 )return null;

        //rebuilds edges
        polygon.edges = [];
        tmp.forEach(function (p, i) {
            polygon.edges.push( [i, (i+1)%points.length ]);
        });
        polygon.points = tmp;


//            console.log( "new edges?", polygon.edges.length, polygon.edges, polygon.points )
        return polygon;

    }else{
        return polygon;
    }
}