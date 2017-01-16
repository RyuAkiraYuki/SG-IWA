/// <reference path="./../_all.ts" />

module WeeklyManagerApp {

    import IDeferred = angular.IDeferred;
    import IHttpResponseTransformer = angular.IHttpResponseTransformer;
    import ILocationService = angular.ILocationService;
    import IRouteParamsService = angular.route.IRouteParamsService;
    export interface IReportService {
        getToken(user:any):ng.IPromise<any>;
        getReport(token:string):ng.IPromise<any>;
        // getTokenOnLoad():ng.IPromise<any>;
        getTokenOnLoad():sgTokenResult;
        arrangeVisits(rows:any[], cols:Column[]):CustomerVisit[];
        buildTabs(visits:CustomerVisit[]):Tab[];
        getEmployee(rows:any[], cols:Column[]):sgEmployee;
    }

    export class ReportService implements IReportService {

        static $inject = ['$q', '$http', '$location', '$routeParams'];

        constructor(private $q:ng.IQService, private $http:ng.IHttpService,
                    private $location:ng.route.IRouteParamsService,
                    private $routeParams:IRouteParamsService) {

        }

        currentWeeksMonday:any;

        // A method dedicated to retriev the token
        getToken(user:any):ng.IPromise<any> {
            var self = this;

            var deferred = this.$q.defer();
            var tokenRequestLink:string = "grant_type=password&username=[user]&password=[pswd]&client_id=099153c2625149bc8ecb3e85e03f0022&client_secret=IxrAjDoa2FqElO7IhrSrUJELhUckePEPVpaePlS_Xaw";

            var urlEncodedData:string = tokenRequestLink.replace('[user]', user.userName);
            urlEncodedData = urlEncodedData.replace('[pswd]', user.password);

            this.$http({
                method: 'POST',
                url: "https://skygiraffeauthorizationserver.skygiraffe.com/oauth2/token",
                // url: "https://sgwin2012r2.skygiraffe.com/skygiraffeauthorizationserver/oauth2/token",
                data: urlEncodedData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Accept": "application/json"
                }
            }).then((response:any)=> {
                // Resolving token response
                deferred.resolve(response)
            }, (error:any)=> {
                // Resolving token error
                deferred.reject(error);
            });


            return deferred.promise;
        }

        // A method dedicated to get the report
        getReport(token:string):ng.IPromise<any> {

            var self:ReportService = this;
            var deferred:IDeferred = self.$q.defer();

            var getReportUrl:string = "https://sgwin2012r2.skygiraffe.com/publisher/api/v1/Report";
            var parametrizedReportUrl1:string = "https://sgwin2012r2.skygiraffe.com/publisher/api/v1/ParameterizedReport";
            var parametrizedReportUrl:string = "https://publisher.skygiraffe.com/api/v1//ParameterizedReport";

            // Hard-coding data for the very specific report
            // --- | Igor app | ---
            // "ApplicationID": "384da1b0-bf94-4625-a452-f4baa3bd4617",
            // ---IWA-2---------"5dacf67f-9c4b-4fb3-b970-287f88d6d9b6"
            // ---IWA-1---------"87684799-7e43-4253-8cee-3666722f190d"
            // "ReportID": "866849c5-1629-4e75-8ebd-ac6136eaf025",
            // ---IWA-2---------"57994188-bffb-4054-8696-e02f43f090cf"
            // ---IWA-1---------"88af9607-670a-4787-be89-a5f4ff85942c"
            // "ParameterID": "55f66bba-3dbc-4870-9e34-0454168d3635",
            // ---IWA-2---------"04a5579a-545e-432e-b7f3-d02cd0fb0581"
            // ---IWA-1---------"cf2b9362-064f-4fdf-87a1-fb3f7d92c714"
            // --- | Yev app | ---
            // "ApplicationID": "e652834c-8c0c-4fe5-9866-d884ae2e499c",
            // "ReportID": "8b2b910d-96c2-48fb-a786-1552cdbb8046",
            // "ParameterID": "92fbf42d-db49-42de-a60d-491aaa7b2f35",
            // --- | johnsmith app | ---
            // "ApplicationID": "63446f9a-ab3b-421f-afb4-2d80eb69927a",
            // "ReportID": "37aedafd-d410-4223-835c-5684831db0e4",
            // "ParameterID": "3cf9db4e-7534-41be-86a6-78623f82f238",

            let parametrizedData = {
                "ApplicationID": "63446f9a-ab3b-421f-afb4-2d80eb69927a",
                "ReportID": "37aedafd-d410-4223-835c-5684831db0e4",
                "TabID": null,
                "Parameters": [{
                    "ParameterID": "3cf9db4e-7534-41be-86a6-78623f82f238",
                    "ParameterLabel": "@login",
                    "ValueID": "",
                    "ValueLabel": ""
                }]
            }
            self.$http({
                url: parametrizedReportUrl,
                data: parametrizedData,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "application/json",
                    'Authorization': "bearer " + token
                }
            }).then((response:any)=> {
                deferred.resolve(response);
            }, (error:any)=> {
                deferred.resolve(error);
            });

