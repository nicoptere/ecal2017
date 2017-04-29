/**
 * Created by nico on 07/03/14.
 */
var PI = Math.PI,
	PI2 = PI * 2,
	RAD = Math.PI / 180,
	DEG = 180 / Math.PI,
	raf =   window.requestAnimationFrame		||
			window.webkitRequestAnimationFrame 	||
			window.mozRequestAnimationFrame 	||
			window.msRequestAnimationFrame 		||
			window.oRequestAnimationFrame 		||
			function(func) { setTimeout( func, 1000 / 60 );},
	EPSILON = 10e-6
	;

Array.max = function( array ){
    return Math.max.apply( Math, array );
};

Array.min = function( array ){
    return Math.min.apply( Math, array );
};

var Utils = function(){};


Utils.lerp = function( t, a, b ){ return a + t * ( b - a ); };
Utils.norm = function( t, a, b ){ return ( t - a ) / ( b - a ); };
Utils.map = function( t, a0, b0, a1, b1 ){ return Utils.lerp( Utils.norm( t, a0, b0 ), a1, b1 ); };

Utils.rotate = function( p, lattice, angle ){var a = Point.angle( lattice, p ) + angle;var d = Point.distance( lattice, p );var pp = new Point();pp.x = lattice.x + Math.cos( a ) * d;pp.y = lattice.y + Math.sin( a ) * d;return pp;}
Utils.reflect = function(p,a,b){var pp = Utils.project( p, a, b, false );return new Point( p.x + ( pp.x - p.x ) * 2,p.y + ( pp.y - p.y ) * 2  );}
Utils.glide = function(p,a,b,distance){var t = Utils.reflect( p, a, b );var angle = Point.angle( a, b );return Point.translate( t, cos( angle ) * Point.distance, sin( angle ) * distance );}
Utils.project = function( p, a, b, asSegment ){var dx = b.x - a.x;var dy = b.y - a.y;if ( asSegment && dx == 0 && dy == 0 ){return a;}var t = ( ( p.x - a.x ) * dx + ( p.y - a.y ) * dy) / ( dx * dx + dy * dy );if ( asSegment && t < 0) return a;if ( asSegment && t > 1) return b;return new Point( a.x + t * dx, a.y + t * dy );}

Utils.convexHull = function( points )
{
    if( points.length <= 3 ) return points;
    points.sort( function( a,b ){return a.x - b.x;} );
    var angle = Math.PI / 2;
    var Point = points[ 0 ];
    var hull = [];
    var max = points.length * 2;
    while ( Point != hull[ 0 ] && max > 0  )
    {
        hull.push( Point );
        var bestAngle = 0xFFFFFF;
        var bestIndex = 0;
        for ( var i = 0; i < points.length; i++ )
        {
            var testPoint = points[i];
            if (testPoint == Point){continue;}
            var dx = testPoint.x - Point.x;
            var dy = testPoint.y - Point.y;
            var testAngle = Math.atan2(dy,dx);
            testAngle -= angle;
            while (testAngle < 0)testAngle += Math.PI * 2;
            if ( testAngle < bestAngle ){bestAngle = testAngle;bestIndex = i;}
        }
        Point = points[bestIndex];angle += bestAngle;
        max--;

    }
    return hull;
}

Utils.polarToCartesian = function( angle, distance, origin, out )
{
	out = out || new Point();
	out.x = Math.cos( angle ) * distance;
	out.y = Math.sin( angle ) * distance;

	if( origin != null )
	{
		out.add( origin );
	}
	return out;
}

Utils.cartesianToPolar = function( point, origin, out )
{
	//arguments passed : point, ?origin, ?out
	if( x.x != null )
	{
		return this.cartesianToPolar( x.x, x.y, origin, out );
	}

	out = out || new Polar();
	if( origin == null )
	{
		out.angle = Math.atan2( point.y, point.x );
		out.distance = Math.sqrt( point.x * point.x + point.y * point.y );
	}
	else
	{
		var dx = origin.x - point.x;
		var dy = origin.y - point.y;
		out.angle = Math.atan2( dy, dx );
		out.distance = Math.sqrt( dx * dx + dy * dy );
	}
	return out;
}

