var PRNG =
{

	a           : 16807,            /* multiplier */
	m           : 0x7FFFFFFF,        /* 2**31 - 1 */
	randomnum   : 1,
	div         : ( 1 / 0x7FFFFFFF ),

	nextlongrand : function( seed )
	{

		var lo,
			hi;

		lo = this.a * ( seed & 0xFFFF );
		hi = this.a * ( seed >> 16 );
		lo += ( hi & 0x7FFF ) << 16;

		if (lo > this.m)
		{
			lo &= this.m;
			++lo;
		}

		lo += hi >> 15;
		if (lo > this.m)
		{
			lo &= this.m;
			++lo;
		}

		return lo;

	},

	random : function ()/* return next random number */
	{

		this.randomnum = this.nextlongrand( this.randomnum );
		return this.randomnum * this.div;

	},

	setSeed : function( value )
	{

		this.randomnum = ( value <= 0 ) ? 1 : value;

	}
};