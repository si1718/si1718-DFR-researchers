angular.module("ResearcherManagerApp")
   .controller("SearchEngineCtrl", ["$scope", "$http", "$location", function($scope, $http, $location) {
        
    /* Almaceno el campo por el que se desea buscar. */
    $scope.searchTextBox="";
    
    $scope.sectionTitle = "Search Engine";
    
    if (localStorage.getItem('accessToken') != 'null'){
        $scope.login = false;
        $scope.logout = true;
    }else{
        $scope.login = true;
        $scope.logout = false;
    }

}]);