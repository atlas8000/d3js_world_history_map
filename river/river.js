


disp_river=true;


function drawRivers(){


d3.json("../river/riverjson.php?f=all", function(error, rivers) {

if (error) 
return console.error(error);


console.log(rivers.features);

svg.append("g")
.attr("class","rivers")
.selectAll("path")
.data(rivers.features)
.enter()
.append("path")
.attr("class", "river")
.attr("d", path)

.on("mouseover",function(d,i){
var p=d3.mouse(this);
disp_river_name(p,d.properties.name);
});
});
}

function disp_river_name(p,name){
if(disp_river){
var tooltip = d3.select("#tooltip")
.style("left", p[0] + "px")
.style("top", p[1] + "px");

tooltip.select("#status")
.text(name);

d3.select("#tooltip").classed("hidden", false);
}
}


drawRivers();


d3.timer(function() {

  svg.selectAll(".river")
.attr("d", path)
.attr("stroke-width", function(d){
  if(cur_scale>county_scale)
  return 8;
  else if(cur_scale>province_scale)
  return 4;
  return 2;
})
.style("opacity",function(d){



var offset=Math.round(cur_angle+180)+360;
if(offset>0)
offset=offset % 360;
else
{offset=0-((0-offset) % 360);}

var c=path.centroid(d);
c=projection.invert(c);
if(c==null)
return 0;
var jingdu=Math.round(c[0]+180);

var angle= (jingdu + offset);
angle=angle % 360;

if( (angle>270 || angle<90) )
return 0.1;
else
{return 0.0;}
})
 ;

});
