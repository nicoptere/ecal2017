function nearestNeighbors( points, count, compareMethod ){

    count = count || 1;
    compareMethod = compareMethod || function( a,b ){
        var dx = a[0]-b[0];
        var dy = a[1]-b[1];
        return Math.sqrt(dx*dx + dy*dy);
    };

    var a, b, arr, dist, minDist;
    var tmp = [];

    for( var i = 0; i < points.length; i++ ){

        a = points[ i ];
        minDist = Number.POSITIVE_INFINITY;

        arr = [i,minDist];
        if( count != 1 ){
            arr = [];
        }

        for( var j = 0; j < points.length; j++ ){

            if( i == j )continue;

            b = points[ j ];

            dist = compareMethod( a,b );

            if( count == 1 ){
                if( dist < minDist ){
                    minDist = dist;
                    arr[0] = j;
                    arr[1] = dist;
                }
            }else{


                    arr.push( [ j, dist ] );
                if( arr.length == 0 ){

                // }else{
                //
                //     var highest = arr.reduce(function( it, val){
                //         return [0, Math.min( it[1], val[1] ) ];
                //     })[1];
                //     if( i == 0 )console.log( highest );
                //
                //     if( dist < highest && arr.length <= count ){
                //         arr.unshift([ j, dist ]);
                //     }else{
                //         arr.push([ j, dist ]);
                //     }
                //     arr.sort( function( a,b ){
                //         return a[1] - b[1];
                //     });
                }
            }
        }
        tmp.push(arr);
        console.log( arr.map(function(a){return a[0] + " " + a[1].toFixed( 0 ) + " "; }) )

    }
    return tmp;
}