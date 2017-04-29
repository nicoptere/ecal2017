

function getNormals( a,b,c, length ){

    var aa = angle(a, b);
    var ab = angle(b, c);
    var ac = angle(c, a);

    var na = new Point(b.x + Math.cos( aa + Math.PI / 2 ) * length, b.y + Math.sin( aa + Math.PI / 2 ) * length );
    var nb = new Point(c.x + Math.cos( ab + Math.PI / 2 ) * length, c.y + Math.sin( ab + Math.PI / 2 ) * length );
    var nc = new Point(a.x + Math.cos( ac + Math.PI / 2 ) * length, a.y + Math.sin( ac + Math.PI / 2 ) * length );

    return [na,nb,nc];
}