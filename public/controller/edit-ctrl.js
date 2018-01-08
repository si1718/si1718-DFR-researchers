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
                
                /**
                * Sistema de recomendacion de investigadores
                * 
                */
                
                $http
                    .get("/api/v1/researchers/recommendations/" + idResearcher)
                    .then(function(response) {
                        
                        /* Investigadores recomendados */
                        var researchers = response.data.researchers.split(",");
                        
                        /* Checks para comprobar el número de recomendaciones que debemos mostrar */
                        $scope.checkRecommend1 = false;
                        $scope.checkRecommend2 = false;
                        $scope.checkRecommend3 = false;
                        
                        /* Elimino el propio identificador para no recomendar a el mismo. */
                        researchers.remove(idResearcher);
                        
                        /* INVESTIGADOR 1 RECOMENDADO */
                        if(typeof researchers[0] === 'undefined') {
                            // does not exist
                        }else {
                            // does exist
                            $http
                                .get("/api/v1/researchers/" + researchers[0])
                                .then(function(response) {
                                    $scope.recommendation1 ={
                                        idResearcher: response.data.idResearcher,
                                        name : response.data.name
                                    }
                                    
                                    $scope.checkRecommend1 = true;
                                
                            }, function(error){
                                /* No hay recomendaciones o hubo algún tipo de problema durante la petición. */
                            });
                        }
                        
                        /* INVESTIGADOR 2 RECOMENDADO */
                        if(typeof researchers[1] === 'undefined') {
                            // does not exist
                        }else {
                            // does exist
                            $http
                                .get("/api/v1/researchers/" + researchers[1])
                                .then(function(response) {
                                    $scope.recommendation2 ={
                                        idResearcher: response.data.idResearcher,
                                        name : response.data.name
                                    }
                                    
                                    $scope.checkRecommend2 = true;
                                
                            }, function(error){
                                /* No hay recomendaciones o hubo algún tipo de problema durante la petición. */
                            });
                        }
                        
                        /* INVESTIGADOR 3 RECOMENDADO */
                        if(typeof researchers[2] === 'undefined') {
                            // does not exist
                        }else {
                            // does exist
                            $http
                                .get("/api/v1/researchers/" + researchers[2])
                                .then(function(response) {
                                    $scope.recommendation3 ={
                                        idResearcher: response.data.idResearcher,
                                        name : response.data.name
                                    }
                                    
                                    $scope.checkRecommend3 = true;
                                
                            }, function(error){
                                /* No hay recomendaciones o hubo algún tipo de problema durante la petición. */
                            });
                        }
                        
                        
                    
                }, function(error){
                    /* No hay recomendaciones o hubo algún tipo de problema durante la petición. */
                });
                
                /**
                * Sistema de recomendacion de patentes
                * 
                */
                
                $http
                    .get("/api/v1/patentsRecommendations/" + idResearcher)
                    .then(function(response) {
                        
                        /* Patentes recomendadas */
                        var patents = [];
                        
                        $.each(response.data, function( index, value ) {
                          console.log( index + ": " + value.idPatent );
                          patents.push(value.idPatent);
                        });
                        
                        /* Checks para comprobar el número de recomendaciones que debemos mostrar */
                        $scope.checkRecommendPatent1 = false;
                        $scope.checkRecommendPatent2 = false;
                        $scope.checkRecommendPatent3 = false;
                        
                        /* PATENTE 1 RECOMENDADO */
                        if(typeof patents[0] === 'undefined') {
                            // does not exist
                        }else {
                            // does exist
                            $http
                                .get("https://si1718-rrv-patents.herokuapp.com/api/v1/patents/" + patents[0])
                                .then(function(response) {
                                    $scope.recommendationPatent1 ={
                                        idPatent: response.data.idPatent,
                                        name : response.data.title
                                    }
                                    
                                    $scope.checkRecommendPatent1 = true;
                                
                            }, function(error){
                                /* No hay recomendaciones o hubo algún tipo de problema durante la petición. */
                            });
                        }
                        
                        /* PATENTE 2 RECOMENDADO */
                        if(typeof patents[1] === 'undefined') {
                            // does not exist
                        }else {
                            // does exist
                            $http
                                .get("https://si1718-rrv-patents.herokuapp.com/api/v1/patents/" + patents[1])
                                .then(function(response) {
                                    $scope.recommendationPatent2 ={
                                        idPatent: response.data.idPatent,
                                        name : response.data.title
                                    }
                                    
                                    $scope.checkRecommendPatent2 = true;
                                
                            }, function(error){
                                /* No hay recomendaciones o hubo algún tipo de problema durante la petición. */
                            });
                        }
                        
                        /* PATENTE 3 RECOMENDADO */
                        if(typeof patents[2] === 'undefined') {
                            // does not exist
                        }else {
                            // does exist
                            $http
                                .get("https://si1718-rrv-patents.herokuapp.com/api/v1/patents/" + patents[2])
                                .then(function(response) {
                                    $scope.recommendationPatent3 ={
                                        idPatent: response.data.idPatent,
                                        name : response.data.title
                                    }
                                    
                                    $scope.checkRecommendPatent3 = true;
                                
                            }, function(error){
                                /* No hay recomendaciones o hubo algún tipo de problema durante la petición. */
                            });
                        }
                        
                        
                    
                }, function(error){
                    /* No hay recomendaciones o hubo algún tipo de problema durante la petición. */
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
                .put("/api/v1/researchers/"+idResearcher,$scope.updateResearcher)
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

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function isURL(s) {
   var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
   return regexp.test(s);
}