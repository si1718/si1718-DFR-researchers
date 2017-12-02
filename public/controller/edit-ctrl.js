var app = angular.module("ResearcherManagerApp")
   .controller("EditCtrl", ["$scope", "$http", "$routeParams", "$rootScope", function($scope, $http, $routeParams, $rootScope) {
        
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
        
        var idResearcher = $routeParams.idResearcher;
        $scope.idResearcher = idResearcher;
        
        function refresh(){
            if (idResearcher) {
              /* Llama a la API si este parámetro se ha recibido */
                $http
                    .get("/api/v1/researchers/" + idResearcher)
                    .then(function(response) {
                    $scope.updateResearcher = response.data;
                    if( !$scope.updateResearcher.idResearcher && !$scope.updateResearcher.name ) {
                        swal("There are no researcher that match your search", null, "info");
                        
                        $scope.updateResearcher={
                            idResearcher: "",
                            name : "",
                            phone : "",
                            orcid : "",
                            researcherId : "",
                            link : "",
                            idGroup : "",
                            idDepartment : "",
                            professionalSituation : ""
                        }
                    }
                }, function(error){
                    swal("There are no researchers that match your search", null, "info");
                });
            }else{
                $scope.updateResearcher={
                    idResearcher: "",
                    name : "",
                    phone : "",
                    orcid : "",
                    researcherId : "",
                    link : "",
                    idGroup : "",
                    idDepartment : "",
                    professionalSituation : ""
                }
            }
        }

        /* Edita un investigador por el idResearcher */
        $scope.editResearcher = function (idResearcher){
            
            $http
                .put("/api/v1/researchers/"+idResearcher,$scope.updateResearcher)
                .then(function(response) {
                    refresh();
                    $scope.errorsUpdate = false;
                    $scope.successUpdate = true;
                }, function(error){
                    $scope.errorsUpdate = true;
                    $scope.successUpdate = false;
                });
            
        }
        
        refresh();
}]);