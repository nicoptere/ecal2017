var $hxClasses = {};
function $extend(from, fields) {
    function inherit() {}; inherit.prototype = from; var proto = new inherit();
    for (var name in fields) proto[name] = fields[name];
    return proto;
}

var Point = function( x,y){
    this.x = x || 0;
    this.y = y || 0;
};
Point.prototype = {
    clone : function(){
        return new Point( this.x, this.y );
    },
    subtract : function(o){
        this.x -= o.x;
        this.y -= o.y;
        return this;
    }
}

var biga = {}
biga.shapes2d = {}
biga.shapes2d.RegularPolygon = function(x,y,radius,sides) {
    if(sides == null) sides = 5;
    if(radius == null) radius = 50;
    if(y == null) y = 0;
    if(x == null) x = 0;
    this._offsetLength = 0;
    this._offsetAngle = 0;
    this._externalAngle = 0;
    this._internalAngle = 0;
    this._centralAngle = 0;
    this._rotation = 0;
    this._sides = 5;
    this._radius = 50;
    Point.call(this,x,y);
    this._points = new Array();
    this._radius = radius;
    this._sides = sides < 3?3:sides;
    this._offset = new Point();
    this.resetShape();
};

biga.shapes2d.RegularPolygon.__name__ = ["biga","shapes2d","RegularPolygon"];
biga.shapes2d.RegularPolygon.__super__ = Point;
biga.shapes2d.RegularPolygon.prototype = $extend(Point.prototype,{
    draw: function(graphics) {
        var p = this.get_points()[0];
        graphics.moveTo(p.x,p.y);
        var _g = 0, _g1 = this.get_points();
        while(_g < _g1.length) {
            var p1 = _g1[_g];
            ++_g;
            graphics.lineTo(p1.x,p1.y);
        }
        graphics.lineTo(this.get_points()[0].x,this.get_points()[0].y);
    }
    ,get_center: function() {
        return new Point(this.x + Math.cos(this.get_rotation() + this._offsetAngle) * -this._offsetLength,this.y + Math.sin(this.get_rotation() + this._offsetAngle) * -this._offsetLength);
    }
    ,center: null
    ,get_externalAngle: function() {
        return this._externalAngle;
    }
    ,externalAngle: null
    ,get_internalAngle: function() {
        return this._internalAngle;
    }
    ,internalAngle: null
    ,get_centralAngle: function() {
        return this._centralAngle;
    }
    ,centralAngle: null
    ,get_apothem: function() {
        return this.get_inRadius();
    }
    ,apothem: null
    ,get_inRadius: function() {
        return this._inRadius;
    }
    ,inRadius: null
    ,set_sideLength: function(value) {
        this._radius = value / (2 * Math.sin(Math.PI / this._sides));
        this.resetShape();
        return this.get_sideLength();
    }
    ,get_sideLength: function() {
        return this._sideLength;
    }
    ,sideLength: null
    ,set_rotation: function(value) {
        this._rotation = value;
        this.resetShape();
        return this.get_rotation();
    }
    ,get_rotation: function() {
        return this._rotation;
    }
    ,rotation: null
    ,set_sides: function(value) {
        if(this._sides == value || value < 3) return 0;
        this._sides = value;
        this.resetShape();
        return this.get_sides();
    }
    ,get_sides: function() {
        return this._sides;
    }
    ,sides: null
    ,set_radius: function(value) {
        this._radius = value;
        this.resetShape();
        return this.get_radius();
    }
    ,get_radius: function() {
        return this._radius;
    }
    ,radius: null
    ,get_points: function() {
        return this._points;
    }
    ,points: null
    ,glide: function(anchor0,anchor1) {
        if(anchor1 == null) anchor1 = this.clone();
        this.translate(anchor0.subtract(anchor1));
        this.reflect(anchor0,anchor1);
    }
    ,reflectPoint: function(p,p0,p1) {
        var pp = biga.utils.GeomUtils.project(p,p0,p1);
        if(Math.isNaN(pp.x) || Math.isNaN(pp.y)) pp = biga.utils.GeomUtils.project(p,p0,p1,false);
        p.x += (pp.x - p.x) * 2;
        p.y += (pp.y - p.y) * 2;
    }
    ,reflect: function(anchor0,anchor1) {
        var p;
        this.reflectPoint(this,anchor0,anchor1);
        var _g = 0, _g1 = this.get_points();
        while(_g < _g1.length) {
            var p1 = _g1[_g];
            ++_g;
            this.reflectPoint(p1,anchor0,anchor1);
        }
    }
    ,rotatePoint: function(p,anchor,angle) {
        var a, d;
        a = biga.utils.GeomUtils.angle(anchor,p) + angle;
        d = biga.utils.GeomUtils.distance(anchor,p);
        p.x = anchor.x + Math.cos(a) * d;
        p.y = anchor.y + Math.sin(a) * d;
        return p;
    }
    ,rotate: function(anchor,angle) {
        this.rotatePoint(this,anchor,angle);
        var p;
        var _g = 0, _g1 = this.get_points();
        while(_g < _g1.length) {
            var p1 = _g1[_g];
            ++_g;
            this.rotatePoint(p1,anchor,angle);
        }
        this._rotation = angle;
    }
    ,translate: function(anchor) {
        var p;
        this.x += anchor.x;
        this.y += anchor.y;
        var _g = 0, _g1 = this.get_points();
        while(_g < _g1.length) {
            var p1 = _g1[_g];
            ++_g;
            p1.x += anchor.x;
            p1.y += anchor.y;
        }
    }
    ,resetShape: function() {
        var i = 0;
        var angle = this._rotation;
        this._inRadius = this._radius * Math.cos(Math.PI / this._sides);
        this._sideLength = 2 * this._radius * Math.sin(Math.PI / this._sides);
        this._centralAngle = Math.PI * 2 / this._sides;
        this._internalAngle = (1 - 2 / this.get_sides()) * Math.PI;
        this._externalAngle = Math.PI - this._internalAngle;
        var _g1 = 0, _g = this.get_sides();
        while(_g1 < _g) {
            var i1 = _g1++;
            var p = new Point(this.x + Math.cos(angle) * this.get_radius(),this.y + Math.sin(angle) * this.get_radius());
            angle += this.get_centralAngle();
            this.get_points().push(p);
        }
    }
    ,_offsetLength: null
    ,_offsetAngle: null
    ,_offset: null
    ,_externalAngle: null
    ,_internalAngle: null
    ,_centralAngle: null
    ,_inRadius: null
    ,_rotation: null
    ,_sideLength: null
    ,_sides: null
    ,_radius: null
    ,_points: null
    ,__class__: biga.shapes2d.RegularPolygon
    ,__properties__: $extend(Point.prototype.__properties__,{get_points:"get_points",set_radius:"set_radius",get_radius:"get_radius",set_sides:"set_sides",get_sides:"get_sides",set_rotation:"set_rotation",get_rotation:"get_rotation",set_sideLength:"set_sideLength",get_sideLength:"get_sideLength",get_inRadius:"get_inRadius",get_apothem:"get_apothem",get_centralAngle:"get_centralAngle",get_internalAngle:"get_internalAngle",get_externalAngle:"get_externalAngle",get_center:"get_center"})
});
biga.shapes2d.curves = {}
biga.shapes2d.curves.ICurve2D = function() { }

