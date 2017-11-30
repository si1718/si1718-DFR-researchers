angular.module("ResearcherManagerApp")
    .controller("GraphCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {
        
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
                    
                    pieChartDepartment("department_graph", $scope.data, "Numbers of researchers by department");
                    //funnel_graph("funnelDepartments_graph", $scope.data, "Types of Departments");
                });
                
            /* Llama a la API para obtener todos los departamentos */
            $http
                .get("/api/v1/groupsGraph")
                .then(function(response) {
                    $scope.dataAux = response.data;
                    
                    //pieChart("group_graph", $scope.dataAux, "Numbers of researchers by group");
                    //funnel_graph("funnelGroups_graph", $scope.dataAux, "Types of Groups");
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
                jsonObject["y"] = department["researchers"].length;
                jsonObject["name"] = department["department"];
                
                departmentArray.push(jsonObject);
            }
        }
    }
    
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


function funnel_graph(id, data, customTitle){
    
    $.each(data, function (i, point) {
        point.y = point.count;
        point.name = point._id;
    });
    
    Highcharts.chart(id, {
        chart: {
            type: 'funnel'
        },
        title: {
            text: customTitle
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b> ({point.y:,.0f})',
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                    softConnector: true
                },
                center: ['40%', '50%'],
                neckWidth: '30%',
                neckHeight: '25%',
                width: '80%'
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Total researchers',
            data: data
        }]
    });
}
