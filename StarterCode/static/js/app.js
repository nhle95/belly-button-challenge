//provided url path. use D3 library to read the samples.json
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"; 

//Using metadata to gather demographic info, create all required charts
function buildcharts(id){
    d3.json(url).then(function (data) {
       
        let metadata = data.metadata;
        let samples = data.samples;
        //filter for test id 
        let first_patient = metadata.filter(info => info.id == id)[0];
        let first_sample = samples.filter(info => info.id == id)[0];
        //bar and bubble chart variables from sample
        let sample_values = first_sample.sample_values;
        let otu_ids = first_sample.otu_ids;
        let otu_labels = first_sample.otu_labels;
        //wash frequency for the guage plot
        let washing_frequency = first_patient.wfreq;
        

        //build bar chart
        let bar_graph = [{
            //grab sample_values for x values
            x: sample_values.slice(0, 10).reverse(),
            // use sample_values for y values
            y: otu_ids.slice(0, 10).reverse().map(otu_id => `OTU ${otu_id}`),
           // text values
            text: otu_labels.slice(0,10).reverse(),
            type: 'bar',
            //make horizontal
            orientation: 'h'
        }];

        //bar chart layout
        let bar_layout = {
            title: "Top 10 OTU",
            xaxis: {title: 'Sample Values'}
        };
        
        Plotly.newPlot('bar', bar_graph, bar_layout);

        //bubble chart
        let bubble_graph = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                color: otu_ids,
                size: sample_values
            }
        }];
        //bubble chart layout
        let layout = {
            xaxis: {title: 'OTU ID'},
            yaxis: {title: 'Sample Values'}
        };

        Plotly.newPlot('bubble', bubble_graph, layout);

        //guage chart
        let gauge_data = [{
            domain: {x: [0,1], y: [0,1]},
            value: washing_frequency,
            title: {text: 'Belly Button Washing Frequency (Scrubs per Week)'},
            type: 'indicator',
            mode: 'gauge+number',
            gauge: {
                axis: {range: [0,9]},
                steps: [
                    { range: [0, 1], color: "ivory"},
                    { range: [1, 2], color: "floralwhite" },
                    { range: [2, 3], color: "oldlace" },
                    { range: [3, 4], color: " blanchedalmond " },
                    { range: [4, 5], color: "peachpuff" },
                    { range: [5, 6], color: "sandybrown" },
                    { range: [6, 7], color: "darkorange" },
                    { range: [7, 8], color: "chocolate" },
                    { range: [8, 9], color: "sienna" }]
            }
        }];

        let gauge_layout = { width: 600, height: 400 };

        Plotly.newPlot('gauge', gauge_data, gauge_layout);
    });

};
//function to fill in demographic box
function demographic_info(id){
    //grab metadata
    d3.json(url).then(function (data) {
        let metadata = data.metadata;
        
        //filter the meta data
        let first_patient =  metadata.filter(info => info.id == id)[0];
        console.log(first_patient)

        //select the demographic box
        let demo_data = d3.select('#sample-metadata');

        //delete anything in the box when change
        demo_data.html('');

        Object.entries(first_patient).forEach(([key, value]) => {
            demo_data.append('p').text(`${key}: ${value}`)
        });
    });
};


//dropdown menu
let dropwdown = d3.select('#selDataset');
d3.json(url).then(function (data){
    let names = data.names;
    //input variables for the dropdown menu
    names.forEach(name => {
        dropwdown.append('option').text(name).property('value', name)
    });
    buildcharts(names[0]);
    demographic_info(names[0]);
});


//update new testing samples
function optionChanged(id){
    buildcharts(id);
    demographic_info(id)
};


