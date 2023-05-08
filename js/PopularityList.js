// Add a responsive SVG
const listSvg = d3.select("body")
    .append("div")
    .attr("class","list-container")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + xSize + " " + ySize)
    .append("g")
    .attr("transform","translate(" + margin + "," + 75 + ")");

//Updates the current list of most popular songs

function updateList(data,yearList){

    // Fade out old text
    listSvg.selectAll("text")
        .attr("opacity",1)
        .transition()
        .duration(transitionSpeed)
        .attr("opacity",0)

    // Append header
    listSvg.append("text")
        .attr("x", xMax/2)
        .attr("y",-50)
        .attr("class","listLabel")
        .text("Most Popular Songs from " + d3.min(yearList) + " to " + d3.max(yearList))
        .attr("text-anchor","middle")
        .style("font-weight", "bold")
        .attr("opacity",0)
        .transition()
        .duration(transitionSpeed)
        .attr("opacity",1);
    
    
    d3.selectAll(".listitem")
        .remove();
    

    // Initialise the preview with the most popular song
    initPreview(data[0])
    
    for(let i = 0; i<data.length; i++){

        // Append each item to the list
        listSvg.append("text")
            .attr("x", -125)
            .attr("y",(75 * i))
            .attr("class","listitem")
            .style("font-size",()=>12+"px")
            .style("font-weight", "bold")
            .style("fill", "#191414")
            .text((i+1) + ". " + data[i].name)
            .on("mouseover",function(){
                // on mouseover, update the preview
                initPreview(data[i]);
            });
    }
   
}


//appends the text for each individual song

function initPreview(data){

    // Remove the old label
    d3.selectAll(".previewText")
        .remove();

    // ----- Append new labels -----
    listSvg.append("text")
        .attr("class","previewText")
        .attr("x",xMax+10)
        .attr("y",70)
        .text("Artist(s): " + data.artists)
        .attr("text-anchor","middle")
    
    listSvg.append("text")
        .attr("class","previewText")
        .attr("x",xMax+10)
        .attr("y",100)
        .text("Popularity: " + data.popularity)
        .attr("text-anchor","middle")
    
    listSvg.append("text")
        .attr("class","previewText")
        .attr("x",xMax+10)
        .attr("y",130)
        .text("Released: " + data.release_date)
        .attr("text-anchor","middle")

}


