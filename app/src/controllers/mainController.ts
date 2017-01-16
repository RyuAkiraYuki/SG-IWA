/// <reference path="./../_all.ts" />

module WeeklyManagerApp {
    import ILocationService = angular.ILocationService;
    import IDialogService = angular.material.IDialogService;
    import IHttpProvider = angular.IHttpProvider;
    import IScope = angular.IScope;
    import IRootScopeService = angular.IRootScopeService;
    import IMedia = angular.material.IMedia;
    export class MainController {
        static $inject = ['reportService', '$mdDialog', '$scope', '$rootScope', '$mdMedia'];

        //private $httpProvider:IHttpProvider


        constructor(private reportService:IReportService,
                    private $mdDialog:IDialogService, private $scope:IScope,
                    private $rootScope:IRootScopeService, private $mdMedia:IMedia) {

            var self = this;

            self.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

            var tokenObject:sgTokenResult = self.reportService.getTokenOnLoad();

            if (tokenObject.isSuccess) {
                self.reportService.getReport(tokenObject.token)
                    .then((response:any)=> {
                        self.isLogin = false;
                        var sgResponse:SGResponse = <SGResponse>response.data;
                        var sgData:SGData = sgResponse.Data;
                        self.tabs = self.reportService.buildTabs(self.reportService.arrangeVisits(sgData.Data[0].Rows, sgData.Data[0].Columns));
                        self.employee = self.reportService.getEmployee(sgData.Data[1].Rows, sgData.Data[1].Columns);
                        self.week = ['Mon', 'Tue', 'Wen', 'Thu', 'Fri'];
                    });
            } else {
                self.$mdDialog.show(
                    self.$mdDialog.alert()
                        .parent(angular.element(document.querySelector('.weeklyManagerApp')))
                        .clickOutsideToClose(true)
                        .title('Authorization is required')
                        .textContent('The token is: \n' + tokenObject.token)
                        .ariaLabel('Authorization is required')
                        .ok('Login')
                    );
                self.isLogin = true;
            }


        }


        signIn(evt,scope):void {
            var self:MainController = this;
            self.reportService.getToken(scope.user)
                .then((response:any)=> {
                        console.log(response);
                        self.reportService.getReport(response.data.access_token)
                            .then((response:any)=> {
                                    var sgResponse:SGResponse = <SGResponse>response.data;
                                    var sgData:SGData = sgResponse.Data;
                                    self.tabs = self.reportService.buildTabs(self.reportService.arrangeVisits(sgData.Data[0].Rows, sgData.Data[0].Columns));
                                    self.employee = self.reportService.getEmployee(sgData.Data[1].Rows, sgData.Data[1].Columns);
                                    self.week = ['Mon', 'Tue', 'Wen', 'Thu', 'Fri'];
                                    self.isLogin = false;
                                },
                                (error:any)=> {
                                    self.isLogin = true;
                                    self.$mdDialog.show(
                                        self.$mdDialog.alert()
                                            .parent(angular.element(document.querySelector('.weeklyManagerApp')))
                                            .clickOutsideToClose(true)
                                            .title('Report response error')
                                            .textContent(error)
                                            .ariaLabel('An error occurred while trying to get report')
                                            .ok('OK')
                                    );
                                })
                    },
                    (error:any)=> {
                        self.isLogin = true;
                        self.$mdDialog.show(
                            self.$mdDialog.alert()
                                .parent(angular.element(document.querySelector('.weeklyManagerApp')))
                                .clickOutsideToClose(true)
                                .title('Token response error')
                                .textContent(error)
                                .ariaLabel('An error occurred while trying to get token')
                                .ok('OK')
                        );

                    })
        }


        showAlert(evt):void {
            var self = this;
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog
            self.$mdDialog.show({
                    controller: MainController,
                    templateUrl: './dist/view/login-dlg.html',
                    parent: angular.element(document.querySelector('.weeklyManagerApp')),
                    clickOutsideToClose: true
                    //fullscreen: useFullScreen
                })
                .then(function (answer) {
                    console.log(answer + ' - bang!');
                    self.reportService.getToken(answer)
                        .then((response:any)=> {

                                console.log(response);
                                self.reportService.getReport(response.data.access_token)
                                    .then((response:any)=> {
                                            var sgResponse:SGResponse = <SGResponse>response.data;
                                            var sgData:SGData = sgResponse.Data;
                                            self.tabs = self.reportService.buildTabs(self.reportService.arrangeVisits(sgData.Data[0].Rows, sgData.Data[0].Columns));
                                            self.week = ['Mon', 'Tue', 'Wen', 'Thu', 'Fri'];
                                        },
                                        (error:any)=> {
                                            self.$mdDialog.show(
                                                self.$mdDialog.alert()
                                                    .parent(angular.element(document.querySelector('.weeklyManagerApp')))
                                                    .clickOutsideToClose(true)
                                                    .title('Report response error')
                                                    .textContent(error)
                                                    .ariaLabel('An error occurred while trying to get report')
                                                    .ok('OK')
                                                //.targetEvent(evt)
                                            );
                                        })
                            },
                            (error:any)=> {
                                self.$mdDialog.show(
                                    self.$mdDialog.alert()
                                        .parent(angular.element(document.querySelector('.weeklyManagerApp')))
                                        .clickOutsideToClose(true)
                                        .title('Token response error')
                                        .textContent(error)
                                        .ariaLabel('An error occurred while trying to get token')
                                        .ok('OK')
                                    //.targetEvent(evt)
                                );

                            })
                    //$scope.status = 'You said the information was "' + answer + '".';
                }, function (error) {
                    console.log(error + ' - boom!');
                });


            // self.reportService.getTokenOnLoad()
            //     .then((response:any)=> {
            //         console.log(response);
            //         self.$mdDialog.show(
            //             self.$mdDialog.alert()
            //                 .parent(angular.element(document.querySelector('.weeklyManagerApp')))
            //                 .clickOutsideToClose(true)
            //                 .title('This is an alert title')
            //                 .textContent('The token is: \n' + response)
            //                 .ariaLabel('Alert Dialog Demo')
            //                 .ok('Got it!')
            //                 .targetEvent(evt)
            //         );
            //     });
        };


        cancel():void {
            var self = this;
            self.$mdDialog.cancel();
            self.$mdDialog.cancel();
        };

        tabs:Tab[] = [];
        week:String[] = [];
        report:Report = null;
        employee:sgEmployee = null;
        thisMonth: any = moment(new Date()).format('MMMM YYYY');
        selectedIndex:number = 0;
        customFullscreen:any = null;
        user:any = {userName: '', password: ''};
        isLogin:boolean = false;
    }
}