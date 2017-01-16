/// <reference path="./../_all.ts" />

module WeeklyManagerApp {
    import IMenuService = angular.material.IMenuService;
    
    export interface ITabService {
        loadAllTabs():ng.IPromise<Tab[]>;
        selectedTab:Tab;
    }

    export class TabService implements ITabService {
        static $inject = ['$q'];

        selectedTab:Tab = null;

        constructor(private $q:ng.IQService) {

        }

        loadAllTabs():ng.IPromise<Tab[]> {
            return this.$q.when(this.tabs);
        }

        private tabs:Tab[] = [
        ]
    }
}