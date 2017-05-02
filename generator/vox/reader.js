var str = "tylhobbs MacTuitui P_Malin ?FogleBird ?pissang1 ?mystaticself ?M_PF ?Flexi23 ?JoanieLemercier ?inconvergent ?WilliamChyr ?mariuswatz ? xorxor_hu ?hyper_glu ?AdrienMClaireB ?laserberg ?AtticusBones ?_kzr ?aiekick ?wearekuva ?ExUtumno generateme_blog ?genekogan ?wearenocomputer ? _Nick_Taylor ?cupe_cupe ?eddietree ?albertomoss ?ariweinkle ?hughskennedy ?TatumCreative ?akirodic ?RavenKwok ?patriciogv ?cornusammonis ? mflux ?legomushroom ?roland_huf ?prideout ?p01 ?liabru ?kenji_special ?mattdesl ?lennyjpg ?dbtwr ?gordonnl ?kyndinfo ?edankwan ?evanbbb? novastructura ?thespite ?moebio ?alteredq ?marcinignac ?BlurSpline ?philogb ?wblut ?toxi ?RezaAli ?soulwire ?oosmoxiecode ?felixturner ?marpi_ ? subblue ?grgrdvrt ?quasimondo"

var html = ""
str.split( ' ' ).forEach( function( s ){
    s = s.replace( '?', '');
    html += '<a href="https://twitter.com/' + s +'" target="_blank">'+s+'</a> ';
});
console.log( html )