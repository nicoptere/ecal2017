

var votes = 10000;
var i = votes;
var accumulator = 0;
while( i-- ){
    accumulator += Math.random()>.5 ? 1 : 0;
}
console.log( accumulator/votes > .5 );


/*
var yes = 0;
var no = 0;
for( var k =0; k< 100; k++ ){

    var positive = 0;
    var negative = 0;

    for( var j = 0; j < 100; j++ ){

        var votes = 10000;
        var i = votes;
        var accumulator = 0;
        while( i-- ){
            accumulator += Math.random()>.5 ? 1 : 0;
        }

        if( accumulator / votes >= .5 ){
            positive++;
        }else{
            negative++;
        }

    }
    if( positive > negative ) {
        yes++;
    }else{
        no++;
    }

    if( k%10 == 0 )console.log( "\t", positive, negative );
}
console.log( yes, no );
//*/