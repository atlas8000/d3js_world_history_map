


var disp_region=true;


var basic_map_colored=true;


var width = 1000,
height = 500;


if(width<screen.availWidth)
width=screen.availWidth+10;

if(height<screen.availHeight)
height=screen.availHeight-100;


var speed_o=0.002;
var speed = speed_o;


var init_angle=180;
var cur_angle=init_angle;


var init_tilt=-20;
var cur_tilt=init_tilt;

var startTime = Date.now();
var currentTime = Date.now();


var scale=300;

var cur_scale=scale;


var min_scale=100;

var max_scale=400000;

var province_scale=2000;

var county_scale=4000;


var mouseX=0,mouseY=0;


var color=d3.scale.category20();



var zoom = d3.behavior.zoom()
.scaleExtent([0.5, 40])
.on("zoom", zoomed)
;

var drag=d3.behavior.drag()
.on("drag",dragmove)
.on("dragstart",dragstart);


var svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height)
.call(drag);


var projection = d3.geo.orthographic()
.translate([width/2, height/2])
.scale( scale)
;



















var sky_height=200;


var sky = d3.geo.orthographic()
    .translate([width / 2, height / 2])
    .clipAngle(90)
    .scale(scale+sky_height);





var rotate=0;


var graticule = d3.geo.graticule();


var gilbert=d3.geo.gilbert(projection);


var path = d3.geo.path()
.projection(projection).pointRadius(2);



var arc_active=false;



var grid = graticule();


console.log(grid);


var world = svg.append("g");


world.append("path")
.datum( grid )
.attr("id","grid_id")
.attr("class","grid_path")
.attr("d",path);



var provinces=null;

var can_refresh=true;



d3.timer(function() {

if(!can_refresh)
return;

currentTime = Date.now();

if(rotate==0){
cur_angle=speed * (currentTime - startTime)-init_angle;
projection.rotate([cur_angle, cur_tilt]).clipAngle(90);
sky.rotate([cur_angle, cur_tilt]).clipAngle(90);
}

svg.selectAll(".ocean")
.attr("d", path);

svg.selectAll("#grid_id")
.attr("d",path);

svg.selectAll(".world_path")
.attr("d",path);

svg.selectAll(".old_world_path")
.attr("d",path);

svg.selectAll(".china_path")
.attr("d",path);

svg.selectAll(".country_path")
.attr("d",path);

svg.selectAll(".province_path")
.attr("d",path);

svg.selectAll(".county_path")
.attr("d",path);
  
refresh();


});



svg.append("rect")
.attr("class","overlay")
.attr("x",0)
.attr("y", 0)
.attr("width",width)
.attr("height",height)
.call(zoom)
.on("mousedown.zoom",null)
.on("click",function(d,i){
d3.event.stopPropagation();
if(rotate==1){
rotate=0;
init_angle=0-cur_angle;
startTime = Date.now();
}else if(rotate==0)
rotate=1;
})
;


var statusText = svg.append("text")
.attr("class","statusText")


.attr("x", 900)
.attr("y", 15)
.text("---")

;



function zoomed() {
rotate=1;
cur_scale=scale*d3.event.scale*2;
speed=speed_o/d3.event.scale;

if(cur_scale<min_scale)
cur_scale=min_scale;
else if(cur_scale>max_scale)
cur_scale=max_scale;

if(cur_scale<county_scale)
d3.selectAll(".county_path").remove();

if(cur_scale<province_scale)
d3.selectAll(".province_path").remove();

projection.scale(cur_scale);
projection.rotate([cur_angle, cur_tilt]).clipAngle(90);

sky.scale(cur_scale+sky_height);
sky.rotate([cur_angle, cur_tilt]).clipAngle(90);

statusText.text("min_scale="+min_scale+" cur_scale="+cur_scale+" max_scale="+max_scale);


}


function dragstart(){
var p = d3.mouse(this);
mouseX=p[0];
}


function dragmove(){
rotate=1;
var r=d3.event.dx*scale/cur_scale/10+cur_angle;

cur_tilt=-d3.event.dy*scale/cur_scale/10+cur_tilt;

if(cur_tilt<-60)
cur_tilt=-60;
else if(cur_tilt>40)
cur_tilt=40;

projection.rotate([r, cur_tilt]);
sky.rotate([r, cur_tilt]);

cur_angle=r;

}



function refresh() {
  
  svg.selectAll(".point")
.attr("d", path);
  
  svg.selectAll(".arc")
.attr("d", path)
    .attr("opacity", function(d) {
        return fade_at_edge(d)
    })

}




