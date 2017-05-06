var Point = function (x, y) {
    this.x = (x) || 0;
    this.y = (y) || 0;
    return this;
};
Point.prototype = {
    add : function(p){
        this.x += p.x;
        this.y += p.y;
        return this;
    },
    sub : function(p){
        this.x -= p.x;
        this.y -= p.y;
        return this;
    },
    clone : function(){
        return new Point(this.x, this.y);
    },
    copy : function(p){
        this.x = p.x;
        this.y = p.y;
        return this;
    },
    set : function(x,y){
        this.x = x;
        this.y = y;
        return this;
    },
    length : function(){
        return Math.sqrt( this.x * this.x + this.y * this.y );
    },
    normalize : function( value ){
        var l = this.length();
        this.x/=l;
        this.y/=l;
        if( value != null )this.multiplyScalar(value);
        return this;
    },
    multiplyScalar : function( value ){
        this.x*= value;
        this.y*= value;
        return this;
    },
    direction : function( other ){
        return other.clone().sub(this).normalize();
    },
    negate : function(){
        this.x *= -1;this.y *= -1;return this;
    },
    dot : function ( p ){
        return this.x * p.x + this.y * p.y;
    },
    equals:function(other){
        return this.x == other.x && this.y == other.y;
    },
    midpoint:function(other){
        return new Point( (this.x + other.x) / 2, (this.y + other.y) / 2);
    }
};


function getAngle(a,b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.atan2(dy, dx);
}

function getDistance(a,b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx*dx + dy*dy);
}