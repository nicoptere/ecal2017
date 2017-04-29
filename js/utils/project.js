

function project(p, a, b, asSegment) {
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    if (asSegment && dx == 0 && dy == 0) {
        return a;
    }
    var t = ( ( p.x - a.x ) * dx + ( p.y - a.y ) * dy) / ( dx * dx + dy * dy );
    if (asSegment && t < 0) return a;
    if (asSegment && t > 1) return b;
    return new Point(a.x + t * dx, a.y + t * dy);
}