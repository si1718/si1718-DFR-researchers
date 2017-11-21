angular.module("ResearcherManagerApp", ["ngRoute"])
    .config(function ($routeProvider){
        
        //Aqui se ejecuta el código tras cargar la aplicación.
        $routeProvider
            .when("/",{
                templateUrl: "/view/list.html",
                controller : "ListCtrl"
            }).when("/researcher/:name",{
                templateUrl: "/view/edit.html",
                controller : "EditCtrl"
            });
        
        console.log("App Initialized");            
        
    });