biga.shapes2d.curves.ICurve2D.__name__ = ["biga","shapes2d","curves","ICurve2D"];
biga.shapes2d.curves.ICurve2D.prototype = {
    range: null
    ,compute: null
    ,getPointAt: null
    ,vertices: null
    ,loop: null
    ,precision: null
    ,__class__: biga.shapes2d.curves.ICurve2D
    ,__properties__: {set_precision:"set_precision",get_precision:"get_precision",set_loop:"set_loop",get_loop:"get_loop",set_vertices:"set_vertices",get_vertices:"get_vertices"}
}
biga.shapes2d.curves.CatmullRom = function(precision,loop) {
    if(loop == null) loop = false;
    if(precision == null) precision = .1;
    this._loop = false;
    this._precision = .1;
    this._precision = precision;
    this._loop = loop;
};

biga.shapes2d.curves.CatmullRom.__name__ = ["biga","shapes2d","curves","CatmullRom"];
biga.shapes2d.curves.CatmullRom.__interfaces__ = [biga.shapes2d.curves.ICurve2D];
biga.shapes2d.curves.CatmullRom.p0 = null;
biga.shapes2d.curves.CatmullRom.p1 = null;
biga.shapes2d.curves.CatmullRom.p2 = null;
biga.shapes2d.curves.CatmullRom.p3 = null;
biga.shapes2d.curves.CatmullRom.prototype = {
    vertices: null
    ,set_vertices: function(value) {
        return this._vertices = value;
    }
    ,get_vertices: function() {
        return this._vertices;
    }
    ,loop: null
    ,set_loop: function(value) {
        return this._loop = value;
    }
    ,get_loop: function() {
        return this._loop;
    }
    ,precision: null
    ,set_precision: function(value) {
        return this._precision = value;
    }
    ,get_precision: function() {
        return this._precision;
    }
    ,range: function(start,end,target) {
        if(end == null) end = 1;
        if(start == null) start = 0;
        if(target == null) target = new Array();
        var t = Math.min(start,end);
        var max = Math.max(start,end);
        var increment = this.get_precision() / this.get_vertices().length;
        while(t < max) {
            target.push(this.getPointAt(t));
            t += increment;
        }
        if(this.get_loop()) target.push(target[0]);
        return target;
    }
    ,compute: function(target) {
        return this.range(0,1,target);
    }
    ,getPointAt: function(t,p) {
        if(this.get_vertices() == null) return null;
        if(p == null) p = new Point();
        var i = Math.floor(this.get_vertices().length * t);
        var delta = 1 / this.get_vertices().length;
        t = (t - i * delta) / delta;
        if(!this._loop) {
            biga.shapes2d.curves.CatmullRom.p0 = this.get_vertices()[parseInt( Math.max(0,i - 1) )];
            biga.shapes2d.curves.CatmullRom.p1 = this.get_vertices()[i];
            biga.shapes2d.curves.CatmullRom.p2 = this.get_vertices()[parseInt( Math.min(i + 1,this.get_vertices().length - 1) )];
            biga.shapes2d.curves.CatmullRom.p3 = this.get_vertices()[parseInt( Math.min(i + 2,this.get_vertices().length - 1) )];
        } else {
            biga.shapes2d.curves.CatmullRom.p0 = this.get_vertices()[i - 1 < 0?this.get_vertices().length - 1:i - 1];
            biga.shapes2d.curves.CatmullRom.p1 = this.get_vertices()[i];
            biga.shapes2d.curves.CatmullRom.p2 = this.get_vertices()[(i + 1) % this.get_vertices().length];
            biga.shapes2d.curves.CatmullRom.p3 = this.get_vertices()[(i + 2) % this.get_vertices().length];
        }
        p.x = 0.5 * (2 * biga.shapes2d.curves.CatmullRom.p1.x + t * (-biga.shapes2d.curves.CatmullRom.p0.x + biga.shapes2d.curves.CatmullRom.p2.x + t * (2 * biga.shapes2d.curves.CatmullRom.p0.x - 5 * biga.shapes2d.curves.CatmullRom.p1.x + 4 * biga.shapes2d.curves.CatmullRom.p2.x - biga.shapes2d.curves.CatmullRom.p3.x + t * (-biga.shapes2d.curves.CatmullRom.p0.x + 3 * biga.shapes2d.curves.CatmullRom.p1.x - 3 * biga.shapes2d.curves.CatmullRom.p2.x + biga.shapes2d.curves.CatmullRom.p3.x))));
        p.y = 0.5 * (2 * biga.shapes2d.curves.CatmullRom.p1.y + t * (-biga.shapes2d.curves.CatmullRom.p0.y + biga.shapes2d.curves.CatmullRom.p2.y + t * (2 * biga.shapes2d.curves.CatmullRom.p0.y - 5 * biga.shapes2d.curves.CatmullRom.p1.y + 4 * biga.shapes2d.curves.CatmullRom.p2.y - biga.shapes2d.curves.CatmullRom.p3.y + t * (-biga.shapes2d.curves.CatmullRom.p0.y + 3 * biga.shapes2d.curves.CatmullRom.p1.y - 3 * biga.shapes2d.curves.CatmullRom.p2.y + biga.shapes2d.curves.CatmullRom.p3.y))));
        return p;
    }
    ,_vertices: null
    ,_loop: null
    ,_precision: null
    ,__class__: biga.shapes2d.curves.CatmullRom
    ,__properties__: {set_precision:"set_precision",get_precision:"get_precision",set_loop:"set_loop",get_loop:"get_loop",set_vertices:"set_vertices",get_vertices:"get_vertices"}
}
biga.utils = {}
biga.utils.Delaunay = function() {
};

