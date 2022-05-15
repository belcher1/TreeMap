let height = 500;
let width = 500;

let movieDataURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';

let svg = d3.select('#tree-map')
            .append('svg')
            .attr('height', height)
            .attr('width', width)
            .append('g');

d3.json(movieDataURL, function(data) {
    console.log(data);

    // // Find the total value for each genre
    // let genreArr = [];

    // data.children.forEach(genre => {
    //     genreArr.push({name: genre.name, value: 0});
    //     genre.children.forEach(movie => {
    //         // console.log(movie.value);

    //         genreArr.find(d => {return d.name == genre.name})['value'] += parseInt(movie.value);
    //     });
    // });

    // console.log(genreArr);

    // // Find the total for all genres
    // let total = 0;
    
    // genreArr.forEach(movie => {total += movie.value;})
    // console.log(total);

    // Calculate the value / size of each movie genre
    let genres = d3.hierarchy(data).sum(d => {return d.value;});
    console.log(genres);

    // Calculate the position of each element
    d3.treemap().size([width, height])(genres);
    console.log(genres);

    // Tooltip
    let tooltip = d3.select('#tree-map')
                    .append('div')
                    .attr("class", "tooltip")
                    .attr('id', 'tooltip')
                    .style("opacity", 0)
                    .style("background-color", "white")
                    .style("border", "solid")
                    .style("border-width", "2px")
                    .style("border-radius", "5px")
                    .style("padding", "5px");

    var mouseover = function(d) {
        tooltip.style("opacity", 1)
    }
    var mousemove = function(d) {
        // console.log(d3.mouse(this)[0]);

        tooltip.style("left", (d3.mouse(this)[0]) + "px")
                .style("top", (d3.mouse(this)[1]) + "px")
                .html('Movie: ') //+ d.data.name + '<br>' + 'Sales: $' + d.data.value)
                .attr("data-value", d.data.value)
    }
    var mouseleave = function(d) {
        tooltip.style("opacity", 0);
    }         

    svg.selectAll('rect')
        .data(genres.leaves())
        .enter()
        .append('rect')
        .attr('class', 'tile')
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .attr('data-name', function(d) {return d.data.name;})
        .attr('data-category', function(d) {return d.data.category;})
        .attr('data-value', function(d) {return d.data.value;})
        .style("fill", function(d) {
            let genre = d.data.category;

            switch (genre) {
                case 'Action':
                    return 'blue';
                case 'Drama':
                    return 'indigo'
                case 'Adventure':
                    return 'purple';
                case 'Family':
                    return 'pink';
                case 'Animation':
                    return 'red';
                case 'Comedy':
                    return 'orange';
                case 'Biography':
                    return 'green';
                default:
                    break;
            }
        })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
    
    // Movie titles...

    // Legend
    let legend = d3.select('#legend') 
                    .append('svg')
                    .attr('height', 60)
                    .attr('width', 500);
    
    let legendArr = ['Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Drama', 'Family'];
    let colorArr = ['blue', 'purple', 'red', 'green', 'orange', 'indigo', 'pink'];
    let rowArr = [0, 0, 0, 0, 1, 1, 1];

    let side = 20;
    let spacing = 125;

    legend.selectAll('rect')
            .data(legendArr)
            .enter()
            .append('rect')
            .attr('class', 'legend-item')
            .attr('y', function(d, i) {return 10 + 30 * rowArr[i]})
            .attr('x', function(d, i) {
                if(!rowArr[i]) {
                    return i * spacing;
                }
                else {
                    return (i-4) * spacing;
                }
            })
            .attr('height', side)
            .attr('width', side)
            .attr('fill', function(d, i) {return colorArr[i]})

    legend.selectAll('text')
            .data(legendArr)
            .enter()
            .append('text')
            .attr('y', function(d, i) {return 26 + 30 * rowArr[i]})
            .attr('x', function(d, i) {
                if(!rowArr[i]) {
                    return i * spacing + 25;
                }
                else {
                    return (i-4) * spacing + 25;
                }
            })
            .text(function(d) {return d;})
            .attr('fill', function(d, i) {return colorArr[i]})
        
});
            