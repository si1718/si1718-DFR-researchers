var app = angular.module("ResearcherManagerApp")
   .controller("ListSecureCtrl", ["$scope", "$http", "$routeParams", "$rootScope", "$filter", function($scope, $http, $routeParams, $rootScope, $filter) {
       
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
                url: "/api/v1.1/researchers",
                params: {search: $routeParams.search, token: localStorage.getItem("accessToken")}
            }).then(function(response) {
                $scope.researchers = sortByKey(response.data, 'name');
                if(!$.isArray(response.data) || !response.data.length) {
                    swal("There are no researchers that match your search", null, "info");
                }
            }, function(error){
                swal("There are no researchers that match your search", null, "info");
            });
            
            $scope.sectionTitle = "List of researchers";
            
            $scope.newResearcher={
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
        $scope.addResearcher = function (){
            
            /* Almaceno el campo viewURL para la integración entre recursos */
            $scope.newResearcher.viewURL = "https://si1718-dfr-researchers.herokuapp.com/#!/researchers/" + $scope.newResearcher.orcid + "/view";
            
            if ($scope.newResearcher.orcid != null && $scope.newResearcher.orcid != "" &&
                $scope.newResearcher.name != null && $scope.newResearcher.name != ""){
                $http
                .post("/api/v1.1/researchers?token=" + localStorage.getItem("accessToken"), $scope.newResearcher)
                .then(function(response) {
                    refresh();
                    swal("Researcher stored!", null, "success");
                }, function(error){
                    swal("Please check all the fields. Thank you so much!", null, "warning");
                });
            }else{
                swal("Please check all the fields. Thank you so much!", null, "warning");
            }
            
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
                $http({
                    url: "/api/v1.1/researchers/"+idResearcher,
                    method: "delete",
                    params: {token: localStorage.getItem("accessToken")}
                })
                .then(function(response) {
                    refresh();
                    swal("Deleted!", "Your researcher has been deleted.", "success");
                }, function(error){
                    swal("Something was wrong. Try again.", null, "warning");
                });
            });
            
        }
        
        /* Elimina todos los investigadores */
        $scope.deleteAllResearchers = function (){
            
            $http
                .delete("/api/v1.1/researchers?token=" + localStorage.getItem("accessToken"))
                .then(function(response) {
                    refresh();
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