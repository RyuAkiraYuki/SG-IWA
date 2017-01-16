/// <reference path="./../_all.ts" />

module WeeklyManagerApp {
    import IMenuService = angular.material.IMenuService;

    export interface IUserService {
        loadAllUsers():ng.IPromise<User[]>;
        selectedUser:User;
    }

    export class UserService implements IUserService {
        static $inject = ['$q'];

        selectedUser:User = null;

        constructor(private $q:ng.IQService) {

        }

        loadAllUsers():ng.IPromise<User[]> {
            return this.$q.when(this.users);
        }

        private users:User[] = [
            {
                name: "Yahiko Sajiru",
                avatar: "svg-3",
                bio: "Lorem ipsum dolor sit amet, meliore adipiscing posidonium pro ut, sed in esse graece. Mei in noster alienum appellantur, cum dicta doming oblique eu. Ut dicat munere epicurei est. Sea epicuri lobortis consequat te. Ne natum idque primis quo, cum dicit patrioque laboramus te. Sit omnium percipitur no. Eos corpora periculis at.",
                notes: [
                    {
                        title: "Vim ea habeo quaerendum. Accusam abhorreant no quo, usu ne modo suas senserit, sea alia aliquip accusata ne. Per ex omnium ornatus senserit, veri consetetur theophrastus ex pro. Est movet everti platonem ei.",
                        date: new Date()
                    }
                ]
            },
            {
                name: "Yamamoko Sadahara",
                avatar: "svg-1",
                bio: "Lorem ipsum dolor sit amet, meliore adipiscing posidonium pro ut, sed in esse graece. Mei in noster alienum appellantur, cum dicta doming oblique eu. Ut dicat munere epicurei est. Sea epicuri lobortis consequat te. Ne natum idque primis quo, cum dicit patrioque laboramus te. Sit omnium percipitur no. Eos corpora periculis at.",
                notes: [
                    {
                        title: "Vim ea habeo quaerendum. Accusam abhorreant no quo, usu ne modo suas senserit, sea alia aliquip accusata ne. Per ex omnium ornatus senserit, veri consetetur theophrastus ex pro. Est movet everti platonem ei.",
                        date: new Date()
                    }
                ]
            },
            {
                name: "Rambo Nagasashi",
                avatar: "svg-2",
                bio: "Lorem ipsum dolor sit amet, meliore adipiscing posidonium pro ut, sed in esse graece. Mei in noster alienum appellantur, cum dicta doming oblique eu. Ut dicat munere epicurei est. Sea epicuri lobortis consequat te. Ne natum idque primis quo, cum dicit patrioque laboramus te. Sit omnium percipitur no. Eos corpora periculis at.",
                notes: [
                    {
                        title: "Vim ea habeo quaerendum. Accusam abhorreant no quo, usu ne modo suas senserit, sea alia aliquip accusata ne. Per ex omnium ornatus senserit, veri consetetur theophrastus ex pro. Est movet everti platonem ei.",
                        date: new Date()
                    }
                ]
            }
        ]
    }
}