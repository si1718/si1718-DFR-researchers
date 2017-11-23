angular.module("ResearcherManagerApp")
   .controller("ListCtrl", ["$scope", "$http", "$routeParams", function($scope, $http, $routeParams) {
        
        /* Obtiene todos los investigadores para mostrarlos en la tabla y refresca la tabla en cada acción */
        function refresh(){
            
            $http({
                url: "/api/v1/researchers",
                params: $routeParams
            }).then(function(response) {
                    $scope.researchers = response.data;
            });
            
            $scope.sectionTitle = "List of researchers";
            
            $scope.newResearcher={
                name : "",
                phone : "",
                orcid : "",
                researcherId : "",
                link : "",
                idGroup : "",
                idDepartment : "",
                professionalSituation : ""
            }
            
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
    
        /* Añade un investigador */
        $scope.addResearcher = function (){
            
            $http
                .post("/api/v1/researchers/",$scope.newResearcher)
                .then(function(response) {
                    refresh();
                }, function(error){
                    alert(error.data);
                });
            
        }
        
        /* Edita un investigador por el idResearcher */
        $scope.editResearcher = function (idResearcher){
            
            $http
                .put("/api/v1/researchers/"+idResearcher,$scope.updateResearcher)
                .then(function(response) {
                    refresh();
                    $scope.openEditModal(idResearcher);
                    $scope.errorsUpdate = false;
                    $scope.successUpdate = true;
                }, function(error){
                    $scope.errorsUpdate = true;
                    $scope.successUpdate = false;
                });
            
        }

        /* Elimina un investigador por el idResearcher */
        $scope.deleteResearcher = function (idResearcher){
            
            $http
                .delete("/api/v1/researchers/"+idResearcher)
                .then(function(response) {
                    refresh();
                });
            
        }
        
        /* Elimina todos los investigadores */
        $scope.deleteAllResearchers = function (){
            
            $http
                .delete("/api/v1/researchers/")
                .then(function(response) {
                    refresh();
                });
            
        }
        
        /* Abre modal y obtiene información de un investigador */
        $scope.openEditModal = function (idResearcher){
            
            $http
                .get("/api/v1/researchers/"+idResearcher)
                .then(function(response) {
                    $scope.updateResearcher = response.data;
                });
                
        }
        
        /* Cierra el modal y elimina el mensaje de información existente que hubiese */
        $scope.closeEditModal = function (){
            $scope.errorsUpdate = false;
            $scope.successUpdate = false;
        }

        refresh();

}]);