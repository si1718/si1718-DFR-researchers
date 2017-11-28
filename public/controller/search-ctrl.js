angular.module("ResearcherManagerApp")
   .controller("SearchEngineCtrl", ["$scope", "$http", "$rootScope", "$rootScope", function($scope, $http, $rootScope, $rootScope) {
        
    /* Almaceno el campo por el que se desea buscar. */
    $scope.searchTextBox="";
    
    $scope.sectionTitle = "Search Engine";
    
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

}]);