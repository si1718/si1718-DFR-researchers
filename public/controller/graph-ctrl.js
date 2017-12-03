angular.module("ResearcherManagerApp")
    .controller("GraphCtrl", ["$scope", "$http", "$rootScope", "$q", function($scope, $http, $rootScope, $q) {
        
        $scope.sectionTitle = "Graphs";
        
        /* Comprueba que el token de acceso se encuentra almacenado */
        if (localStorage.getItem("accessToken") === null){
            $rootScope.login = true;
            $rootScope.logout = false;
        }else if (localStorage.getItem('accessToken') != 'null'){
            $rootScope.login = false;
            $rootScope.logout = true;
        }else{
            $rootScope.login = true;
            $rootScope.logout = false;
        }

        function refresh() {
            
            /* Llama a la API para obtener todos los departamentos */
            $http
                .get("https://si1718-amc-departments.herokuapp.com/api/v1/departments")
                .then(function(response) {
                    $scope.data = response.data;
                    
                    pieChartDepartment("department_graph", $scope.data, "Departments that have more than 100 researchers");
                });
                
            /* Llama a la API para obtener todos los departamentos */
            $http
                .get("https://si1718-rgg-groups.herokuapp.com/api/v1/groups")
                .then(function(response) {
                    $scope.dataAux = response.data;
                    
                    pieChartGroup("group_graph", $scope.dataAux, "Groups that have more than 40 researchers");
                });
                
            /* Llama a la API para obtener todos los investigadores del propio sistema */
            $http
                .get("/api/v1/researchers")
                .then(function(response) {
                    
                    if(!$.isArray(response.data) || !response.data.length) {
                        swal("There are no researchers", null, "info");
                    }else{
                        $scope.totalResearchers = response.data;
                        $scope.researchersWithORCID = response.data.filter(function(v){return v.orcid !==null && v.orcid !==''});
                        
                        var firstORCID = $scope.researchersWithORCID[Math.floor(Math.random()*$scope.researchersWithORCID.length)].orcid;
                        var secondORCID = $scope.researchersWithORCID[Math.floor(Math.random()*$scope.researchersWithORCID.length)].orcid;
                        var thirdORCID = $scope.researchersWithORCID[Math.floor(Math.random()*$scope.researchersWithORCID.length)].orcid;
                        
                        var arrayORCID = [];
                        arrayORCID.push(firstORCID);
                        arrayORCID.push(secondORCID);
                        arrayORCID.push(thirdORCID);
                        arrayORCID.push("0000-0001-9827-1834");
                        
                        $scope.countResearcher = 0;
                        
                        /* Genera un gráfico comparativo entre investigadores con ORCID e investigadores sin ORCID*/
                        barColumnComparativeORCID("researchersORCIDvsNoORCID", $scope.researchersWithORCID.length, $scope.totalResearchers.length - $scope.researchersWithORCID.length);
                        /* Contrasta la información que tengo en mi API con la de Elsevier */
                        requestElsevier(arrayORCID);
                        
                    }
                }, function(error){
                    swal("There are no researchers", null, "info");
                });
        }
        
        /* Solicita a Elsevier información acerca de un investigador */
        function requestElsevier(arrayORCID){
            var arr = [];
            
            for(var i=0;i<arrayORCID.length;i++){
                var elsevierURL = "https://api.elsevier.com/content/search/scopus?query=orcid(" + arrayORCID[i] + ")&apiKey=9be7ee9ada388177ad161809f3606cb0&httpAccept=application/json";
                var requestElsevier = $http
                    .get(elsevierURL)
                    .then(function(response) {
                        var result = parseInt(response.data["search-results"]["opensearch:totalResults"]);
                        if (result == 1){
                            $scope.countResearcher += 1;    
                        }
                }, function(error){
                    swal("There are problems with Elsevier. Try later. Thank you so much!", null, "info");
                });
                
                arr.push(requestElsevier);
            }
            
            $q.all(arr).then(function (ret) {
                barColumn("barCharResearchers", 4 , $scope.countResearcher);
            });
        }


        refresh();

    }]);
  
  
/* ************** GRAPHS FUNCTIONS ***************** */

function pieChartDepartment(id, data, customTitle){
    
    var departmentArray = [];
    
    for(var i = 0; i < data.length; i++) {
        var department = data[i];
        
        if (department["researchers"] != undefined && department["researchers"] != null && department["researchers"].length > 0){
            
            if (department["researchers"].length > 100){
                var jsonObject = {};
                jsonObject["count"] = department["researchers"].length;
                jsonObject["_id"] = department["department"];
                jsonObject["url"] = "https://si1718-amc-departments.herokuapp.com/#!/department/" + department["idDepartment"];
                
                departmentArray.push(jsonObject);
            }
        }
    }
    
    $.each(departmentArray, function (i, point) {
        point.y = point.count;
        point.name = point._id;
    });
    
    Highcharts.chart(id, {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: customTitle
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.count}</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point._id}</b>: {point.count}',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                },
                point: {
                    events: {
                        click: function() {
                            window.open(this.options.url, '_blank', 'location=yes,height=684,width=606,scrollbars=yes,status=yes');
                        }
                    }
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Researchers',
            colorByPoint: true,
            data: departmentArray
        }]
    });
}


function pieChartGroup(id, data, customTitle){
    
    var groupArray = [];
    
    for(var i = 0; i < data.length; i++) {
        var group = data[i];
        
        if (group["components"] != undefined && group["components"] != null && group["components"].length > 0){
            
            if (group["components"].length > 40){
                var jsonObject = {};
                jsonObject["count"] = group["components"].length;
                jsonObject["_id"] = group["name"];
                jsonObject["url"] = "https://si1718-rgg-groups.herokuapp.com/#!/group/" + group["idGroup"];
                
                groupArray.push(jsonObject);
            }
        }
    }
    
    $.each(groupArray, function (i, point) {
        point.y = point.count;
        point.name = point._id;
    });
    
    Highcharts.chart(id, {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: customTitle
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.count}</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point._id}</b>: {point.count}',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                },
                point: {
                    events: {
                        click: function() {
                            window.open(this.options.url, '_blank', 'location=yes,height=684,width=606,scrollbars=yes,status=yes');
                        }
                    }
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Researchers',
            colorByPoint: true,
            data: groupArray
        }]
    });
}

function barColumn(id, data1, data2){
    Highcharts.chart(id, {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Check the number of researchers that appears in Elsevier given four ORCID'
        },
        subtitle: {
            text: 'Source: <a href="https://dev.elsevier.com" target="_blank">Elsevier</a> & <a href="http://si1718-dfr-researchers.herokuapp.com/#!/" target="_blank">si1718-dfr-researchers</a>'
        },
        xAxis: {
            categories: ['Contrast'],
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Researchers',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ' researchers'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'si1718-dfr-researchers',
            data: [data1]
        }, {
            name: 'Elsevier API',
            data: [data2]
        }]
    });
}

function barColumnComparativeORCID(id, data1, data2){
    Highcharts.chart(id, {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Researchers with ORCID vs without ORCID'
        },
        subtitle: {
            text: 'Source: <a href="http://si1718-dfr-researchers.herokuapp.com/#!/" target="_blank">si1718-dfr-researchers</a>'
        },
        xAxis: {
            categories: ['Comparative'],
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Researchers',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ' researchers'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'ORCID',
            data: [data1]
        }, {
            name: 'Without ORCID',
            data: [data2]
        }]
    });
}