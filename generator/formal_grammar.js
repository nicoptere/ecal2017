
// /*
function check2( string ){

    string = string.toUpperCase();
    // if( string.length == 0 )return true;

    var char = string.charAt( 0 );
    var next = string.charAt( 1 );

    var substring = string.substr( 1, string.length );

    if( char == "M" ){

        if( next == "X" ){
            substring.substr( 1, substring.length );
            return check( substring );
        }
        if( next == "V" ){
            return check( substring );
        }
        return false;
    }

    if( char == "V" ){

        if( next == "R" ){
            substring.substr( 1, substring.length );
            return check( substring );
        }
        if( next == "M" || next == "X" ){
            return check( substring );
        }
        return false;

    }

    if( char == "X" ){
        if( next == "R" || next == "V" ){
            return check( substring );
        }
        return false;
    }

    if( char == "R" ){
        return check( substring );
    }

    return true;

}

//*/


function check1( string ){

    string = string.toUpperCase();
    var char = string.charAt( 0 );
    var next = string.charAt( 1 );
    var substring = string.substr( 1, string.length );
console.log (string, substring)
    if( char == "M" ){
        if( next == "X" ){
            // substring.substr( 1, substring.length );
            return check( substring );
        }
        if( next == "V" ){
            return check( substring );
        }
        return false;
    }

    if( char == "V" ){
        if( next == "R" || next == "M" || next == "X" ){
            return check( substring );
        }
        return false;
    }

    if( char == "X" ){
        if( next == "R" || next == "V" ){
            return check( substring );
        }
        return false;
    }

    if( char == "R" ){
        if( next != "M" ){
            return check( substring );
        }
        return false;
    }

    return true;

}

var M = "M";
var R = "R";
var X = "X";
var V = "V";
function check( string, original ){


    original = original || string;
    if( original.charAt(0) != M && original.charAt(0) != V )return false;

    if( string.length == 1 )return true;

    var char = string.charAt( 0 );
    var next = string.charAt( 1 );
    var substring = string.substr( 1, string.length );

    if( char == V && next == M )return check( substring );
    if( char == R && next == M )return check( substring );
    if( char == V && next == X )return check( substring );
    if( char == M && next == X )return check( substring );
    if( char == M && next == V )return check( substring );
    if( char == X && next == V )return check( substring );
    if( char == R && next == V )return check( substring );
    if( char == V && next == V )return check( substring );
    if( char == V && next == R )return check( substring );
    if( char == M && next == R )return check( substring );
    if( char == R && next == R )return check( substring );
    return false;
}

// console.log( check( "MXV" ) );
// console.log( check( "VMRV" ) );
// console.log( check( "MVXVV" ) );
// console.log( check( "VRRRM" ) );
// console.log( check( "VV" ) );
// console.log( check( "MMX" ) );
// console.log( check( "MXR" ) );
// console.log( check( "XXXV" ) );

var out = "";// accumulator
var bits = "I AM A BANANA!".split('');
for( var i = 0; i < bits.length; i++ ){//iterator</mark>
    out += bits[ i ];//adds a letter to <i>out</i>
}
console.log( i, out );//-> 14 'I AM A BANANA!'