biga.utils.Delaunay.__name__ = ["biga","utils","Delaunay"];
biga.utils.Delaunay.prototype = {
    indices: null
    ,set_indices: function(value) {
        return this._indices = value;
    }
    ,get_indices: function() {
        return this._indices;
    }
    ,circles: null
    ,set_circles: function(value) {
        return this._circles = value;
    }
    ,get_circles: function() {
        return this._circles;
    }
    ,render: function(graphics,points,indices) {
        var i = 0, id0, id1, id2;
        while(i < (indices.length | 0)) {
            id0 = indices[i];
            id1 = indices[i + 1];
            id2 = indices[i + 2];
            graphics.beginFill(0,.1 + Math.random() * .2);
            graphics.moveTo(points[id0].x,points[id0].y);
            graphics.lineTo(points[id1].x,points[id1].y);
            graphics.lineTo(points[id2].x,points[id2].y);
            graphics.lineTo(points[id0].x,points[id0].y);
            graphics.endFill();
            i += 3;
        }
    }
    ,computeCircle: function(points,id0,id1,id2) {
        var p0 = points[id0];
        var p1 = points[id1];
        var p2 = points[id2];
        var A = p1.x - p0.x;
        var B = p1.y - p0.y;
        var C = p2.x - p0.x;
        var D = p2.y - p0.y;
        var E = A * (p0.x + p1.x) + B * (p0.y + p1.y);
        var F = C * (p0.x + p2.x) + D * (p0.y + p2.y);
        var G = 2.0 * (A * (p2.y - p1.y) - B * (p2.x - p1.x));
        var x = (D * E - B * F) / G;
        this.get_circles().push(x);
        var y = (A * F - C * E) / G;
        this.get_circles().push(y);
        x -= p0.x;
        y -= p0.y;
        this.get_circles().push(x * x + y * y);
    }
    ,circleContains: function(circleId,p) {
        var dx = this.get_circles()[circleId] - p.x;
        var dy = this.get_circles()[circleId + 1] - p.y;
        return this.get_circles()[circleId + 2] > dx * dx + dy * dy;
    }
    ,compute: function(points) {
        var nv = points.length;
        if(nv < 3) return null;
        var d = biga.utils.Delaunay.SUPER_TRIANGLE_RADIUS;
        points.push(new Point(0,-d));
        points.push(new Point(d,d));
        points.push(new Point(-d,d));
        this.set_indices(new Array());
        this.get_indices().push(points.length - 3);
        this.get_indices().push(points.length - 2);
        this.get_indices().push(points.length - 1);
        this.set_circles(new Array());
        this.get_circles().push(0);
        this.get_circles().push(0);
        this.get_circles().push(d);
        var edgeIds = new Array();
        var i, j, k, id0, id1, id2;
        var _g = 0;
        while(_g < nv) {
            var i1 = _g++;
            j = 0;
            while(j < (this.get_indices().length | 0)) {
                if(this.get_circles()[j + 2] > biga.utils.Delaunay.EPSILON && this.circleContains(j,points[i1])) {
                    id0 = this.get_indices()[j];
                    id1 = this.get_indices()[j + 1];
                    id2 = this.get_indices()[j + 2];
                    edgeIds.push(id0);
                    edgeIds.push(id1);
                    edgeIds.push(id1);
                    edgeIds.push(id2);
                    edgeIds.push(id2);
                    edgeIds.push(id0);
                    this.get_indices().splice(j,3);
                    this.get_circles().splice(j,3);
                    j -= 3;
                }
                j += 3;
            }
            j = 0;
            while(j < (edgeIds.length | 0)) {
                k = j + 2;
                while(k < (edgeIds.length | 0)) {
                    if(edgeIds[j] == edgeIds[k] && edgeIds[j + 1] == edgeIds[k + 1] || edgeIds[j + 1] == edgeIds[k] && edgeIds[j] == edgeIds[k + 1]) {
                        edgeIds.splice(k,2);
                        edgeIds.splice(j,2);
                        j -= 2;
                        k -= 2;
                        if(j < 0 || j > edgeIds.length - 1) break;
                        if(k < 0 || k > edgeIds.length - 1) break;
                    }
                    k += 2;
                }
                j += 2;
            }
            j = 0;
            while(j < (edgeIds.length | 0)) {
                this.get_indices().push(edgeIds[j]);
                this.get_indices().push(edgeIds[j + 1]);
                this.get_indices().push(i1);
                this.computeCircle(points,edgeIds[j],edgeIds[j + 1],i1);
                j += 2;
            }
            edgeIds = new Array();
        }
        id0 = points.length - 3;
        id1 = points.length - 2;
        id2 = points.length - 1;
        i = 0;
        while(i < (this.get_indices().length | 0)) {
            if(this.get_indices()[i] == id0 || this.get_indices()[i] == id1 || this.get_indices()[i] == id2 || this.get_indices()[i + 1] == id0 || this.get_indices()[i + 1] == id1 || this.get_indices()[i + 1] == id2 || this.get_indices()[i + 2] == id0 || this.get_indices()[i + 2] == id1 || this.get_indices()[i + 2] == id2) {
                this.get_indices().splice(i,3);
                this.get_circles().splice(i,3);
                if(i > 0) i -= 3;
                continue;
            }
            i += 3;
        }
        points.pop();
        points.pop();
        points.pop();
        return this.get_indices();
    }
    ,_circles: null
    ,_indices: null
    ,__class__: biga.utils.Delaunay
    ,__properties__: {set_circles:"set_circles",get_circles:"get_circles",set_indices:"set_indices",get_indices:"get_indices"}
}
biga.utils.DistributionUtils = function() { }

