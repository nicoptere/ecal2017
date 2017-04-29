//http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
var eps = 0.0000001;
function between(a, b, c) {
    return a-eps <= b && b <= c+eps;
}
function SegmentIntersection( p1, p2, p3, p4 ){

    if( p1.equals( p2 ) )return false;
    if( p1.equals( p3 ) )return false;
    if( p1.equals( p4 ) )return false;
    if( p2.equals( p3 ) )return false;
    if( p2.equals( p4 ) )return false;
    if( p3.equals( p4 ) )return false;

    var x1 = Math.round( p1.x );
    var y1 = Math.round( p1.y );
    var x2 = Math.round( p2.x );
    var y2 = Math.round( p2.y );
    var x3 = Math.round( p3.x );
    var y3 = Math.round( p3.y );
    var x4 = Math.round( p4.x );
    var y4 = Math.round( p4.y );

    var x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4)) / ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
    var y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4)) / ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));

    if (isNaN(x)||isNaN(y)) {
        return false;
    }else {
        if (x1>=x2) {
            if (!between(x2, x, x1))return false;
        } else {
            if (!between(x1, x, x2))return false;
        }
        if (y1>=y2) {
            if (!between(y2, y, y1))return false;
        } else {
            if (!between(y1, y, y2))return false;
        }
        if (x3>=x4) {
            if (!between(x4, x, x3))return false;
        } else {
            if (!between(x3, x, x4))return false;
        }
        if (y3>=y4) {
            if (!between(y4, y, y3))return false;
        } else {
            if (!between(y3, y, y4))return false;
        }
    }
    return new Point( x, y );

}