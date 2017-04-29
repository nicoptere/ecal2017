/**
 * Created by nico on 03/11/13.
 */
var Triangulator = {};
Triangulator.EPSILON = 10e-5;

Triangulator.compute = function( contour, asIndices )
{

//	contour.push( contour[ 0 ] );
	asIndices = asIndices || false;
	var result = [];
	var n = contour.length;
	if ( n <3 ) return null;

	var verts = [];

	/* we want a counter-clockwise polygon in verts */
	var v;

	if ( 0.0 < Triangulator.area(contour) )
	{
		for (v=0; v<n; v++) verts[v] = v;
	}
	else
	{
		for(v=0; v<n; v++) verts[v] = (n-1)-v;
	}

	var nv = n;

	/*  remove nv-2 vertsertices, creating 1 triangle every time */
	var count = 2*nv;   /* error detection */
	var m;
	for( m=0, v=nv-1; nv>2; )
	{
		/* if we loop, it is probably a non-simple polygon */
		if (0>= (count--))
		{
			//** Triangulator: ERROR - probable bad polygon!
//			console.log("bad poly");
			return result;
		}
//		console.log( m, v, nv );
		/* three consecutive vertices in current polygon, <u,v,w> */
		var u = v; if (nv <= u) u = 0;     /* previous */
		v = u+1; if (nv <= v) v = 0;     /* new v    */
		var w = v+1; if (nv <= w) w = 0;     /* next     */

		if ( Triangulator.snip(contour,u,v,w,nv,verts))
		{
			var a,b,c,s,t;

			/* true names of the vertices */
			a = verts[u]; b = verts[v]; c = verts[w];

			/* output Triangle */
			if( asIndices )
			{
				result.push( a );
				result.push( b );
				result.push( c );
			}
			else
			{
				result.push( contour[a] );
				result.push( contour[b] );
				result.push( contour[c] );
			}

			m++;

			/* remove v from remaining polygon */
			for(s=v,t=v+1;t<nv;s++,t++) verts[s] = verts[t]; nv--;

			/* resest error detection counter */
			count = 2 * nv;
		}
	}

	return result;
};
   
// calculate area of the contour polygon
Triangulator.area = function( contour )
{
    var n = contour.length;
    var a  = 0.0;

    for(var p=n-1, q=0; q<n; p=q++)
    {
        a += contour[p].x * contour[q].y - contour[q].x * contour[p].y;
    }
    return a * 0.5;
};
   
    // see if p is inside triangle abc
Triangulator.insideTriangle = function(ax, ay, bx, by, cx, cy,px,py)
{

      var aX, aY, bX, bY;
      var cX, cY, apx, apy;
      var bpx, bpy, cpx, cpy;
      var cCROSSap, bCROSScp, aCROSSbp;

      aX = cx - bx;  aY = cy - by;
      bX = ax - cx;  bY = ay - cy;
      cX = bx - ax;  cY = by - ay;
      apx= px  -ax;  apy= py - ay;
      bpx= px - bx;  bpy= py - by;
      cpx= px - cx;  cpy= py - cy;

      aCROSSbp = aX*bpy - aY*bpx;
      cCROSSap = cX*apy - cY*apx;
      bCROSScp = bX*cpy - bY*cpx;

      return ((aCROSSbp>= 0.0) && (bCROSScp>= 0.0) && (cCROSSap>= 0.0));
};
   
Triangulator.snip = function( contour, u, v, w, n, verts )
{
	var p;
	var ax, ay, bx, by;
	var cx, cy, px, py;

	ax = contour[verts[u]].x;
	ay = contour[verts[u]].y;

	bx = contour[verts[v]].x;
	by = contour[verts[v]].y;

	cx = contour[verts[w]].x;
	cy = contour[verts[w]].y;

	if ( Triangulator.EPSILON > (((bx-ax)*(cy-ay)) - ((by-ay)*(cx-ax))) ) return false;

	for (p=0;p<n;p++)
	{
		if( (p == u) || (p == v) || (p == w) ) continue;
		px = contour[verts[p]].x;
		py = contour[verts[p]].y;
		if (Triangulator.insideTriangle(ax,ay,bx,by,cx,cy,px,py)) return false;
	}
	return true;
};

Triangulator.render = function( tris, ctx )
{
	for( var i = 0; i< tris.length; i+=3 )
	{
		var r = parseInt(Math.random() * 128 + 128);
		var g = parseInt(Math.random() * 128 + 128);
		var b = parseInt(Math.random() * 128 + 128);
		ctx.fillStyle = "rgba( " + r + ", " + g + ", " + b + ", 1 )";

		var p0 = tris[ i ];
		var p1 = tris[ i+1 ];
		var p2 = tris[ i+2 ];

		ctx.beginPath();
		ctx.moveTo( p0.x, p0.y );
		ctx.lineTo( p1.x, p1.y );
		ctx.lineTo( p2.x, p2.y );
		ctx.lineTo( p0.x, p0.y );
		ctx.fill();
	}
};