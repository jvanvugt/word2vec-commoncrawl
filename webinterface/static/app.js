if (!fetch) {
    alert('Please download a modern browser (Mozilla Firefox, Google Chrome, etc.)');
}

function findSynonyms() {
    let submitButton = document.getElementById('synonym-submit');
    disableButton(submitButton);
    let input = document.getElementById('word').value;
    let errorMessage = document.getElementById('error-message');
    errorMessage.innerHTML = '';
    if (input === '') {
        errorMessage.innerHTML = "Please enter a word";
        enableButton(submitButton);
        return;
    }

    fetch('/synonyms/' + input)
        .then(response => {
            if (response.status === 403) {
                response.json().then((response) => {
                    errorMessage.innerHTML = response.error;
                    enableButton(submitButton)
                });
            } else {
                response.json().then(response => {
                    updateTable(response);
                    enableButton(submitButton)
                });
            }
        });
}

function disableButton(button) {
    button.oldText = button.innerHTML;
    button.innerHTML += '...';
    button.disabled = true;
}

function enableButton(button) {
    button.disabled = false;
    button.innerHTML = button.oldText;
}

function updateTable(response) {
    let table = document.getElementById('synonym-table');
    let rows = table.rows;
    let synonyms = response.synonyms;
    for (let i = 0; i < synonyms.length; i++) {
        let cells = rows[i + 1].cells; // headers are the first row
        cells[0].innerHTML = synonyms[i][0];
        cells[1].innerHTML = synonyms[i][1];
    }  
}

// Scatter plot inspired by http://bl.ocks.org/peterssonjonas/4a0e7cb8d23231243e0e
var margin = { top: 50, right: 300, bottom: 50, left: 50 },
outerWidth = 1050,
outerHeight = 500,
width = outerWidth - margin.left - margin.right,
height = outerHeight - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]).nice();

var y = d3.scale.linear()
    .range([height, 0]).nice();

d3.csv("/static/embeddings.csv", function(data) {
    data.forEach(function(d) {
        d.x = +d.x;
        d.y = +d.y;
    });

    x.domain([d3.min(data, d => d.x), d3.max(data, d => d.x)]);
    y.domain([d3.min(data, d => d.y), d3.max(data, d => d.y)]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickSize(-height);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickSize(-width);

    var color = d3.scale.category10();

    var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(d => d.word);

    var zoomBeh = d3.behavior.zoom()
        .x(x)
        .y(y)
        .scaleExtent([0, 500])
        .on("zoom", zoom);

    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", outerWidth)
        .attr("height", outerHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoomBeh);

    svg.call(tip);

    svg.append("rect")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
        .classed("x axis", true)
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .classed("label", true)
        .attr("x", width)
        .attr("y", margin.bottom - 10)
        .style("text-anchor", "end")
        .text('x');

    svg.append("g")
        .classed("y axis", true)
        .call(yAxis)
        .append("text")
        .classed("label", true)
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text('y');

    var objects = svg.append("svg")
        .classed("objects", true)
        .attr("width", width)
        .attr("height", height);

    objects.append("svg:line")
        .classed("axisLine hAxisLine", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", width)
        .attr("y2", 0)
        .attr("transform", "translate(0," + height + ")");

    objects.append("svg:line")
        .classed("axisLine vAxisLine", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", height);

    objects.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .classed("dot", true)
        .attr("r", 5)
        .attr("transform", transform)
        .style("fill", 'green')
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);


    d3.select("input").on("click", change);

    function change() {
        let xMax = d3.max(data, function(d) { return d.x; });
        let xMin = d3.min(data, function(d) { return d.x; });
        let yMax = d3.max(data, function(d) { return d.y; });
        let yMin = d3.min(data, function(d) { return d.y; });

        zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));

        var svg = d3.select("#scatter").transition();

        svg.select(".x.axis").duration(750).call(xAxis).select(".label").text('x');

        objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
    }

    function zoom() {
        svg.select(".x.axis").call(xAxis);
        svg.select(".y.axis").call(yAxis);

        svg.selectAll(".dot")
            .attr("transform", transform);
    }

    function transform(d) {
        return "translate(" + x(d.x) + "," + y(d.y) + ")";
    }
});