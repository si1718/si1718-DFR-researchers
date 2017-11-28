angular.module("ResearcherManagerApp")
   .controller("SearchEngineCtrl", ["$scope", "$http", function($scope, $http) {
        
    /* Almaceno el campo por el que se desea buscar. */
    $scope.searchTextBox="";
    
    $scope.sectionTitle = "Search Engine";
    
    /* LOGIN SECTION */
    $scope.login = true;
    $scope.logout = false;
    
    /* Comprueba que el token de acceso se encuentra almacenado */
    if (localStorage.getItem('accessToken') != null && localStorage.getItem('accessToken') != 'null'){
        $scope.login = false;
        $scope.logout = true;
    }else if (localStorage.getItem('accessToken') == null || localStorage.getItem('accessToken') != 'null'){
        $scope.login = true;
        $scope.logout = false;
    }else{
        $scope.login = true;
        $scope.logout = false;
    }

}]);