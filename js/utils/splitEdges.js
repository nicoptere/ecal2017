
function splitEdges( polygon, hasSplit ) {

    var points = polygon.points;
    var edges = polygon.edges;

    var count = edges.length;
    if( count <= 3 )return [polygon];

    var newEdges = [];

    for (var i = 0; i < count; i++) {

        var i0 = edges[ i ][0];
        var i1 = edges[ i ][1];

        var p0 = points[i0];
        var p1 = points[i1];

        if( p0 == undefined || p1 == undefined )continue;
        for (var j = 0; j < count; j++) {

            if( i == j )continue;

            var i2 = edges[ j ][0];
            var i3 = edges[ j ][1];

            var p2 = points[i2];
            var p3 = points[i3];

            //if there is an intersection we have to recomputes the Planar Straight Line Graph (PSLG)
            // the PSLG is a graph with no intersections
            var ip = SegmentIntersection( p0, p1, p2, p3 );
            if( ip ){

                ip.isIntersect = true;

                var id = points.length;
                newEdges.push( [ i, [ i0,id ], [id, i1] ] );
                newEdges.push( [ j, [ i2,id ], [id, i3] ] );
                points.push( ip );

                var tmpEdges = [];
                for( var k = 0; k < count; k++ ){

                    //if this edges was not marked for deletion
                    if( k == i || k == j ){

                        //this edge must be replaced by the 2 new edges
                        newEdges.forEach( function( newEdge ){

                            //find the 2 new edges by their index
                            if( newEdge[0] == k ){
                                tmpEdges.push( newEdge[1], newEdge[2] );
                            }

                        });
                    }else{
                        //otherwise keep it
                        tmpEdges.push( edges[k] );
                    }
                }
                //bail out and process the new edges
                polygon.points = points;
                polygon.edges = tmpEdges;
                return splitEdges( polygon, true );
            }
        }
    }

    //there was an edge split, we need to rebuild some polygons
    if( Boolean( hasSplit ) === true ) {

        var invalid = [];
        points.forEach(function (p, i) {

            //create an array of the edges connected to the points
            p.connexions = [];
            edges.forEach(function (e, edgeId) {

                //stores the ID of other endpoint of the edge and the edge
                if (e[0] == i) p.connexions.push([e[1], e]);
                if (e[1] == i) p.connexions.push([e[0], e]);

            });

            //marks a point for deletion
            if (!p.isIntersect) {

                //this point is linked to exactly 2 intersection points
                if (p.connexions.length == 2
                    && points[p.connexions[0][0]].isIntersect
                    && points[p.connexions[1][0]].isIntersect) {


                    //this is part of the solution
                    var p0 = points[p.connexions[0][0]];
                    var p1 = points[p.connexions[1][0]];

                    var center = p0.clone().add( p1 ).multiplyScalar( .5 );

                    appendToSolution( center, p.origin );
                    appendToSolution( center, p0 );
                    appendToSolution( center, p1 );

//                        ctx.strokeStyle = "#000";
//                        ctx.beginPath();
//                        ctx.moveTo( center.x, center.y );
//                        ctx.lineTo( p.origin.x, p.origin.y );
//
//                        ctx.moveTo( center.x, center.y );
//                        ctx.lineTo( p0.x, p0.y );
//
//                        ctx.moveTo( center.x, center.y );
//                        ctx.lineTo( p1.x, p1.y );
//                        ctx.stroke();

                    //stores the invalid edges ids
                    invalid.push(p.connexions[0][1], p.connexions[1][1]);

                }

            } else {

                //removes the edge connecting 2 intersection points
                p.connexions.forEach(function (co) {
                    if (points[co[0]].isIntersect) {
                        invalid.push(co[1]);
                    }
                });
            }
        });

        //rebuilds graph with the new points and edges
        newEdges = [];
        edges.forEach(function (e, i) {
            if (invalid.indexOf(e) == -1) {
                newEdges.push(e);
            }
        });

        //rebuilds points connexity list
        points.forEach(function (p, i) {
            p.visited = false;
            newEdges.forEach(function (e) {
                if (e[0] == i ) {
                    p.next = points[e[1]];
                    p.edge = e;
                }
            });
        });

        return splitPolygons( points, newEdges );
    }

    //no need to subdivide this polygon
    return [ polygon ];

}