Utils.midpoint = function ( p0, p1 ){return new Point( p0.x + ( p1.x - p0.x ) / 2, p0.y + ( p1.y - p0.y ) / 2 );}
Utils.determinant = function( p, a, b ){return ( ( a.x - b.x ) * ( p.y - b.y ) ) - ( ( p.x - b.x ) * ( a.y - b.y ) );}
Utils.isLeft = function( p, a, b ){return Utils.determinant( p, a, b ) > 0;}
Utils.isRight = function( p, a, b ){return determinant( p, a, b ) <= 0;}
Utils.normalizeVector = function( p ){return new Point( p.x / p.length, p.y / p.length );}
Utils.dotProduct = function( u, v ){return ( u.x * v.x + u.y * v.y );}
Utils.crossProduct = function( u, v ){return ( u.x * v.y - u.y * v.x );}
Utils.normal = function( p0, p1 ){return new Point( -( p1.y - p0.y ), ( p1.x - p0.x ) );}
Utils.leftNormal = function( p0, p1 ){return new Point( p0.x + ( p1.y - p0.y ), p0.y - ( p1.x - p0.x ) );}
Utils.rightNormal = function( p0, p1 ){return new Point( p0.x - ( p1.y - p0.y ), p0.y + ( p1.x - p0.x ) );}
Utils.removeDuplicatePoints = function( pts )
{
    var i,j,exists,tmp = [];
    for( i =0; i < pts.length; i++ ){ exists = false;for( j = (i+1); j < pts.length; j++ ){
            if( pts[i].x == pts[ j ].x && pts[i].y == pts[ j ].y )
            {
                exists = true;
                break;
            }
        }
        if( !exists ) tmp.push( pts[ j ] );
    }
    return tmp;
}
Utils.projectOnCircle = function ( p, c, r )
{
    var a = Point.angle( p,c );
    p.x = c.x + Math.cos( a ) * r;
    p.y = c.y + Math.sin( a ) * r;
    return p;
}
Utils.getClosestPointInList = function(p,list)
{
	if(list.length <= 0) return null;
	if(list.length == 1) return list[0];
	var dist;
	var min = 10e6;
	var closest = null;
	var item;
	var _g = 0;
	while(_g < list.length) {
		var item1 = list[_g];
		++_g;

		if(item1 == p) continue;

		if( Point.equals( p, item1 ) ) return item1;

		dist = Point.squareDistance( p,item1 );
		if(dist < min) {
			min = dist;
			closest = item1;
		}
	}
	return closest;
}