            return deferred.promise;
        }

        // A helper method to get value from a row by a column name that maps items in this row
        getValueFromRowByColumnName(row:any, cols:Column[], columnName:string):string {
            console.log(_.findWhere(cols, {DataItemColumnName: columnName}));
            if(_.isUndefined(_.findWhere(cols, {DataItemColumnName: columnName}))){
                debugger;
            }
            return row[_.findWhere(cols, {DataItemColumnName: columnName})["DataItemColumnID"]];
        }

        // A method that builds data for the ViewModel that is going to render the visits
        arrangeVisits(rows:any[], cols:Column[]):CustomerVisit[] {
            var self:ReportService = this;
            var visits:CustomerVisit[] = [];

            for (let row of rows) {
                var fromTime = self.getValueFromRowByColumnName(row, cols, 'start_time');
                var toTime = self.getValueFromRowByColumnName(row, cols, 'end_time');

                var fromHour:sgTime = new sgTime(
                    moment(fromTime).format('hh:mm'),
                    moment(fromTime).format('a').toUpperCase(),
                    moment(fromTime).format('MMMM DD YYYY')
                );

                var toHour:sgTime = new sgTime(
                    moment(toTime).format('hh:mm'),
                    moment(toTime).format('a').toUpperCase(),
                    moment(toTime).format('MMMM DD YYYY')
                );

                var customerName:string = self.getValueFromRowByColumnName(row, cols, 'client_name').replace(/\s+/g, ' ');
                var desciption:string = self.getValueFromRowByColumnName(row, cols, 'description').replace(/\s+/g, ' ');
                var actualHours:string = moment(toTime).hours() - moment(fromTime).hours();


                var visit:CustomerVisit = new CustomerVisit(
                    fromHour, toHour, customerName,
                    desciption, actualHours
                );
                visits.push(visit);
            }

            return visits;
        }

        // getTokenOnLoad():ng.IPromise<any> {
        //     var self:ReportService = this;
        //     var deferred:IDeferred = self.$q.defer();
        //
        //     var result = self.getQueryStringValue('token');
        //     if (result != "") {
        //         deferred.resolve(result);
        //     } else {
        //         deferred.reject('There is No Token To Procceed');
        //     }
        //
        //
        //     return deferred.promise;
        // }

        //Getting the token on page load
        getTokenOnLoad():sgTokenResult {
            var self:ReportService = this;
            var deferred:IDeferred = self.$q.defer();

            // Retrieving token from url
            var token:string = self.getQueryStringValue('token');

            var result:sgTokenResult = new sgTokenResult(
                'There is No Token To Procceed',
                false
            );

            if (token != "") {
                result.token = token;
                result.isSuccess = true;
            }
            return result;

        }

        getQueryStringValue(key):any {
            return decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
        }

        buildTabs(visits:CustomerVisit[]):Tab[] {
            var self:ReportService = this;
            var tabs:Tab[] = [];

            var currentWeeksMonday:any = moment().startOf('isoWeek');
            self.currentWeeksMonday = currentWeeksMonday;
            for (let i = 0; i < 5; i++) {

                var currentDaysVisits:CustomerVisit[] = [];

                currentDaysVisits = _.filter(visits, function (visit) {
                    var visitDayNumber:number = +moment(visit.toHour.date).format('D');
                    var currentDayNumber:number = +moment(self.currentWeeksMonday).format('D') + i;
                    return visitDayNumber == currentDayNumber;
                });

                var tab:Tab = new Tab(
                    moment(self.currentWeeksMonday).add(i, 'days').format('DD'),
                    currentDaysVisits
                );

                tabs.push(tab);
            }

            return tabs;
        }

        getEmployee(rows:any[], cols:Column[]):sgEmployee {
            var self:ReportService = this;
            var employee:sgEmployee = null;

            for (let row of rows) {
                var employeeName:string = self.getValueFromRowByColumnName(row, cols, 'Employee_Name').replace(/\s+/g, ' ');
                var employeeTitle:string = self.getValueFromRowByColumnName(row, cols, 'Employee_Title').replace(/\s+/g, ' ');
                var imgUrl:string = self.getValueFromRowByColumnName(row, cols, 'IMG_Url').replace(/\s+/g, ' ');
                employee = new sgEmployee(employeeName, employeeTitle, imgUrl);
            }

            return employee;
        }

    }
}