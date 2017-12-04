var app = angular.module("ResearcherManagerApp")
   .controller("ViewCtrl", ["$scope", "$http", "$routeParams", "$rootScope", function($scope, $http, $routeParams, $rootScope) {
        
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
                    $scope.viewResearcher = response.data;
                    
                    /* Compruebo si ya ha sido validado un departamento */
                    $scope.checkValidate = isURL($scope.viewResearcher.idDepartment);
                    
                    if( !$scope.viewResearcher.idResearcher && !$scope.viewResearcher.name ) {
                        swal("There are no researcher that match your search", null, "info");
                        
                        $scope.viewResearcher={
                            idResearcher: "",
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
                }, function(error){
                    swal("There are no researchers that match your search", null, "info");
                });
            }else{
                $scope.viewResearcher={
                    idResearcher: "",
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
        }
        
        refresh();
}]);