/// <reference path="./_all.ts" />

module WeeklyManagerApp {
    angular.module("weeklyManagerApp", [
            'ngMaterial', 'ngMdIcons', 'ngRoute'
        ])
        .service('tabService', TabService)
        .service('reportService', ReportService)
        .controller('mainController', MainController)
        .config(configurator);


    function configurator($mdIconProvider:angular.material.IIconProvider,
                          $mdThemingProvider:angular.material.IThemingProvider,
                          $routeProvider:ng.route.IRouteProvider):void {
        $mdIconProvider
            .defaultIconSet('./assets/svg/avatars.svg', 128)
            .icon('menu', './assets/svg/menu.svg', 24);
        $mdThemingProvider
            .theme('default')
            .primaryPalette('blue')
            .accentPalette('red');

        console.log($routeProvider);
        // $routeProvider.when('/',{
        //     controller: 'MainController as vm'
        // })
    }
}