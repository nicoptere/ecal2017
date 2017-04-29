
function renderPoly( poly, labels ){
    // if( poly.points.length < 2 )return;
//        ctx.clearRect( 0,0,w,h );

    if( poly.color != undefined ) ctx.strokeStyle = poly.color;
    poly.edges.forEach( function(e, i){

        var i0 = e[0];
        var i1 = e[1];

        var p0 = poly.points[ i0 ];
        var p1 = poly.points[ i1 ];

        ctx.beginPath();
        ctx.moveTo( p0[0], p0[1] );
        ctx.lineTo( p1[0], p1[1] );
        ctx.stroke();


        if( labels ){

           ctx.fillStyle = "#000";
           ctx.globalAlpha = 1;
           ctx.fillText( i0, p0[0], p0[1] );
           ctx.fillText( i1, p1[0], p1[1] );

           // ctx.fillText( "e " + i,
           //         ( p0[0] + p1[0] ) * .5,
           //         ( p0[1] + p1[1] ) * .5 );
        }

    });
}
