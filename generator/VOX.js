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

//just some random X/Y/Z walk
var x = 128;
var y = 128;
var z = 0;
for (var i = 0; i < 12000; i++) {
    //this sets a voxel at the x/y/z coordinate with color palette index c
    //note that index 0 is an empty cell and will delete a voxel in case
    //there is one already at that position
    var c = (Math.random()<0.01 ? 2 : 1);
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
    ][(Math.random() * 10) | 0];
    x = (x + step[0]) % 256;
    y = (y + step[1]) % 256;
    z = (z + step[2]);
    if ( z < 0 ) z = 0;
}

//the color palette can be written directly
//format is 0xAARRGGBB
// note that the palette values are offset by 1,
// so setting palette[0] will change the color index #1
vox.palette[1] = 0xffff8000

// whilst editing you should comment this line out, otherwise it will export files everytime you make a change
vox.export('test.vox');