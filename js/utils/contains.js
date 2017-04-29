
function contains( poly, x, y )
{
    var c = false,
        l = poly.length,
        j = l - 1;
    for( var i = -1; ++i < l; j = i)
    {
        (   ( poly[ i ].y <= y && y < poly[ j ].y )
        ||  ( poly[ j ].y <= y && y < poly[ i ].y ) )
        &&  ( x < ( poly[ j ].x - poly[ i ].x ) * ( y - poly[ i ].y ) / ( poly[ j ].y - poly[ i ].y ) + poly[ i ].x )
        &&  ( c = !c);
    }
    return c;
}
