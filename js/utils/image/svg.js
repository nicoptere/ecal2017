


function getNode(n, v) {
    n = document.createElementNS("http://www.w3.org/2000/svg", n);
    for (var p in v)
        n.setAttributeNS(null, p.replace(/[A-Z]/g, function(m, p, o, s) { return "-" + m.toLowerCase(); }), v[p]);
    return n
}

function getSVG(w, h ){

    var svg = getNode('svg');
    svg.setAttribute( "viewBox", "0 0 "+w+" "+h+"" );
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);
    // document.body.appendChild( svg );
    return svg;

}

function addSVGPath( d, svg ){
    var path = getNode('path');
    path.setAttribute('d', d );

    if( svg ){
        svg.appendChild(path)
    }
    return path;
}

// var d = ('M ' + points.shift() + ' L ' + points.join(' ') );
// svg.appendChild(path)