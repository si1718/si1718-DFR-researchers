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
                    
                    pieChartDepartment("department_graph", $scope.data, "Departments that have more than 100 researchers");
                });
                
            /* Llama a la API para obtener todos los departamentos */
            $http
                .get("https://si1718-rgg-groups.herokuapp.com/api/v1/groups")
                .then(function(response) {
                    $scope.dataAux = response.data;
                    
                    pieChartGroup("group_graph", $scope.dataAux, "Groups that have more than 40 researchers");
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