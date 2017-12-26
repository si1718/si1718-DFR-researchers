var app = angular.module("ResearcherManagerApp")
   .controller("ListNewResearchersCtrl", ["$scope", "$http", "$routeParams", "$rootScope", "$filter", function($scope, $http, $routeParams, $rootScope, $filter) {
        
        $scope.currentPage = 0;
        $scope.pageSize = 10;
        $scope.researchers = [];
        
        $scope.getData = function () {
            return $scope.researchers;
        }
        
        $scope.numberOfPages=function(){
            return Math.ceil($scope.getData().length/$scope.pageSize);       
        }
        
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
        
        /* Obtiene todos los investigadores para mostrarlos en la tabla y refresca la tabla en cada acción */
        function refresh(){
            
            $http({
                url: "/api/v1/dailyResearchers",
                params: $routeParams
            }).then(function(response) {
                $scope.researchers = sortByKey(response.data, 'name');
                if(!$.isArray(response.data) || !response.data.length) {
                    swal("There are no new researchers that match your search", null, "info");
                }
            }, function(error){
                swal("There are no new researchers that match your search", null, "info");
            });
            
            $scope.sectionTitle = "List of researchers";
            
            $scope.newResearcher={
                idResearcher : "",
                name : "",
                phone : "",
                orcid : "",
                researcherId : "",
                link : "",
                idGroup : "",
                professionalSituation : "",
                keywords : "",
                viewURL : "",
                idDepartment : "",
                departmentViewURL : "",
                departmentName : ""
            }
            
        }
    
        /* Añade un investigador */
        $scope.addNewResearcher = function (idResearcher){
            
            /* Busco el investigador en la collection de los nuevos investigadores */
            $http
                .get("/api/v1/dailyResearchers/"+idResearcher)
                .then(function(response) {
                    
                    /* Asigno los valores obtenidos en la variable newResearcher */
                    $scope.newResearcher.idResearcher = response.data.idResearcher;
                    $scope.newResearcher.name = response.data.name;
                    $scope.newResearcher.phone = response.data.phone;
                    $scope.newResearcher.orcid = response.data.orcid;
                    $scope.newResearcher.researcherId = response.data.researcherId;
                    $scope.newResearcher.link = response.data.link;
                    $scope.newResearcher.idGroup = response.data.idGroup;
                    $scope.newResearcher.professionalSituation = response.data.professionalSituation;
                    $scope.newResearcher.keywords = response.data.keywords;
                    $scope.newResearcher.viewURL = response.data.viewURL;
                    $scope.newResearcher.idDepartment = response.data.idDepartment;
                    $scope.newResearcher.departmentViewURL = response.data.departmentViewURL;
                    $scope.newResearcher.departmentName = response.data.departmentName;
                    
                    /* Compruebo que el researcher tiene un idResearcher y un nombre, en caso contrario no lo almaceno. */
                    if ($scope.newResearcher.idResearcher != null && $scope.newResearcher.idResearcher != "" &&
                        $scope.newResearcher.name != null && $scope.newResearcher.name != ""){
                        $http
                            .post("/api/v1/researchersAuxiliar/",$scope.newResearcher)
                            .then(function(response) {
                                swal("Researcher stored!", null, "success");
                                
                                /* Una vez almacenado lo borro de la base de datos diaria */
                                $http
                                    .delete("/api/v1/dailyResearchers/"+$scope.newResearcher.idResearcher)
                                    .then(function(response) {
                                        refresh();
                                        swal("Deleted!", "Your researcher has been deleted.", "success");
                                    }, function(error){
                                        swal("Something was wrong and the researcher could not be eliminated. Try again.", null, "warning");
                                    });
                                
                            }, function(error){
                                swal("Something was wrong. Try again.", null, "warning");
                            });
                    }else{
                        swal("Something was wrong. Try again.", null, "warning");
                    }
                    
                }, function(error){
                    swal("There are no new researchers that match your search", null, "info");
                });
            
            
            
        }

        /* Elimina un investigador por el idResearcher */
        $scope.deleteResearcher = function (idResearcher){
            
            swal({
              title: "Are you sure?",
              text: "Your will not be able to recover this researcher!",
              type: "warning",
              showCancelButton: true,
              confirmButtonClass: "btn-danger",
              confirmButtonText: "Yes, delete it!",
              closeOnConfirm: false
            },
            function(){
                $http
                .delete("/api/v1/dailyResearchers/"+idResearcher)
                .then(function(response) {
                    refresh();
                    swal("Deleted!", "Your researcher has been deleted.", "success");
                }, function(error){
                    swal("Something was wrong. Try again.", null, "warning");
                });
            });
            
        }

        refresh();

}]);


app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
            