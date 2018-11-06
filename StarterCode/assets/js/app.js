var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//create an SVG wrapper with css classes to support responsive sizing

  var svg = d3.select("div#container")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 960 500")
  .classed("svg-content", true);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.9,
        d3.max(data, d => d[chosenXAxis]) * 1.05
      ])
      .range([0, width]);
    return xLinearScale;
  }

// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis]) * .7,
      d3.max(data, d => d[chosenYAxis]) * 1.1
    ])
    .range([height, 0]);
  return yLinearScale;
}

  // function used for updating xAxis var upon click on axis label
  function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
    // function used for updating yAxis var upon click on axis label
    function renderYAxes(newYScale, yAxis) {
      var leftAxis = d3.axisLeft(newYScale);
    
      yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
      return yAxis;
    }
  // function used for updating circles group with a transition to
  // new circles for new x axis
  function renderXCircles(circlesGroup, newXScale, chosenXAxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }
  
    // function used for updating circles group with a transition to
  // new circles for new y axis
  function renderYCircles(circlesGroup, newYScale, chosenYAxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }

  // function used for updating (circles) text group with a transition to
  // new circles for x axis xhange
  function renderCTextX(cTextGroup, newXScale, chosenXaxis) {
  
    cTextGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis])-7);
  
    return cTextGroup;
  }

    // function used for updating (circles) text group with a transition to
  // new circles for y axis change
  function renderCTextY(cTextGroup, newYScale, chosenYAxis) {
  
    cTextGroup.transition()
      .duration(1000)
      .attr("y", d => newYScale(d[chosenYAxis])+4);
  
    return cTextGroup;
  }
  
  // function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  
    if (chosenXAxis === "poverty") {
      var xLabel = "In Poverty:";
    }
    else if (chosenXAxis === "income") {
      var xLabel = "Income: $";
    } 
    else {
      var xLabel = "Age : ";
    }
  
    if (chosenYAxis === "obesity") {
      var yLabel = "Obesity: ";
    }
    else if (chosenYAxis === "smokes") {
      var yLabel = "Smokes:";
    } 
    else {
      var yLabel = "Healthcare:";
    }

    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;

    }


  // Retrieve data from the CSV file and execute everything below
  var file = "assets/data/data.csv"
  d3.csv(file).then(successHandle, errorHandle);
  
  function errorHandle(error){
    throw error;
  }
  
  function successHandle(data) {
  
    console.log(data)
    
//     // parse data
    data.forEach(function(data) {
      data.age = +data.age;
      data.noHealthInsurance = +data.noHealthInsurance;
      data.income = +data.income;
      data.obesity = +data.obesity;
      data.poverty = +data.poverty;
      data.smokes = +data.smokes;
      data.population = +data.population;
    });
    console.log(data)

    // xLinearScale function above csv import
    var xLinearScale = xScale(data, chosenXAxis);
  
    // Create y scale function
    var yLinearScale = yScale(data, chosenYAxis);
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // append initial state abbr text
    var cTextGroup = chartGroup.selectAll("text").data(data).enter()
      .append("text")
      .attr("x", d => xLinearScale(d[chosenXAxis])-7)
      .attr("y", d => yLinearScale(d[chosenYAxis])+4)
      .attr("font-family", "san-serif")
      .attr("font-size", "10px")
      .attr("fill", "black")
      .text(d=> d.abbr)
      ;
  
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle").data(data).enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", d => d.population/2)
      .attr("fill", d => d.color)
      .attr("opacity", ".4")

    // append x axis
    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);


    // Create group for  3 x- axis labels
    var xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
    var povertyLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Poverty (%)");
  
    var ageLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median)");
  
    var incomeLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household Income (Median)");

    // append y axis    
    var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

    // Create group for  3 y- axis labels
    var ylabelsGroup = chartGroup.append("g")
      // .attr("transform", `translate(${width / 2}, ${height + 20})`);
      .attr("transform", "rotate(-90)")
      // .attr("transform", `translate( 0- ${margin.left}, ${height/2})`)
      // .attr("x", 0 - margin.left)
      // .attr("y", 0 + (height / 2))
      .attr("dy", "1em")
      .classed("axis-text", true);
  
    var obesityLabel = ylabelsGroup.append("text")
      .attr("x", -height/2)
      .attr("y", -80)
      .attr("value", "obesity") // value to grab for event listener
      .classed("active", true)
      .text("Obesity (%)");
  
    var smokesLabel = ylabelsGroup.append("text")
      .attr("x", -height/2)
      .attr("y", -60)
      .attr("value", "smokes") // value to grab for event listener
      .classed("inactive", true)
      .text("Smokes (%)");
  
    var noHealthInsuranceLabel = ylabelsGroup.append("text")
      .attr("x", -height/2)
      .attr("y", -40)
      .attr("value", "noHealthInsurance") // value to grab for event listener
      .classed("inactive", true)
      .text("Lacks Healthcare (%)");
  
    // updateToolTip for x function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // x axis labels event listener
    xlabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
  
          // replaces chosenXAxis with value
          chosenXAxis = value;
  
          // console.log(chosenXAxis)
  
          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(data, chosenXAxis);
  
          // updates x axis with transition
          xAxis = renderXAxes(xLinearScale, xAxis);
  
          // updates circles with new x values
          circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);

          // updates circle text with new x values
          cTextGroup = renderCTextX(cTextGroup, xLinearScale, chosenXAxis);
  
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
          // changes classes to change bold text
          if (chosenXAxis === "poverty") {
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "age") {
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
             .classed("active", true)
              .classed("inactive", false);
          }
        }
      });

    // y axis labels event listener
    ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(data, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

        // updates circle text with new x values
        cTextGroup = renderCTextY(cTextGroup, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "obesity") {
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          noHealthInsuranceLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "smokes") {
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          noHealthInsuranceLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          noHealthInsuranceLabel
           .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
  }
  