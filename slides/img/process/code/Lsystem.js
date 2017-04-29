var Turtle = function( x, y, angle ){
    this.x = x || 0;
    this.y = y || 0;
    this.angle = angle || 0;
};
Turtle.prototype = {
    clone : function(){
        return new Turtle( this.x, this.y );
    }
};

var Lsystem = function(axiom, rule, length, angle ) {

    this.axiom = axiom || "f+f";
    this.rule = rule || "f++f";
    this.production = "";

    this.length = length || 10;
    this.angle = angle || 0;

};

Lsystem.prototype = {

    process : function( ctx, char, turtle ){
        if (char == 'f'){
            turtle.x += Math.cos( turtle.angle ) * this.length;
            turtle.y += Math.sin( turtle.angle ) * this.length;
            ctx.lineTo( turtle.x, turtle.y );
        }
        else if (char == '+')
        {
            turtle.angle += this.angle;
        }
        else if (char == '-')
        {
            turtle.angle -= this.angle;
        }
    },

    render : function( ctx ){

        var turtle = new Turtle(0,0);
        var tmp = new Turtle();

        ctx.save();
        ctx.translate( ctx.canvas.width / 2, ctx.canvas.height / 2 );
        ctx.beginPath();

        for ( var i = 1; i < this.production.length; i++){

            var char = this.production.charAt( i ).toLowerCase();

            if ( char == 'f' || char == '+' || char == '-' ){
                this.process( ctx, char, turtle );
            }

            if ( char == '[' ){

                if ( this.production.substr( i+1, this.production.length ).lastIndexOf( ']' ) == -1 ) continue;

                tmp = turtle.clone();
                while ( char != ']'){
                    char = this.production.charAt( i++ );
                    this.process( ctx, char, tmp );
                }

                ctx.arc( turtle.x, turtle.y, 2, 0, Math.PI * 2 );
                ctx.moveTo( turtle.x, turtle.y );

            }
        }
        ctx.stroke();
        ctx.restore();
    },


    compute : function( gens ){
        this.production = this.axiom.toLowerCase();
        var prod;
        var generations = 0;
        while ( generations < gens ){

            prod = '';
            for ( var i = 0; i < this.production.length; i++ ){

                if( this.production.charAt( i ) == 'f' ){
                    prod += this.rule;
                }else{
                    prod += this.production.charAt( i );
                }
            }
            this.production = prod;
            generations++;
        }
    }
};


