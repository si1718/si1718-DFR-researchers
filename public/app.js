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
            
            .when("/researchers/:idResearcher/edit", {
                templateUrl: "/view/edit.html",
                controller: "EditCtrl"
            })
            
            .when("/researchers/:idResearcher/view", {
                templateUrl: "/view/view.html",
                controller: "ViewCtrl"
            })
            
            .when("/secure",{
                templateUrl: "/view/searchEngine-secure.html",
                controller : "SearchEngineCtrl",
                resolve:{
                    "check":function($location){   
                        if(localStorage.getItem("accessToken") === null || localStorage.getItem('accessToken') == 'null'){
                            swal("You don't have permission to access /secure", null, "warning");
                            $location.path('/');
                        }
                    }
                }
            })
            
            .when("/secure/researchers",{
                templateUrl: "/view/list-secure.html",
                controller : "ListSecureCtrl",
                resolve:{
                    "check":function($location){   
                        if(localStorage.getItem("accessToken") === null || localStorage.getItem('accessToken') == 'null'){
                            swal("You don't have permission to access /secure", null, "warning");
                            $location.path('/');
                        }
                    }
                }
            })
            
            .when("/secure/researchers/:search",{
                templateUrl: "/view/list-secure.html",
                controller : "ListSecureCtrl",
                resolve:{
                    "check":function($location){   
                        if(localStorage.getItem("accessToken") === null || localStorage.getItem('accessToken') == 'null'){
                            swal("You don't have permission to access /secure", null, "warning");
                            $location.path('/');
                        }
                    }
                }
            })
            
            .when("/secure/researchers/:idResearcher/edit", {
                templateUrl: "/view/edit-secure.html",
                controller: "EditSecureCtrl",
                resolve:{
                    "check":function($location){   
                        if(localStorage.getItem("accessToken") === null || localStorage.getItem('accessToken') == 'null'){
                            swal("You don't have permission to access /secure", null, "warning");
                            $location.path('/');
                        }
                    }
                }
            })
            
            .when("/graphs",{
                templateUrl: "/view/graph.html",
                controller : "GraphCtrl"
            })
            
            .when("/sections",{
                templateUrl: "/view/sections.html",
                controller : "SectionCtrl"
            })
            
            .otherwise({
                redirectTo: '/'
            }); 
        
        console.log("App Initialized");            
        
    });