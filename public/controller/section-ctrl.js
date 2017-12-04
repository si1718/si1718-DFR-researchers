angular.module("ResearcherManagerApp")
    .controller("SectionCtrl", ["$scope", "$http", "$rootScope", "$q", function($scope, $http, $rootScope, $q) {
        
        $scope.sectionTitle = "Sections";
        
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
        
        /* Muestra tooltips */
        $('[data-toggle="tooltip"]').tooltip();

    }]);