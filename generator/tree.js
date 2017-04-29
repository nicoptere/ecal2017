
function branch(length, angle) {

    line(0, 0, 0, -length);
    ctx.translate(0, -length);

    if (length > 2) {

        length *= 0.65;

        ctx.save();
        ctx.rotate(angle);
        branch(length, angle);
        ctx.restore();

        ctx.save();
        ctx.rotate(-angle);
        branch(length, angle);
        ctx.restore();
    }
}

function line(x0, y0, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}

ctx.translate(w/2,h/2 + 200);
branch( 200, Math.PI / 180 * 30 );