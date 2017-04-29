var Hilditch = function(){};
Hilditch.W = 0;
Hilditch.H = 0;
Hilditch.L = 0;
Hilditch.points = null;
Hilditch.output = null;
Hilditch.data = null;
Hilditch.ctx = null;

Hilditch.skeletize = function( ctx )
{

	//init skeletonization
	Hilditch.ctx = ctx;

	Hilditch.parse( Hilditch.ctx, ctx.canvas.width, ctx.canvas.height );

	//perform skeletonization
	var count = Hilditch.compute();
	var last = -1;
	while( count != last )
	{
		count = Hilditch.compute();
		last = Hilditch.compute();
	}

	var coords = [];
	for(var x = 0; x < Hilditch.W; x++)
	{
		for(var y = 0; y < Hilditch.H; y++)
		{
			if( Hilditch.getValue( x,y ) )
			{
				coords.push( x,y );
			}
		}
	}
	return coords;

};

/**
 * turns a binary image into a boolean array
 * @param	ctx binary image drawn on the context
 */
Hilditch.parse = function( ctx, width, height )
{

	var imageData = ctx.getImageData( 0, 0, width, height );
    Hilditch.data = imageData.data;

	Hilditch.W = width;
	Hilditch.H = height;
	Hilditch.L = width * height;
	Hilditch.points = new Array( Hilditch.L );
	Hilditch.output = new Array( Hilditch.L );

	for( var i = 0; i < Hilditch.L * 4; i += 4 )
	{
		var n = i / 4;
		if( Hilditch.data[ i + 3 ] == 0 )// +3 = alpha value of each pixel
		{
			Hilditch.points[ n ] = Hilditch.output[ n ] = false;
		}
		else
		{
			Hilditch.points[ n ] = Hilditch.output[ n ] = true;
		}
	}
};

Hilditch.getValue = function( x, y )
{
	return Hilditch.points[ ( ( Hilditch.W * y ) + x ) ];
};
Hilditch.setValue = function( x, y, value )
{
	Hilditch.points[ ( ( Hilditch.W * y ) + x ) ] = value;
};


Hilditch.compute = function()
{
	var count = 0,n, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12;

	for( var x = 2; x < Hilditch.W - 2; x++)
	{
		for( var y = 2; y < Hilditch.H - 2; y++)
		{
			n = y * Hilditch.W + x;

			p1 = Hilditch.points[ n ];
			if ( p1 )
			{

				//condition 1
				var c = 0;
				p2 = Hilditch.points[ n - Hilditch.W ];
				p3 = Hilditch.points[ n - Hilditch.W + 1 ];
				p4 = Hilditch.points[ n + 1 ];
				p5 = Hilditch.points[ n + Hilditch.W + 1 ];
				p6 = Hilditch.points[ n + Hilditch.W ];
				p7 = Hilditch.points[ n + Hilditch.W - 1 ];
				p8 = Hilditch.points[ n - 1 ];
				p9 = Hilditch.points[ n - Hilditch.W - 1 ];

				if ( p2 ) c++;
				if ( p3 ) c++;
				if ( p4 ) c++;
				if ( p5 ) c++;
				if ( p6 ) c++;
				if ( p7 ) c++;
				if ( p8 ) c++;
				if ( p9 ) c++;

				if( c > 1 && c < 7 )
				{

					//condition 2
					if( Hilditch.evaluate( p2, p3, p4, p5, p6, p7, p8, p9 ) == 1 )
					{

						//condition 3
						p10 = Hilditch.points[ n - 2 * Hilditch.W - 1 ];
						p11 = Hilditch.points[ n - 2 * Hilditch.W ];
						p12 = Hilditch.points[ n - 2 * Hilditch.W + 1 ];

						if(  ( !p2 || !p4 || !p8 ) ||  Hilditch.evaluate( p11, p12, p3, p4, p1, p8, p9, p10 ) != 1 )
						{

							//condition 4
							p10 = Hilditch.points[ n - Hilditch.W + 2 ];
							p11 = Hilditch.points[ n + 2 ];
							p12 = Hilditch.points[ n + Hilditch.W + 2 ];

							if( ( !p2 || !p4 || !p6 ) || Hilditch.evaluate(p3, p10, p11, p12, p5, p6, p1, p2 ) != 1 )
							{
								Hilditch.output[ n ] = false;
							}
						}
					}
				}
				count++;
			}
		}
	}
	Hilditch.points = Hilditch.output.concat();
	return count;
};

Hilditch.evaluate = function( p2, p3, p4, p5, p6, p7, p8, p9 )
{

	var c = 0;
	if( !p2 && p3 )c++;
	if( !p3 && p4 )c++;
	if( !p4 && p5 )c++;
	if( !p5 && p6 )c++;
	if( !p6 && p7 )c++;
	if( !p7 && p8 )c++;
	if( !p8 && p9 )c++;
	if( !p9 && p2 )c++;
	return c;

};