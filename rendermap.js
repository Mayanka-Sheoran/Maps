map.rendermap = (function() {
    var width = 960,
    height = 500;

    var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip");


    var states = {};
    var neighbours = {};
    var neighbours1 = {};
    var counties = {};

    var path = d3.geo.path();

    var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(d3.behavior.zoom().scaleExtent([0.5, 15]).on("zoom", draw))
    .append('g');

    function draw() {
        svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }




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



        d3.tsv("us_country_names.tsv", function(error, data) {
            n = states.length;

            states.forEach(function(d, i) {
                d.id = data[i]["id  code  name"].split("  ")[1];
                d.name = data[i]["id  code  name"].split("  ")[2];

            });


        });

        var state = svg.selectAll(".states").data(states);

        state

        .enter().insert("path")
        .attr("class", "states")
        .attr("d", path)
        .attr("title", function(d, i) {
            return d.name;
        })

        state
        .on("mouseover", function(d, i) {
            var mouse = d3.mouse(svg.node()).map(function(d) {
                return parseInt(d);
            });

            tooltip
            .classed("hidden", false)
            .attr("style", "left:" + (mouse[0] + 25) + "px;top:" + mouse[1] + "px")
            .html(d.name)
        })
        .on("mouseout", function(d, i) {
            tooltip.classed("hidden", true)
        });



    });



var changedColor = function() {
    var color = d3.scale.category10();

    svg.selectAll(".states")
    .style("fill", function(d, i) {
        return color(d.color = d3.max(neighbors[i], function(n) {
            return states[n].color;
        }) + 1 | 0);
    });
}

var changedColor2 = function() {
    var color = d3.scale.category20();

    svg.selectAll(".states")
    .style("fill", function(d, i) {
        return color(d.color = d3.max(neighbors[i], function(n) {
            return states[n].color;
        }) + 1 | 0);
    });
}
return {
    clickmanager: clickmanager
}

})();
