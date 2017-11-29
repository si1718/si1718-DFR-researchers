angular.module("ResearcherManagerApp")
    .controller("GraphCtrl", ["$scope", "$http", function($scope, $http) {


        function refresh() {
            $http
                .get("/data")
                .then(function(response) {
                    $scope.data = response.data;


                    Highcharts.chart('container', {
                        chart: {
                            type: 'area'
                        },
                        title: {
                            text: 'My data'
                        },


                        yAxis: {
                            title: {
                                text: 'data'
                            }
                        },
                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle'
                        },

                        plotOptions: {
                            series: {
                                label: {
                                    connectorAllowed: false
                                },
                                pointStart: 1
                            }
                        },

                        series: [{
                            name: 'data',
                            data: $scope.data
                        }],

                        responsive: {
                            rules: [{
                                condition: {
                                    maxWidth: 500
                                },
                                chartOptions: {
                                    legend: {
                                        layout: 'horizontal',
                                        align: 'center',
                                        verticalAlign: 'bottom'
                                    }
                                }
                            }]
                        }

                    });

                });

        }


        refresh();

    }]);
