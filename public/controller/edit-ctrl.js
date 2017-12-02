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
                            professionalSituation : "",
                            keywords : ""
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
                    professionalSituation : "",
                    keywords : ""
                }
            }
        }

        /* Edita un investigador por el idResearcher */
        $scope.editResearcher = function (idResearcher){
            
            $http
                .put("/api/v1/researchers/"+idResearcher,$scope.updateResearcher)
                .then(function(response) {
                    refresh();
                    swal("Researcher edited!", null, "success");
                }, function(error){
                    swal("Please check all the fields. Thank you so much!", null, "warning");
                });
            
        }
        
        /* Validar un departamento */
        $scope.validateDepartment = function (idResearcher, idDepartment){
            
            if (!idDepartment){
                swal("Check if the department is empty or null. Thank you so much!", null, "warning");
            }else{
                $http
                .get("https://si1718-amc-departments.herokuapp.com/api/v1/departments?department="+idDepartment)
                .then(function(response) {
                    
                    var departmentObj = response.data;
                    
                    /* Identificar devuelto por el recurso departamentos */
                    var idDepartment = departmentObj[0].idDepartment;
                    
                    /* Nombre del departamento */
                    var departmentName = departmentObj[0].department;
                    
                    /* Endpoint API Department */
                    var newIdDepartment = "https://si1718-amc-departments.herokuapp.com/api/v1/departments/" + idDepartment;
                    
                    /* Enlace al recurso angular del investigador */
                    var viewURL = "https://si1718-dfr-researchers.herokuapp.com/#!/researchers/" + idResearcher + "/edit"
                    
                    /* Enlace al recurso angular del departamento */
                    var departmentViewURL = "https://si1718-amc-departments.herokuapp.com/#!/department/" + idDepartment;
                    
                    console.log(viewURL);
                    console.log(departmentName);
                    console.log(newIdDepartment);
                    console.log(departmentViewURL);
                    
                    /*$http
                    .put("/api/v1/researchers/"+idResearcher,$scope.updateResearcher)
                    .then(function(response) {
                        refresh();
                        swal("Researcher edited!", null, "success");
                    }, function(error){
                        swal("Please check all the fields. Thank you so much!", null, "warning");
                    });*/
                    
                    
                }, function(error){
                    swal("Check if the department is empty or null. Thank you so much!", null, "warning");
                });
            }
            
            
        }
        
        refresh();
}]);