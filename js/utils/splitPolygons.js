function splitPolygons( points, edges, newPolygons ){

    newPolygons = newPolygons || [];

    var edge = edges.shift();
    var start = points[ edge[0] ];
    start.visited = true;

    var poly = [start.edge ];
    var max = 0;
    var valid = true;
    while( start != null && max++ < 100 ){

        if( start.next == null ){
            valid = false;
            break;
        }

        if( start.next.visited == false ){
            start.next.visited = true;
            start = start.next;
            poly.push( start.edge );
        }
    }

    if( valid )newPolygons.push( poly );

    var remainingEdges = [];
    edges.forEach(function( e, edgeId ){
        if( poly.lastIndexOf(e) == -1 ){
            remainingEdges.push( e );
        }
    });

    if( remainingEdges.length > 0 ){
        return splitPolygons( points, remainingEdges, newPolygons );
    }

    var polygons = [];
    newPolygons.forEach( function( poly ){

        var tmpPoints = [];
        poly.forEach( function( edge ){
            if( tmpPoints.indexOf( points[ edge[0] ] ) == -1 )tmpPoints.push( points[ edge[0] ]);
            if( tmpPoints.indexOf( points[ edge[1] ] ) == -1 )tmpPoints.push( points[ edge[1] ]);
        } );

        var tmpEdges = [];
        tmpPoints.forEach(function (p, i) {tmpEdges.push( [i, (i+1)%tmpPoints.length ]);});
        polygons.push( new Polygon( tmpPoints, tmpEdges ) );

    });
    return polygons;

}