biga.utils.DistributionUtils.__name__ = ["biga","utils","DistributionUtils"];
biga.utils.DistributionUtils.randomize = function(points,amount) {
    var _g = 0;
    while(_g < points.length) {
        var p = points[_g];
        ++_g;
        p.x += (Math.random() - .5) * amount.x;
        p.y += (Math.random() - .5) * amount.y;
    }
    return points;
}
biga.utils.GeomUtils = function() { }

biga.utils.GeomUtils.__name__ = ["biga","utils","GeomUtils"];
biga.utils.GeomUtils.angle = function(p0,p1) {
    return Math.atan2(p1.y - p0.y,p1.x - p0.x);
}
biga.utils.GeomUtils.angleDifference = function(a0,a1) {
    var difference = a1 - a0;
    while(difference < -Math.PI) difference += Math.PI * 2;
    while(difference > Math.PI) difference -= Math.PI * 2;
    return difference;
}
biga.utils.GeomUtils.anglePositive = function(p0,p1) {
    var a = biga.utils.GeomUtils.angle(p0,p1);
    return (a % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
}
biga.utils.GeomUtils.slope = function(p0,p1) {
    return (p1.y - p0.y) / (p1.x - p0.x);
}
biga.utils.GeomUtils.distance = function(p0,p1) {
    return Math.sqrt(biga.utils.GeomUtils.squareDistance(p0.x,p0.y,p1.x,p1.y));
}
biga.utils.GeomUtils.squareDistance = function(x0,y0,x1,y1) {
    return (x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1);
}
biga.utils.GeomUtils.toFixed = function(value,step) {
    if(step == null) step = 10;
    return Math.floor(value * step) / step;
}
biga.utils.GeomUtils.snap = function(value,step) {
    return Math.floor(value / step) * step;
}
biga.utils.GeomUtils.clamp = function(value,min,max) {
    return value < min?min:value > max?max:value;
}
biga.utils.GeomUtils.lerp = function(t,a,b) {
    return a + (b - a) * t;
}
biga.utils.GeomUtils.normalize = function(value,a,b) {
    return (value - a) / (b - a);
}
biga.utils.GeomUtils.map = function(value,min1,max1,min2,max2) {
    return biga.utils.GeomUtils.lerp(biga.utils.GeomUtils.normalize(value,min1,max1),min2,max2);
}
biga.utils.GeomUtils.getPointAt = function(t,points,p,loop) {
    if(loop == null) loop = false;
    var length = points.length;
    if(!loop) length--;
    var i = Math.floor(length * t);
    var delta = 1 / length;
    t = (t - i * delta) / delta;
    if(p == null) p = new Point(biga.utils.GeomUtils.lerp(t,points[i].x,points[(i + 1) % points.length].x),biga.utils.GeomUtils.lerp(t,points[i].y,points[(i + 1) % points.length].y)); else {
        p.x = biga.utils.GeomUtils.lerp(t,points[i].x,points[(i + 1) % points.length].x);
        p.y = biga.utils.GeomUtils.lerp(t,points[i].y,points[(i + 1) % points.length].y);
    }
    return p;
}
biga.utils.GeomUtils.determinant = function(p,a,b) {
    return (a.x - b.x) * (p.y - b.y) - (p.x - b.x) * (a.y - b.y);
}
biga.utils.GeomUtils.isLeft = function(p,a,b) {
    return biga.utils.GeomUtils.determinant(p,a,b) >= 0;
}
biga.utils.GeomUtils.isRight = function(p,a,b) {
    return biga.utils.GeomUtils.determinant(p,a,b) <= 0;
}
biga.utils.GeomUtils.normalizeVector = function(p) {
    return new Point(p.x / p.get_length(),p.y / p.get_length());
}
biga.utils.GeomUtils.dotProduct = function(u,v) {
    return u.x * v.x + u.y * v.y;
}
biga.utils.GeomUtils.crossProduct = function(u,v) {
    return u.x * v.y - u.y * v.x;
}
biga.utils.GeomUtils.center = function(p0,p1) {
    return new Point(p0.x + (p1.x - p0.x) / 2,p0.y + (p1.y - p0.y) / 2);
}
biga.utils.GeomUtils.normal = function(p0,p1) {
    return new Point(-(p1.y - p0.y),p1.x - p0.x);
}
biga.utils.GeomUtils.leftNormal = function(p0,p1) {
    return new Point(p0.x + (p1.y - p0.y),p0.y - (p1.x - p0.x));
}
biga.utils.GeomUtils.rightNormal = function(p0,p1) {
    return new Point(p0.x - (p1.y - p0.y),p0.y + (p1.x - p0.x));
}
biga.utils.GeomUtils.reflect = function(p,a,b) {
    var n = biga.utils.GeomUtils.normal(a,b);
    n.normalize(1);
    var dot2 = 2 * biga.utils.GeomUtils.dotProduct(p,n);
    return new Point(p.x - dot2 * n.x,p.y - dot2 * n.y);
}
biga.utils.GeomUtils.bounceVector = function(p0,p1,l0,l1,PasSegment,LasSegment) {
    if(LasSegment == null) LasSegment = true;
    if(PasSegment == null) PasSegment = false;
    var pp = biga.utils.GeomUtils.lineIntersectLine(p0,p1,l0,l1,PasSegment,LasSegment);
    if(pp != null) {
        var n = biga.utils.GeomUtils.normal(l0,l1).add(pp);
        var m = biga.utils.GeomUtils.reflect(pp.subtract(p1),pp,n).add(pp);
        return [pp,m,m.subtract(pp)];
    }
    return null;
}
biga.utils.GeomUtils.pointLineDistance = function(p,a,b) {
    return biga.utils.GeomUtils.distance(p,biga.utils.GeomUtils.project(p,a,b));
}
biga.utils.GeomUtils.project = function(p,a,b,asSegment) {
    if(asSegment == null) asSegment = true;
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    if(asSegment && dx == 0 && dy == 0) return a;
    var t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy);
    if(asSegment && t < 0) return a; else if(asSegment && t > 1) return b; else return new Point(a.x + t * dx,a.y + t * dy);
    return null;
}
biga.utils.GeomUtils.getClosestPointInList = function(p,list) {
    if(list.length <= 0) return null;
    if(list.length == 1) return list[0];
    var dist;
    var min = Math.POSITIVE_INFINITY;
    var closest = null;
    var item;
    var _g = 0;
    while(_g < list.length) {
        var item1 = list[_g];
        ++_g;
        if(item1 == p) continue;
        if(item1.equals(p)) return item1;
        dist = biga.utils.GeomUtils.squareDistance(p.x,p.y,item1.x,item1.y);
        if(dist < min) {
            min = dist;
            closest = item1;
        }
    }
    return closest;
}
biga.utils.GeomUtils.lineIntersectLine = function(A,B,E,F,ABasSeg,EFasSeg) {
    if(EFasSeg == null) EFasSeg = true;
    if(ABasSeg == null) ABasSeg = true;
    var a1, a2, b1, b2, c1, c2;
    a1 = B.y - A.y;
    b1 = A.x - B.x;
    a2 = F.y - E.y;
    b2 = E.x - F.x;
    var denom = a1 * b2 - a2 * b1;
    if(denom == 0) return null;
    c1 = B.x * A.y - A.x * B.y;
    c2 = F.x * E.y - E.x * F.y;
    biga.utils.GeomUtils.ip = new Point();
    biga.utils.GeomUtils.ip.x = (b1 * c2 - b2 * c1) / denom;
    biga.utils.GeomUtils.ip.y = (a2 * c1 - a1 * c2) / denom;
    if(A.x == B.x) biga.utils.GeomUtils.ip.x = A.x; else if(E.x == F.x) biga.utils.GeomUtils.ip.x = E.x;
    if(A.y == B.y) biga.utils.GeomUtils.ip.y = A.y; else if(E.y == F.y) biga.utils.GeomUtils.ip.y = E.y;
    if(ABasSeg) {
        if(A.x < B.x?biga.utils.GeomUtils.ip.x < A.x || biga.utils.GeomUtils.ip.x > B.x:biga.utils.GeomUtils.ip.x > A.x || biga.utils.GeomUtils.ip.x < B.x) return null;
        if(A.y < B.y?biga.utils.GeomUtils.ip.y < A.y || biga.utils.GeomUtils.ip.y > B.y:biga.utils.GeomUtils.ip.y > A.y || biga.utils.GeomUtils.ip.y < B.y) return null;
    }
    if(EFasSeg) {
        if(E.x < F.x?biga.utils.GeomUtils.ip.x < E.x || biga.utils.GeomUtils.ip.x > F.x:biga.utils.GeomUtils.ip.x > E.x || biga.utils.GeomUtils.ip.x < F.x) return null;
        if(E.y < F.y?biga.utils.GeomUtils.ip.y < E.y || biga.utils.GeomUtils.ip.y > F.y:biga.utils.GeomUtils.ip.y > E.y || biga.utils.GeomUtils.ip.y < F.y) return null;
    }
    return biga.utils.GeomUtils.ip;
}
biga.utils.GeomUtils.raySegmentIntersection = function(a,b,c,d) {
    var x1_ = a.x, y1_ = a.y, x2_ = b.x, y2_ = b.y, x3_ = c.x, y3_ = c.y, x4_ = d.x, y4_ = d.y;
    var p = null;
    var r, s, d1;
    if((y2_ - y1_) / (x2_ - x1_) != (y4_ - y3_) / (x4_ - x3_)) {
        d1 = (x2_ - x1_) * (y4_ - y3_) - (y2_ - y1_) * (x4_ - x3_);
        if(d1 != 0) {
            r = ((y1_ - y3_) * (x4_ - x3_) - (x1_ - x3_) * (y4_ - y3_)) / d1;
            s = ((y1_ - y3_) * (x2_ - x1_) - (x1_ - x3_) * (y2_ - y1_)) / d1;
            if(r >= 0) {
                if(s >= 0 && s <= 1) p = new Point(x1_ + r * (x2_ - x1_),y1_ + r * (y2_ - y1_));
            }
        }
    }
    return p;
}
biga.utils.GeomUtils.axisReflect = function(p,a,b,target) {
    if(target == null) target = new Point(p.x,p.y);
    var pp = biga.utils.GeomUtils.project(p,a,b,false);
    target.x += (pp.x - p.x) * 2;
    target.y += (pp.y - p.y) * 2;
    return target;
}
biga.utils.GeomUtils.removeDuplicates = function(points) {
    var _g1 = 0, _g = points.length;
    while(_g1 < _g) {
        var i = _g1++;
        var j = i + 1;
        while(j < (points.length | 0)) {
            if(points[i].equals(points[j])) {
                points.splice(j,1);
                if(j > i + 1) {
                    j--;
                    continue;
                }
            }
            j++;
        }
    }
    return points;
}
biga.utils.PolygonUtils = function() { }

biga.utils.PolygonUtils.__name__ = ["biga","utils","PolygonUtils"];
biga.utils.PolygonUtils.centroid = function(points,p) {
    if(p == null) p = new Point();
    var _g = 0;
    while(_g < points.length) {
        var o = points[_g];
        ++_g;
        p.x += o.x;
        p.y += o.y;
    }
    p.x /= points.length;
    p.y /= points.length;
    return p;
}