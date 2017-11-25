angular.module("ResearcherManagerApp", ["ngRoute"])
    .config(function ($routeProvider){
        
        //Aqui se ejecuta el código tras cargar la aplicación.
        $routeProvider
            .when("/",{
                templateUrl: "/view/searchEngine.html",
                controller : "SearchEngineCtrl"
            })
            
            .when("/researchers",{
                templateUrl: "/view/list.html",
                controller : "ListCtrl"
            })
            
            .when("/researchers/:search",{
                templateUrl: "/view/list.html",
                controller : "ListCtrl"
            })
            
            .when("/secure",{
                templateUrl: "/view/searchEngine-secure.html",
                controller : "SearchEngineCtrl"
            })
            
            .when("/secure/researchers",{
                templateUrl: "/view/list.html",
                controller : "ListSecureCtrl"
            })
            
            .when("/secure/researchers/:search",{
                templateUrl: "/view/list.html",
                controller : "ListSecureCtrl"
            })
            
            .otherwise({
                redirectTo: '/'
            }); 
        
        console.log("App Initialized");            
        
    });