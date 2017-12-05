var app = angular.module("ResearcherManagerApp")
   .controller("EditSecureCtrl", ["$scope", "$http", "$routeParams", "$rootScope", function($scope, $http, $routeParams, $rootScope) {
        
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
                $http({
                    url: "/api/v1.1/researchers/" + idResearcher,
                    params: {token: localStorage.getItem("accessToken")}
                })
                .then(function(response) {
                    $scope.updateResearcher = response.data;
                    
                    /* Compruebo si ya ha sido validado un departamento */
                    $scope.checkValidate = isURL($scope.updateResearcher.idDepartment);
                    
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
                $scope.updateResearcher={
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

        /* Edita un investigador por el idResearcher */
        $scope.editResearcher = function (idResearcher){
            
            /* Compruebo si el contenido no es una URL, porque eso significa de que no ha sido validado y 
                entonces actualizo a NULL los parametros departmentViewURL and departmentName */
            if (!isURL($scope.updateResearcher.idDepartment)){
                $scope.updateResearcher.departmentViewURL = null;
                $scope.updateResearcher.departmentName = null;
            }
            
            $http
            .put("/api/v1.1/researchers/"+idResearcher+"?token=" + localStorage.getItem("accessToken"),$scope.updateResearcher)
            .then(function(response) {
                refresh();
                swal("Researcher edited!", null, "success");
            }, function(error){
                swal("Please check all the fields. Thank you so much!", null, "warning");
            });
            
        }
        
        /* Validar un departamento */
        $scope.validateDepartment = function (idDepartment){
            
            if (!idDepartment){
                swal("Check if the department is empty or null. Thank you so much!", null, "warning");
            }else{
                $http
                .get("https://si1718-amc-departments.herokuapp.com/api/v1/departments?department="+idDepartment)
                .then(function(response) {
                    
                    /* Compruebo si ya ha sido validado un departamento */
                    if (isURL($scope.updateResearcher.idDepartment)){
                        swal("Department has already been validated.", null, "warning");
                    }else{
            
                        var departmentObj = response.data;
                        
                        if($.isArray(departmentObj) && departmentObj.length==0) {
                            swal("Department not found. Try again later.", "Thank you so much!", "info");
                        }else{
                            /* Identificar devuelto por el recurso departamentos */
                            var idDepartment = departmentObj[0].idDepartment;
                            
                            /* Nombre del departamento */
                            var departmentName = departmentObj[0].department;
                            
                            /* Endpoint API Department */
                            var endpointAPIDepartment = "https://si1718-amc-departments.herokuapp.com/api/v1/departments/" + idDepartment;
                            
                            /* Enlace al recurso angular del departamento */
                            var departmentViewURL = "https://si1718-amc-departments.herokuapp.com/#!/department/" + idDepartment;
                            
                            /* ACTUALIZO EL SCOPE DE RESEARCHER */
                            $scope.updateResearcher.departmentName = departmentName;
                            $scope.updateResearcher.departmentViewURL = departmentViewURL;
                            $scope.updateResearcher.idDepartment = endpointAPIDepartment;
                            
                            $http
                            .put("/api/v1/researchers/"+idResearcher,$scope.updateResearcher)
                            .then(function(response) {
                                refresh();
                                swal("Department validated!", null, "success");
                            }, function(error){
                                swal("Please check all the fields. Thank you so much!", null, "warning");
                            });
                            
                        }
  
                    }
                    
                }, function(error){
                    swal("Check if the department is empty or null. Thank you so much!", null, "warning");
                });
            }
            
            
        }
        
        refresh();
}]);


function isURL(s) {
   var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
   return regexp.test(s);
}