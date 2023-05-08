/* Get the 'limits' of the data - the full extent (mins and max)
so the plotted data fits perfectly */

let xExtentScat;
let yExtentScat;


//X Axis
let xScat = d3.scaleLinear();

//Y Axis
let yScat = d3.scaleLinear();

// Add a responsive SVG
const scatSvg = d3.select("body")
    .append("div")
    .attr("class","scatter-container")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + xSize + " " + ySize)
    .append("g")
    .attr("transform","translate(" + margin + "," + 75 + ")");

//Setup the axes, the axes do not need to be updated for this plot so this is run once on init 

function setupScatterAxes(data){

    xExtentScat = d3.extent( data, datum=>{ return datum.x } );
    yExtentScat = d3.extent( data, datum=>{ return datum.y } );

    //X Axis
    xScat.domain([ xExtentScat[0], xExtentScat[1] ])
        .range([0, xMax]);

    //Y Axis
    yScat.domain([ 0, yExtentScat[1] ])
        .range([ yMax, 0]);

    //Bottom axis
    scatSvg.append("g")
        .attr("transform", "translate(0," + yMax + ")")
        .attr("class","ScatterXaxis")
        .style("font-weight", "bold")
        .transition()
        .duration(transitionSpeed)
        .call(d3.axisBottom(xScat))

    //left y axis
    scatSvg.append("g")
        .attr("class","ScatterYaxis")
        .style("font-weight", "bold")
        .transition()
        .duration(transitionSpeed)
        .call(d3.axisLeft(yScat));


}

//Update the points on the chart

function updateScatterChart(data, category){

    var myColor = d3.scaleLinear().domain([0,212])
        .range(["dodgerblue","#1db954"]);
    
    // ----- Remove old labels and scatter points -----
    let arr = [];
    
    scatSvg.selectAll(".chartLabel")
        .data(arr)
        .exit()
        .remove();
    
    scatSvg.selectAll(".scatterPoint")
        .data(arr)
        .exit()
        .remove();

    // ----- Append chart title and axis labels -----

    scatSvg.append("text")
        .attr("x", xMax/2 - 50)
        .attr("y", yMax + 50)
        .attr("class","chartLabel")
        .style("font-weight", "bold")
        .text(category)

    scatSvg.append("text")
        .attr("x", "-137.5")
        .attr("y", yMax/2)
        .attr("class","chartLabel")
        .style("font-weight", "bold")
        .text("Tempo (bpm)")

    scatSvg.append("text")
        .attr("x", xMax/2)
        .attr("y",-50)
        .attr("class","chartLabel")
        .text(category + " against Tempo")
        .style("font-weight", "bold")
        .attr("text-anchor","middle")

    // Append the tooltip
    var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

    // Append new points
    scatSvg.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class","scatterPoint")
        .attr("cx", function (datum) { return xScat(datum.x) } ) // Set x and y values using the data
        .attr("cy", function (datum) { return yScat(datum.y) } )
        .attr("r", 5)
        .attr("fill", function(datum) { return myColor(datum.y) } ) // Set the color using the color scale passed in
        .attr("stroke","#212121")
        .attr("opacity","0.3")
        .on("mouseover",function(event,datum){

            // enlarge and decrease opacity
            d3.select(this)
                .transition()
                .duration(500)
                .ease(d3.easeBounce)
                .attr("opacity", "1")
                .attr("r",10);

            // Make the tooltip div appear and set its scale
            div.transition()		
                .duration(200)		
                .style("opacity", 0.7)
                .style("height","fit-content")
                .style("width","fit-content");	
            
            // Set the content for the tooltip
            div.html("<b>" + datum.z + "</b>" + "<br/>"  + category + ": "+ datum.x.toFixed(2) + "<br/>" + "Tempo: " + datum.y.toFixed(2))	
                .style("left", (event.pageX + 25) + "px")		
                .style("top", (event.pageY - 28) + "px");
           
    
        })
        .on("mouseout",function(){
            
            // Re-size the markers
            d3.select(this)
                .transition()
                .duration(500)
                .ease(d3.easeBounce)
                .attr("r",5)
                .attr("opacity","0.3");

            //Hide the tooltip
            div.transition()		
                .duration(500)		
                .style("opacity", 0);
            
        });
    

}