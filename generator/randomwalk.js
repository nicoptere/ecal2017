
var RAD = Math.PI / 180;

//stores some vairables
var points = [];
var angles = [];
var speeds = [];
for( var i = 0; i < 20; i++ ){

    //point position
    points.push( [w/2, h/2] );
    //starting angle
    angles.push( Math.random() * Math.PI * 2 );
    //rotation speed
    speeds.push( 5 + Math.random() * 25 );

}

ctx.beginPath();
for( i = 0; i < 2000; i++ ){

    //iterate over points
    points.forEach( function( p, id ){

        //move to current position
        ctx.moveTo( p[0], p[1] );

        //updates angle
        angles[id] += ( Math.random() - .5 ) * RAD * speeds[id];

        //updates poistion
        p[0] += Math.sin( angles[id] );
        p[1] += Math.cos( angles[id] );

        //draws line to new position
        ctx.lineTo( p[0], p[1] );

    });
}
ctx.stroke();