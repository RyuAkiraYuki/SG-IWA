/// <reference path="./../_all.ts" />

module WeeklyManagerApp {
    export class Report {
        constructor(public Columns:Column[],
                    public DataItemID:string,
                    public DataItemName:string,
                    public NumOfColumns:number,
                    public UpdateID:string,
                    public StructureType:string,
                    public Rows:any[],
                    public WasDataTrimmed:boolean) {
        }
    }

    export class Column {
        constructor(public ColumnWidestValue:string,
                    public DataItemColumnID:string,
                    public DataItemColumnName:string,
                    public DataType:string,
                    public IsPrimaryKey:string) {
        }
    }

    export class Token {
        constructor(public access_token:string,
                    public token_type:string,
                    public refresh_token:string,
                    public expires_in:number) {

        }
    }

    export class SGResponse {
        constructor(public Data:SGData,
                    public ReportMetaData:SGMetaData,
                    public Msg:string,
                    public Status:number) {
        }
    }

    export class SGMetaData {
        constructor() {

        }
    }

    export class Slicer {
        constructor() {

        }
    }

    export class SGData {
        constructor(public Data:Report[],
                    public SlicerMembers:Slicer[]) {

        }
    }

    export class sgEmployee {
        constructor(public Employee_Name:string,
                    public Employee_Title:string,
                    public IMG_Url:string) {

        }
    }

// export interface IRowCell {
//     cellName: string
// }
//
// export interface IRow {
//     ID:number;
//     [field:string]:IRowCell;
// }

// export class Row implements IRow {
//     ID:number = null;
//     constructor(public id:number, public columns:Column[]){
//         var self = this;
//
//         self.ID = id;
//         for(let i in columns){
//             self[<Column>i.DataItemColumnID]
//         }
//
//     }
// }
}