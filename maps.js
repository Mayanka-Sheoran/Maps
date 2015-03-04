var width = 960,
    height = 500;

var path = d3.geo.path();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(d3.behavior.zoom().on("zoom", draw))
    .append('g');

function draw() {
    svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip");


var states = {};
var neighbours = {};
var neighbours1 = {};
var counties = {};


var clickmanager = function(slider) {

    x = slider.value;

    if (x == 100) {
        changedColor();
    } else {
        changedColor2();
    }
}


d3.json("us.json", function(error, topology) {
    states = topojson.feature(topology, topology.objects.states).features,
        neighbors = topojson.neighbors(topology.objects.states.geometries);

    counties = topojson.feature(topology, topology.objects.counties).features,
        neighbors1 = topojson.neighbors(topology.objects.counties.geometries);

    svg.selectAll("path")
        .data(topojson.feature(topology, topology.objects.counties).features)
        .enter().append("path")
        .attr("d", path)


    svg.selectAll(".counties")
        .data(counties)
        .enter().insert("path")
        .attr("class", "counties")
        .attr("d", path)




});

var changedColor = function() {
    var color = d3.scale.category10();
    svg.selectAll(".counties")
        .style("fill", function(d, i) {
            return color(d.color = d3.max(neighbors1[i], function(n) {
                return counties[n].color;
            }) + 1 | 0);
        });
}

var changedColor2 = function() {
    var color = d3.scale.category20();
    svg.selectAll(".counties")
        .style("fill", function(d, i) {
            return color(d.color = d3.max(neighbors1[i], function(n) {
                return counties[n].color;
            }) + 1 | 0);
        });
}
