angular.module("ResearcherManagerApp")
    .controller("KeywordsCtrl", ["$scope", "$http", "$rootScope", "$q", function($scope, $http, $rootScope, $q) {
        
        $scope.sectionTitle = "Keywords";
        
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

        function refresh() {
            
            /* Llama a la API para obtener todas las keywords */
            $http
                .get("/api/v1/keywords")
                .then(function(response) {
                    
                    $scope.updateKeywords = response.data[0];
                    
                    if( !$scope.updateKeywords.keywords ) {
                        swal("There are no keywords", null, "info");
                        
                        $scope.updateKeywords={
                            idKeywords: "",
                            keywords : ""
                        }
                    }
                });
                
            $http
                .get("/api/v1/wordsCloud")
                .then(function(response) {
                    
                    $scope.wordsCloud = response.data;
                    
                    if( !$scope.wordsCloud ) {
                        swal("There are no keywords", null, "info");
                    }else{
                        $("#wordsCloud").jQCloud($scope.wordsCloud, {
                          width: 650,
                          height: 350
                        });
                    }
                });

        }
        
        /* Edita un investigador por el idResearcher */
        $scope.editKeywords = function (idKeywords){
            if (!$scope.updateKeywords.keywords || $scope.updateKeywords.keywords == ''){
                swal("There are no keywords", null, "info");
            }else{
                $http
                .put("/api/v1/keywords/"+idKeywords,$scope.updateKeywords)
                .then(function(response) {
                    refresh();
                    swal("Keywords edited!", null, "success");
                }, function(error){
                    swal("Please check all the fields. Thank you so much!", null, "warning");
                });
            }
        }

        refresh();

    }]);