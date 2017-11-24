angular.module("ResearcherManagerApp", ["ngRoute"])
    .config(function ($routeProvider){
        
        //Aqui se ejecuta el código tras cargar la aplicación.
        $routeProvider
            .when("/",{
                templateUrl: "/view/searchEngine.html",
                controller : "SearchEngineCtrl"
            }).when("/researchers",{
                templateUrl: "/view/list.html",
                controller : "ListCtrl",
            }).when("/researchers/:search",{
                templateUrl: "/view/list.html",
                controller : "ListCtrl",
            }).otherwise({
                redirectTo: '/'
            }); 
        
        console.log("App Initialized");            
        
    });