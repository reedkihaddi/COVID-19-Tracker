import React, { useState, useEffect } from "react";
import { fetchDailyData_Chart, } from '../../api';
import * as d3 from "d3";
import './LineChart.css';
import { listState } from '../CountryPicker/CountryPicker';

//confirmed,deceased,recovered
function GetDataAll() {

    const [DataAll, setDataAll] = useState([]);

    useEffect(() => {
        const fetchAPIAll = async () => {
            setDataAll(await fetchDailyData_Chart('MH'));
        }
        fetchAPIAll();
    }, []);

    return (
        <div>
            <div className="LineChart">
                <LineChart DataAll={DataAll} />
            </div>
        </div>)
}


function LineChart(props) {
    //console.log(props.DataAll)
    if (props.DataAll[0]) {
        //console.log(props.DataAll)
        var margin = { top: 10, right: 10, bottom: 10, left: 10 },
            width = 1200 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        var dataGroup = d3.nest()
            .key(function (d) {
                return d.state;
            })
            .entries(props.DataAll)

        var svg = d3.select(".LineChart")
            .attr('id', 'LineChart')
            .append("svg")
            .classed('my-svg-chart', true)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .call(responsivefy)
            // .attr("viewBox", "0 0 " + width + " " + height )
            // .attr("preserveAspectRatio", "xMidYMid meet")
            .append("g")
            .attr("transform", "translate(" + width / 8 + "," + -10 + ")");

        var dataGroup = d3.nest()
            .key(function (d) {
                return d.state;
            })
            .entries(props.DataAll)

        function make_y_gridline() {
            return d3.axisLeft(y).ticks(3)
        }

        var x = d3.scaleTime()
            .domain(d3.extent(props.DataAll, function (d) { return d.date }))
            .range([0, width - width / 6 - width / 4]);


        var y = d3.scaleLinear()
            .domain(d3.extent(props.DataAll, function (d) { return d.confirmed }))
            .range([height, 100])
        svg.append('g')
            .classed('y-axis', true)
            .call(d3.axisLeft(y).ticks(4).tickSize(0).tickPadding(5).tickFormat(function (d) {
                if ((d / 1000) >= 0.5) {
                    d = d / 1000 + "k";
                }
                return d;
            }));

        svg.append('g')
            .attr('class', 'grid')
            .call(make_y_gridline().tickSize(-width + width / 6 + width / 4).tickSizeOuter(0).tickFormat(""))

        var lineGenConfirmed = d3.line()
            .curve(d3.curveBasis)
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d.confirmed);
            });

        dataGroup.forEach(function (d, i) {
            svg.append('path')
                .attr('id', 'line')
                .attr('d', lineGenConfirmed(d.values))
                .attr('stroke', '#007BFF')
                .attr('stroke-width', 2.5)
                .attr('fill', 'none')
                .on('mouseover', console.log(1))

        });
        var lineGenDeceased = d3.line()
            .curve(d3.curveBasis)
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d.deceased);
            });

        dataGroup.forEach(function (d, i) {
            svg.append('path')
                .attr('id', 'line')
                .attr('d', lineGenDeceased(d.values))
                .attr('stroke', '#6C757D')
                .attr('stroke-width', 2.5)
                .attr('fill', 'none')

        });
        var lineGenRecovered = d3.line()
            .curve(d3.curveBasis)
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d.recovered);
            });

        dataGroup.forEach(function (d, i) {
            svg.append('path')
                .attr('id', 'line')
                .attr('d', lineGenRecovered(d.values))
                .attr('stroke', '#28A745')
                .attr('stroke-width', 2.5)
                .attr('fill', 'none')

        });

        svg.append("text")
            .classed('label', true)
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - 6 * margin.left)
            .attr("x", 0 - (height / 2)-40)
            .attr("dy", "1em")
            .style('font-size', '0.75rem')
            .style("text-anchor", "middle")
            .text("Daily new Cases");

        var len = props.DataAll.length - 1
        var date = props.DataAll[len].date
        var cirlce_y = [props.DataAll[len].confirmed, props.DataAll[len].recovered, props.DataAll[len].deceased]
        var color = ["#007BFF", "#28A745", "#6C757D"]
        var keys_legend = ["Confirmed", "Recovered", "Deceased"]

        svg.selectAll("mydots")
            .data(keys_legend)
            .enter()
            .append("circle")
            .attr("cx", function (d, i) { return 40 + i * 100 })
            .attr("cy", 80) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 3)
            .style("fill", function (d, i) { return color[i] })

        // Add one dot in the legend for each name.
        svg.selectAll("mylabels")
            .data(keys_legend)
            .enter()
            .append("text")
            .attr("x", function (d, i) { return 50 + i * 100 })
            .attr("y", 80) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function (d, i) { return color[i] })
            .text(function (d) { return d })
            .style('font-size', '0.75rem')
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

        svg.selectAll('circle-chart')
            .data(cirlce_y)
            .enter().append("circle")
            .attr('id', 'circle')
            .attr('r', 3.5)
            .attr('cx', x(date))
            .attr('cy', function (d, i) { return y(cirlce_y[i]) })
            .style('fill', function (d, i) { return color[i] })

        svg.append('g')
            .classed('x-axis', true)
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x).ticks(4));


    }
    return null;
}

function responsivefy(svg) {
    // container will be the DOM element
    // that the svg is appended to
    // we then measure the container
    // and find its aspect ratio
    const container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style('width'), 10),
        height = parseInt(svg.style('height'), 10),
        aspect = width / height;

    // set viewBox attribute to the initial size
    // control scaling with preserveAspectRatio
    // resize svg on inital page load
    svg.attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMinYMid')
        .call(resize);

    // add a listener so the chart will be resized
    // when the window resizes
    // multiple listeners for the same event type
    // requires a namespace, i.e., 'click.foo'
    // api docs: https://goo.gl/F3ZCFr
    d3.select(window).on(
        'resize.' + container.attr('id'),
        resize
    );

    // this is the code that resizes the chart
    // it will be called on load
    // and in response to window resizes
    // gets the width of the container
    // and resizes the svg to fill it
    // while maintaining a consistent aspect ratio
    function resize() {
        const w = parseInt(container.style('width'));
        svg.attr('width', w);
        svg.attr('height', Math.round(w / aspect));
    }
}

export default GetDataAll;