Utils.lerpPoint = function( t, p0, p1, out )
{
	out = out || new Point();
    out.x = Utils.lerp( t, p0.x, p1.x );
    out.y = Utils.lerp( t, p0.y, p1.y );
    return out;
}
Utils.mapPointToRect = function( p, r0, r1 )
{
    var tp = new Point();
    tp.x = Utils.map( p.x, r0.x, r0.x + r0.width, r1.x, r1.x + r1.width );
    tp.y = Utils.map( p.y, r0.y, r0.y + r0.height, r1.y, r1.y + r1.height );
    return tp;
}
Utils.delaunay = function()
{
    this.EPSILON = 0.00001;
    this.SUPER_TRIANGLE_RADIUS = 1000000;
    var indices;
    var circles;
    this.compute = function( points )
    {
        points.sort( function( a, b ){ a.x < b.x ? -1 : 1;} );
        with( this )
        {
            indices = [];
            circles = [];

            var nv = points.length;
            if (nv < 3) return null;

            var d = SUPER_TRIANGLE_RADIUS;
            points.push( 	new Point( 0, -d ) 	);
            points.push( 	new Point( d, d ) 	);
            points.push( 	new Point( -d, d )	);

            indices = [];
            indices.push( points.length - 3 );
            indices.push( points.length - 2 );
            indices.push( points.length - 1 );

            this.circles = [];
            this.circles.push( 0 );
            this.circles.push( 0 );
            this.circles.push( d );

            var edgeIds = [];
            var i, j, k, id0, id1, id2;
            for ( i = 0; i < nv; i++ )
            {

                j = 0;
                while( j < indices.length )
                {
                    if ( 	circles[ j + 2 ] > EPSILON 		&& 		circleContains( j, points[ i ] )	)
                    {
                        id0 = indices[ j ];
                        id1 = indices[ j + 1 ];
                        id2 = indices[ j + 2 ];

                        edgeIds.push( id0 );
                        edgeIds.push( id1 );
                        edgeIds.push( id1 );
                        edgeIds.push( id2 );
                        edgeIds.push( id2 );
                        edgeIds.push( id0 );

                        indices.splice( j, 3 );
                        circles.splice( j, 3 );
                        j -= 3;
                    }
                    j += 3;
                }

                j = 0;
                while ( j < edgeIds.length )
                {
                    k = ( j + 2 );
                    while ( k < edgeIds.length )
                    {
                        if(	(	edgeIds[ j ] == edgeIds[ k ] && edgeIds[ j + 1 ] == edgeIds[ k + 1 ]	)
                            ||	(	edgeIds[ j + 1 ] == edgeIds[ k ] && edgeIds[ j ] == edgeIds[ k + 1 ]	)	)
                        {
                            edgeIds.splice( k, 2 );
                            edgeIds.splice( j, 2 );
                            j -= 2;
                            k -= 2;
                            if ( j < 0 || j > edgeIds.length - 1 ) break;
                            if ( k < 0 || k > edgeIds.length - 1 ) break;
                        }
                        k += 2;
                    }
                    j += 2;
                }
                j = 0;
                while( j < edgeIds.length )
                {
                    indices.push( edgeIds[ j ] );
                    indices.push( edgeIds[ j + 1 ] );
                    indices.push( i );
                    computeCircle( points, edgeIds[ j ], edgeIds[ j + 1 ], i );
                    j += 2;
                }
                edgeIds = [];

            }
            id0 = points.length - 3;
            id1 = points.length - 2;
            id2 = points.length - 1;

            i = 0;
            while( i < indices.length )
            {
                if ( indices[ i ] == id0 || indices[ i ] == id1 || indices[ i ] == id2
                    ||	 indices[ i + 1 ] == id0 || indices[ i + 1 ] == id1 || indices[ i + 1 ] == id2
                    ||	 indices[ i + 2 ] == id0 || indices[ i + 2 ] == id1 || indices[ i + 2 ] == id2 )
                {
                    indices.splice( i, 3 );
                    circles.splice( i, 3 );
                    if( i > 0 ) i-=3;
                    continue;
                }
                i += 3;
            }

            points.pop();
            points.pop();
            points.pop();
            return indices;
        }
    }

    this.circleContains = function( circleId, p )
    {
        var dx = this.circles[ circleId ] - p.x;
        var dy = this.circles[ circleId + 1 ] - p.y;
        return this.circles[ circleId + 2 ] > dx * dx + dy * dy;
    }

    this.computeCircle = function( points, id0, id1, id2 )
    {
        var p0 = points[ id0 ];
        var p1 = points[ id1 ];
        var p2 = points[ id2 ];
        var A = p1.x - p0.x;
        var B = p1.y - p0.y;
        var C = p2.x - p0.x;
        var D = p2.y - p0.y;
        var E = A * (p0.x + p1.x) + B * (p0.y + p1.y);
        var F = C * (p0.x + p2.x) + D * (p0.y + p2.y);
        var G = 2.0 * (A * (p2.y - p1.y) - B * (p2.x - p1.x));

        var x = (D * E - B * F) / G;
        this.circles.push( x );

        var y = (A * F - C * E) / G;
        this.circles.push( y );

        x -= p0.x;
        y -= p0.y;
        this.circles.push( x * x + y * y );
    }

    this.draw = function( ctx, points, indices, t )
    {
        //with( this )
        //{
        //return;
        //indices = indices || this.compute( points );
        if( indices == undefined ) return;
        t = t || 1;
	    if( t <= 0.01 )return;

        var i = 0, id0, id1, id2;
        while ( i < ( indices.length * t )  )
        {

            id0 = indices[ i ];
            id1 = indices[ i + 1 ];
            id2 = indices[ i + 2 ];

	        var r = parseInt(Math.random() * 128 + 128);
            var g = parseInt(Math.random() * 128 + 128);
            var b = parseInt(Math.random() * 128 + 128);
            ctx.strokeStyle = "rgba( " + r + ", " + g + ", " + b + ", 1 )";

            ctx.beginPath();
            ctx.moveTo( points[ id0 ].x, points[ id0 ].y );
            ctx.lineTo( points[ id1 ].x, points[ id1 ].y );
            ctx.lineTo( points[ id2 ].x, points[ id2 ].y );
            ctx.lineTo( points[ id0 ].x, points[ id0 ].y );


            ctx.stroke();
            ctx.closePath();

            /*
             var cx = points[ id0 ].x + points[ id1 ].x + points[ id2 ].x;
             var cy = points[ id0 ].y + points[ id1 ].y + points[ id2 ].y;

             ctx.beginPath();
             ctx.arc( cx / 3, cy / 3, .5, 0, Math.PI * 2, true );
             ctx.stroke();
             ctx.closePath();
             //*/

            i += 3;

        }
        //}
    }
}

Utils.ip = new Point();
Utils.lineIntersectLine = function(	A, B,
									E, F,
									ABasSeg, EFasSeg )
{
	if( ABasSeg == null ) ABasSeg = true;
	if( EFasSeg == null ) EFasSeg = true;

	var a1, a2, b1, b2, c1, c2;
	a1= B.y-A.y;
	b1= A.x-B.x;
	a2= F.y-E.y;
	b2= E.x-F.x;
	var denom=a1*b2 - a2*b1;


	if (denom == 0)
	{
		return null;
	}

	c1 = B.x * A.y - A.x * B.y;
	c2 = F.x * E.y - E.x * F.y;

	Utils.ip.x=(b1*c2 - b2*c1)/denom;
	Utils.ip.y=(a2*c1 - a1*c2)/denom;

	if ( A.x == B.x )
		Utils.ip.x = A.x;
	else if ( E.x == F.x )
		Utils.ip.x = E.x;
	if ( A.y == B.y )
		Utils.ip.y = A.y;
	else if ( E.y == F.y )
		Utils.ip.y = E.y;

	return Utils.ip;
}