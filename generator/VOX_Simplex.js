//Scroll down to the botton and uncomment the last line in order to trigger
//the export to .vox file function


function VOX(X, Y, Z) {
    this.X = X;
    this.Y = Y;
    this.Z = Z;
    this.vcount = 0
    this.voxels = [];
    this.palette = [];

    for (var i = 256; --i > -1;) {
        this.palette.push(0xff000000 | i | (i << 8) | (i << 16));
    }

    this.setVoxel = function(x, y, z, i) {
        i |= 0;
        x |= 0;
        y |= 0;
        z |= 0;

        if (i >= 0 && i < 256 && x >= 0 && y >= 0 && z >= 0 && x < this.X && z < this.Y && z < this.Z) {
            var key = x + "_" + y + "_" + z
            if (i > 0) {
                if (!this.voxels[key]) this.vcount++;
                this.voxels[key] = i;
            } else {
                if (this.voxels[key]) this.vcount--;
                delete this.voxels[key];
            }
        }
    }

    this.appendString = function(data, str) {
        for (var i = 0, j = str.length; i < j; ++i) {
            data.push(str.charCodeAt(i));
        }
    }

    this.appendUInt32 = function(data, n) {
        data.push(n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff);
    }

    this.appendRGBA = function(data, n) {
        data.push((n >>> 16) & 0xff,(n >>> 8) & 0xff, n & 0xff, (n >>> 24) & 0xff);
    }

    this.appendVoxel = function(data, key) {
        var v = key.split("_");
        data.push(v[0], v[1], v[2], this.voxels[key]);
    }

    this.export = function(filename) {
        var data = [];
        this.appendString(data, "VOX ");
        this.appendUInt32(data, 150);
        this.appendString(data, "MAIN");
        this.appendUInt32(data, 0);
        this.appendUInt32(data, this.vcount * 4 + 0x434);

        this.appendString(data, "SIZE");
        this.appendUInt32(data, 12);
        this.appendUInt32(data, 0);
        this.appendUInt32(data, this.X);
        this.appendUInt32(data, this.Y);
        this.appendUInt32(data, this.Z);
        this.appendString(data, "XYZI");
        this.appendUInt32(data, 4 + this.vcount * 4);
        this.appendUInt32(data, 0);
        this.appendUInt32(data, this.vcount);
        for (var key in this.voxels) {
            this.appendVoxel(data, key);
        }
        this.appendString(data, "RGBA");
        this.appendUInt32(data, 0x400);
        this.appendUInt32(data, 0);
        for (var i = 0; i < 256; i++) {
            this.appendRGBA(data, this.palette[i]);
        }
        this.saveByteArray([new Uint8Array(data)], filename)
        return
    }

    this.saveByteArray = (function() {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        return function(data, name) {
            var blob = new Blob(data, {
                    type: "octet/stream"
                }),
                url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = name;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    }());
}

//This is an example how this class is used:

//create a new Voxel volume (maximum dimensions are 256x256x256 right now)
var vox = new VOX(256, 256, 256);
/*
//just some pseudoRandom X/Y/Z walk
var x = 128;
var y = 128;
var z = 0;
for (var i = 0; i < 12000; i++) {
    //this sets a voxel at the x/y/z coordinate with color palette index c
    //note that index 0 is an empty cell and will delete a voxel in case
    //there is one already at that position
    var c = (Math.pseudoRandom()<0.01 ? 2 : 1);
    vox.setVoxel(x, y, z,c);
    vox.setVoxel(255-x, y, z,c);
    vox.setVoxel(x, 255-y, z,c);
    vox.setVoxel(255-x, 255-y, z,c);

    step = [
        [1, 0, 0],
        [-1, 0, 0],
        [0, 1, 0],
        [0, -1, 0],
        [1, 0, 0],
        [-1, 0, 0],
        [0, 1, 0],
        [0, -1, 0],
        [0, 0, 1],
        [0, 0, -1]
    ][(Math.pseudoRandom() * 10) | 0];
    x = (x + step[0]) % 256;
    y = (y + step[1]) % 256;
    z = (z + step[2]);
    if ( z < 0 ) z = 0;
}
//*/
/*
    for( var i = 0; i < 256; i++ ){
        for( var j = 0; j < 256; j++ ){
            for( var k = 0; k < 256; k++ ){



                var s = .02;
                var n = simplex.noise3D( i * s, j * s, k * s );


                if( d > .5 && n < 0.55 ){
                // if( n > -0.05 && n < 0.05 ){


                    vox.setVoxel(i,j,k, (Math.pseudoRandom()>0.05 ? 2 : 1) );

                }
            }
        }
        console.log( i )
    }
//*/

var simplex = new SimplexNoise();
function distance( a, b ){
    var dx = a[0]-b[0];
    var dy = a[1]-b[1];
    var dz = a[2]-b[2];
    return Math.sqrt( dx*dx + dy*dy + dz*dz );
}
//creates a 2D context
var canvas, w, h, ctx;

    canvas = document.createElement( 'canvas' );
    document.body.appendChild( canvas );
    w = canvas.width = window.innerWidth ;
    h = canvas.height = window.innerHeight ;
    ctx = canvas.getContext("2d");

var c = [128,128,128];
// ctx.globalAlpha = 2 / 255;
for( var i = 0; i < 256; i++ ) {
    for (var j = 0; j < 256; j++) {
        for (var k = 0; k < 256; k++) {
            var s = .05;
            var n = Math.abs( simplex.noise3D( i * s, j * s, k * s) * 2 );
            d = ( distance(c, [i-128, j-128, k-128]) + n ) / 128;
            if (d > .4 && d < 0.5) {
                // ctx.fillRect(j, k, 1, 1);
                vox.setVoxel(i-64,j-64,k-64, (Math.random()>0.05 ? 2 : 1) );
            }
        }
    }
    console.log( i );
}



//the color palette can be written directly
//format is 0xAARRGGBB
// note that the palette values are offset by 1,
// so setting palette[0] will change the color index #1
// vox.palette[1] = 0xffff8000
vox.palette[1] = 0xff000000;

// whilst editing you should comment this line out, otherwise it will export files everytime you make a change
vox.export('test.vox');