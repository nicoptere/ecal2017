
function MAT( context, threshold,  width, height, callback ){

    threshold = threshold || 2;

    //collect the binary values
    var imgData = context.getImageData( 0,0,width,height );
    var iData = imgData.data;

    //creates an INT buffer ( allows to store negative values )
    var data = new Int16Array( width * height );
    for( var i = 0; i < width * height; i++ )
    {
        // iData[ i * 4 ] = 0 (black) or anything else (white)
        data[ i ] = iData[ i * 4 ];
    }

    //decimate the outer pixels
    function iterate( data, iteration )
    {

        var count = 0;
        var remove = [];
        for( i = 0; i< width * height; i++ )
        {

            if( data[ i ] <= 0 )continue;

            count = 0;
            count += ( data[ i - width - 1  ] <= 0 ) ? 1 : 0;
            if( count > threshold )remove.push( i );

            count += ( data[ i - width      ] <= 0 ) ? 1 : 0;
            if( count > threshold )remove.push( i );

            count += ( data[ i - width + 1  ] <= 0 ) ? 1 : 0;
            if( count > threshold )remove.push( i );

            count += ( data[ i - 1      ] <= 0 ) ? 1 : 0;
            if( count > threshold )remove.push( i );

            count += ( data[ i + 1      ] <= 0 ) ? 1 : 0;
            if( count > threshold )remove.push( i );

            count += ( data[ i + width - 1  ] <= 0 ) ? 1 : 0;
            if( count > threshold )remove.push( i );

            count += ( data[ i + width      ] <= 0 ) ? 1 : 0;
            if( count > threshold )remove.push( i );

            count += ( data[ i + width + 1  ] <= 0 ) ? 1 : 0;
            if( count > threshold )remove.push( i );

        }

        //stores the current iteration
        remove.forEach( function( i )
        {
            data[ i ] = -iteration ;
        });

        if( remove.length > 0 )
        {
            console.log( "iteration" );
            iteration++;
            setTimeout( iterate, 0, data, iteration )
        }
        else
        {
            console.log( "MAT complete" );
            if( callback != null )callback( data, iteration );
        }

    }
    iterate( data, 1 );

}

