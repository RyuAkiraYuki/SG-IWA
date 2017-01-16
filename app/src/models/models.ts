/// <reference path="./../_all.ts" />

module WeeklyManagerApp {
    export class User {
        constructor(public name:string,
                    public avatar:string,
                    public bio:string,
                    public notes:Note[]) {
        }
    }

    export class Note {
        constructor(public title:string,
                    public date:Date) {
        }
    }

    export class Tab {
        constructor(public title:string,
                    //public content:string,
                    public visits:CustomerVisit[]) {
        }
    }

    export class CustomerVisit {
        constructor(public fromHour:sgTime,
                    public toHour:sgTime,
                    public customerName:string,
                    public desciption:string,
                    public actualHours:string) {
        }
    }

    export class sgTime {
        constructor(public time:string,
                    public period:string,
                    public date:string) {

        }
    }

    export class sgTokenResult {
        constructor(public token:string,
                    public isSuccess:boolean) {

        }
    }
}