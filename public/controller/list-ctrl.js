angular.module("ResearcherManagerApp")
   .controller("ListCtrl", ["$scope", "$http", function($scope, $http) {
    

        function refresh(){
            $http
                .get("/api/v1/researchers")
                .then(function(response) {
                    $scope.researchers = response.data;
                });
            
            $scope.newResearcher={
                name : "",
                phone : ""
            }
        }
    
        $scope.addResearcher = function (){
            
            $http
                .post("/api/v1/researchers/",$scope.newResearcher)
                .then(function(response) {
                    refresh();
                }, function(error){
                    alert(error.data);
                });
            
        }

        $scope.deleteResearcher = function (name){
            
            $http
                .delete("/api/v1/researchers/"+name)
                .then(function(response) {
                    refresh();
                });
            
        }

        refresh();

}]);