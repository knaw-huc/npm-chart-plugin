require('chart.js');
import Chart from 'chart.js/auto'

export default class Graph {
    priority = 10;

    // Whether to show a select-button for this plugin
    hideFromSelection = false;

    constructor(yasr) {
        this.yasr = yasr;
    }

    defaults = {};

    draw() {

        const el = document.createElement('div');
        const chartID = createGraphID();
        const canvas = document.createElement('canvas');
        canvas.setAttribute("id", chartID);
        el.appendChild(canvas);
        this.yasr.resultsEl.appendChild(el);
        switch(this.defaults.typeChart) {
            case 'LineChart':
                createLineChart(chartID, this.yasr.results);
                break;
            case'ScatterChart':
                createScatterChart(chartID, this.yasr.results);
                break;
            default:
                createDefault(chartID);
        }

    }

    canHandleResults() {
        return !!this.yasr.results;
    }
    // A required function, used to identify the plugin, works best with an svg
    getIcon() {
        const textIcon = document.createElement("div");
        textIcon.classList.add("svgImg");
        const svg = document.createElement("svg");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("viewBox", "0 0 510 512");
        svg.setAttribute("aria-hidden", "true");
        const path = document.createElement("path");
        path.setAttribute("fill", "currentColor");
        path.setAttribute("d", "M248 8C111.03 8 0 119.03 0 256s111.03 248 248 248 248-111.03 248-248S384.97 8 248 8zm160 215.5v6.93c0 5.87-3.32 11.24-8.57 13.86l-15.39 7.7a15.485 15.485 0 0 1-15.53-.97l-18.21-12.14a15.52 15.52 0 0 0-13.5-1.81l-2.65.88c-9.7 3.23-13.66 14.79-7.99 23.3l13.24 19.86c2.87 4.31 7.71 6.9 12.89 6.9h8.21c8.56 0 15.5 6.94 15.5 15.5v11.34c0 3.35-1.09 6.62-3.1 9.3l-18.74 24.98c-1.42 1.9-2.39 4.1-2.83 6.43l-4.3 22.83c-.62 3.29-2.29 6.29-4.76 8.56a159.608 159.608 0 0 0-25 29.16l-13.03 19.55a27.756 27.756 0 0 1-23.09 12.36c-10.51 0-20.12-5.94-24.82-15.34a78.902 78.902 0 0 1-8.33-35.29V367.5c0-8.56-6.94-15.5-15.5-15.5h-25.88c-14.49 0-28.38-5.76-38.63-16a54.659 54.659 0 0 1-16-38.63v-14.06c0-17.19 8.1-33.38 21.85-43.7l27.58-20.69a54.663 54.663 0 0 1 32.78-10.93h.89c8.48 0 16.85 1.97 24.43 5.77l14.72 7.36c3.68 1.84 7.93 2.14 11.83.84l47.31-15.77c6.33-2.11 10.6-8.03 10.6-14.7 0-8.56-6.94-15.5-15.5-15.5h-10.09c-4.11 0-8.05-1.63-10.96-4.54l-6.92-6.92a15.493 15.493 0 0 0-10.96-4.54H199.5c-8.56 0-15.5-6.94-15.5-15.5v-4.4c0-7.11 4.84-13.31 11.74-15.04l14.45-3.61c3.74-.94 7-3.23 9.14-6.44l8.08-12.11c2.87-4.31 7.71-6.9 12.89-6.9h24.21c8.56 0 15.5-6.94 15.5-15.5v-21.7C359.23 71.63 422.86 131.02 441.93 208H423.5c-8.56 0-15.5 6.94-15.5 15.5z");
        svg.appendChild(path);
        textIcon.appendChild(svg);
        return textIcon;
    }
}

function createGraphID() {
    let i = 1;
    let varName = 'graph_' + i.toString();
    while (document.getElementById(varName) !== null) {
        i++;
        varName = 'graph_' + i.toString();
    }
    return varName;
}

function createDefault(chartID) {
    const data = [
        {year: 2010, count: 10},
        {year: 2011, count: 20},
        {year: 2012, count: 15},
        {year: 2013, count: 25},
        {year: 2014, count: 22},
        {year: 2015, count: 30},
        {year: 2016, count: 28},
    ];

    new Chart(
        document.getElementById(chartID),
        {
            type: 'bar',
            data: {
                labels: data.map(row => row.year),
                datasets: [
                    {
                        label: "Dummy grafiek",
                        data: data.map(row => row.count)
                    }
                ]
            }
        }
    );
}

function createLineChart(chartID, results) {
    const data = createLineChartData(results);
    new Chart(
        document.getElementById(chartID),
        {
            type: 'line',
            data: data
        }
    );
}

function createScatterChart(chartID, results) {
    const data = createScatterChartData(results);
    new Chart(
        document.getElementById(chartID),
        {
            type: 'scatter',
            data: data,
            options: {
                backgroundColor: 'rgb(0, 0, 153)',
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom'
                    }
                }
            }
        }
    );
}

function createLineChartData(results) {
    const colors = [
        'rgb(0, 102, 0)',
        'rgb(0, 102, 0)',
        'rgb(204, 0, 0)',
        'rgb(0, 0, 153)',
        'rgb(102, 102, 0)',
        'rgb(204, 204, 0)',
        'rgb(204, 0, 102)',
        'rgb(175, 92, 96)'
    ]
    const fields = results.json.head.vars;
    let fieldName = fields[0];
    const labels = results.json.results.bindings.map(row => row[fieldName]["value"]);
    let datasets = [];
    let i = 1;
    while (i < fields.length) {
        fieldName = fields[i];
        let buffer = {
            label: fieldName,
            data: results.json.results.bindings.map(row => row[fieldName]["value"]),
            borderColor: colors[i],
            fill: false,
            tension: 0.1
        }
        datasets.push(buffer);
        i++;
    }
    const retStruc = {
        labels: labels,
        datasets: datasets
    }
    return retStruc;
}

function createScatterChartData(results) {
    const fields = results.json.head.vars;
    const xField = fields[0];
    const yField = fields[1];
    const data = results.json.results.bindings.map(row => ({x: row[xField]["value"], y: row[yField]["value"]}));
    const retData = {
        datasets: [{
            label: "Excess death rate",
            data: data
        }]
    }
    return retData;
}

