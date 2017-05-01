
function circle( x,y, r ){
    ctx.beginPath();
    ctx.arc( x,y,r,0, Math.PI * 2 );
    ctx.stroke();
}

function line( l ){
    ctx.beginPath();
    ctx.moveTo( l[0].x,l[0].y );
    ctx.lineTo( l[1].x,l[1].y );
    ctx.stroke();
}



//vanishing points
var vpDistance = 100;
var vp0 = new Point(  vpDistance,   h / 2 );
var vp1 = new Point(w-vpDistance,  h / 2 - vpDistance);
var vp2 = new Point(w/2, -vpDistance );
circle(vp0.x,vp0.y, 5);
circle(vp1.x,vp1.y, 5);
circle(vp2.x,vp2.y, 5);

var allLines = [];
var lp;
var pw = 40;
var count = 10;
var p = new Point();
for( var i = 0; i < count;i++ ){

    for( var j = 0; j < count;j++ ) {

        var size = 10 * pw;
        p.x = w/2 - size / 2 + ( i / count ) * size;
        p.y = h/2 - size / 2 + ( j / count ) * size;

        var lines = [
            [vp2, offsetPoint(vp2, p, -pw)],
            [vp2, p],
            [vp2, offsetPoint(vp2, p, pw)]
        ];

        var ip0 = lineIntersection(vp0, p, lines[0][0], lines[0][1]);
        var ip1 = lineIntersection(vp1, p, lines[2][0], lines[2][1]);
        var ipn = lineIntersection(vp0, ip1, lines[1][0], lines[1][1]);

        line([p, ip0]);
        line([p, ip1]);
        line([ip0, ipn]);
        line([ip1, ipn]);

        allLines.push([p.clone(), ip0], [p.clone(), ip1], [ip0, ipn], [ip1, ipn]);

    }
}

allLines.forEach(function( l ){

    var m = Point.lerp( .5, l[0], l[1] );
    var m1 = m.clone();
    m1.y += 1000;

    ctx.globalAlpha = .1;

    // ctx.strokeStyle = 'hsl( ' + parseInt(360 * Math.pseudoRandom() ) + ', 50%, 50% )';

    var ip = lineIntersectLines( m1, m,allLines );

    if( ip.length ){
        ip.reverse();
        line([m,ip[0]]);
    //
        ip.forEach(function( p ){
            // line([m, p]);
        })
    }

});