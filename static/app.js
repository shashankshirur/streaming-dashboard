$(document).ready(function () {
// ===========================================   chart 1   ==============================================================
    const config = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: "Requests",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [],
                fill: false,
            }],
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Avg. Request / Second (Streaming data)'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Time',
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Request / Second',
                    },
                    ticks: {
                        suggestedMin: 00,
                        suggestedMax: 30
                    }
                }]
            }
        }
    };

    const context1 = document.getElementById('canvas-1').getContext('2d');
    const lineChart = new Chart(context1, config);

// ===========================================   chart 2   ==============================================================
    const config2 = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: "CPU",
                backgroundColor: 'rgb(50, 99, 212)',
                borderColor: 'rgb(50, 99, 222)',
                data: [],
                fill: false,
            }],
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: '%  CPU Usage per second'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Time',
                        // duration: 20000,
					    // refresh: 1000,
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: '% CPU usage / second',
                    },
                    ticks: {
                        suggestedMin: 00,
                        suggestedMax: 100
                    }
                }]
            }
        }
    };


    const context2 = document.getElementById('canvas-2').getContext('2d');
    const lineChart2 = new Chart(context2, config2);


// ===========================================   chart 3   ==============================================================
    const config3 = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: "Disk",
                backgroundColor: 'rgb(25, 199, 132)',
                borderColor: 'rgb(25, 170, 132)',
                data: [],
                fill: false,
            }],
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: '% Disk usage per second'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Time',
                        // duration: 20000,
					    // refresh: 1000,
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: '% disk usage',
                    },
                    ticks: {
                        suggestedMin: 00,
                        suggestedMax: 100
                    }
                }]
            }
        }
    };


    const context3 = document.getElementById('canvas-3').getContext('2d');
    const lineChart3 = new Chart(context3, config3);


// ===========================================   chart 4  ==============================================================
    const config4 = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: "% of Virtual Memory usage per second",
                backgroundColor: 'rgb(5, 99, 242)',
                borderColor: 'rgb(5, 9, 242)',
                data: [],
                fill: false,
            }],
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: '% Virtual memory'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Time',
                        // duration: 20000,
					    // refresh: 1000,
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: '% Vmemory usage / second',
                    },
                    ticks: {
                        suggestedMin: 00,
                        suggestedMax: 100
                    }
                }]
            }
        }
    };


    const context4 = document.getElementById('canvas-4').getContext('2d');
    const lineChart4 = new Chart(context4, config4);

// =================================================================================================================
    const source = new EventSource("/chart-data");

    source.onmessage = function (event) {
        const data = JSON.parse(event.data);
        if (config.data.labels.length === 20) {
            config.data.labels.shift();
            config.data.datasets[0].data.shift();
        }
        config.data.labels.push(data.time.split(' ')[1]);
        config.data.datasets[0].data.push(data.value);
        lineChart.update();

        
        if (config2.data.labels.length === 20) {
            config2.data.labels.shift();
            config2.data.datasets[0].data.shift();
        }
        config2.data.labels.push(data.time.split(' ')[1]);
        config2.data.datasets[0].data.push(data.value2);
        lineChart2.update();
        
        
        if (config3.data.labels.length === 20) {
            config3.data.labels.shift();
            config3.data.datasets[0].data.shift();
        }
        config3.data.labels.push(data.time.split(' ')[1]);
        config3.data.datasets[0].data.push(data.value3);
        lineChart3.update();
        
        
        if (config4.data.labels.length === 20) {
            config4.data.labels.shift();
            config4.data.datasets[0].data.shift();
        }
        config4.data.labels.push(data.time.split(' ')[1]);
        config4.data.datasets[0].data.push(data.value4);
        lineChart4.update();
    }
    // const source = new EventSource("/chart-data");

});