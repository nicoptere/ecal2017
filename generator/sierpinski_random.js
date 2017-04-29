
function draw(p0, p1, p2) {
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.closePath();
    ctx.stroke();
}

function randomize( a, b ){
    if( b == null ) return Math.random() * a;
    return lerp( Math.random(), a,b );
}

function sierpinski(p0, p1, p2, level, offset, gravity) {
    if(level <= 0) {
        draw(p0, p1, p2);
    }
    else {
        var a = {
                x: (p0.x + p1.x) / 2 + randomize(-offset, offset),
                y: (p0.y + p1.y) / 2 + randomize(-offset, offset) + randomize(gravity)
            },
            b = {
                x: (p0.x + p2.x) / 2 + randomize(-offset, offset),
                y: (p0.y + p2.y) / 2 + randomize(-offset, offset) + randomize(gravity)
            },
            c = {
                x: (p1.x + p2.x) / 2 + randomize(-offset, offset),
                y: (p1.y + p2.y) / 2 + randomize(-offset, offset) + randomize(gravity)
            };

        if(randomize(1) > .5) {
            sierpinski(p0, a, b, level - 1, offset * 0.5, gravity * 0.5);
        } else {
            draw(p0, a, b);
        }

        if(randomize(1) > .5) {
            sierpinski(p1, a, c, level - 1, offset * 0.5, gravity * 0.5);
        } else {
            draw(p1, a, c);
        }

        if(randomize(1) > .5) {
            sierpinski(p2, b, c, level - 1, offset * 0.5, gravity * 0.5);
        } else {
            draw(p0, a, b);
        }
    }
}

var size = 250;
var points = [];
for(var i = 0; i < Math.PI * 2; i += Math.PI * 2 / 3) {
    points.push({
        x: w/2 + Math.cos(i - Math.PI / 2) * size,
        y: h/2 + Math.sin(i - Math.PI / 2) * size
    });
}

sierpinski(points[0], points[1], points[2], 6, 20, 10 );
