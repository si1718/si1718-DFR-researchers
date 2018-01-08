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