

function offsetPoint( a,b, offset ){
    var v1 = a.clone().sub( b ).normalize().multiplyScalar(offset);
    var n = new Point(-v1.y, v1.x);
    return b.clone().add( n );
}

function offsetLine( a,b, offset ){
    var v1 = b.clone().sub( a ).normalize().multiplyScalar(offset);
    var n = new Point(-v1.y, v1.x);
    return [a.clone().add( n ), b.clone().add( n )];
}
