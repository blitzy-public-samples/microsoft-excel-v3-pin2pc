import * as ApiTypes from '../types/apiTypes';
import { Cell } from '../../shared/types/cell';
import { Chart } from '../../shared/types/chart';
import { Formula } from '../../shared/types/formula';
import { User } from '../../shared/types/user';
import { Workbook } from '../../shared/types/workbook';
import { Worksheet } from '../../shared/types/worksheet';

// WorkbookDTO class
export class WorkbookDTO {
    id: string;
    name: string;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
    metadata: ApiTypes.WorkbookMetadata;

    constructor(data: Partial<WorkbookDTO>) {
        Object.assign(this, data);
    }

    static fromModel(workbook: Workbook): WorkbookDTO {
        return new WorkbookDTO({
            id: workbook.id,
            name: workbook.name,
            ownerId: workbook.ownerId,
            createdAt: workbook.createdAt,
            updatedAt: workbook.updatedAt,
            metadata: workbook.metadata,
        });
    }

    toModel(): Workbook {
        return new Workbook({
            id: this.id,
            name: this.name,
            ownerId: this.ownerId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            metadata: this.metadata,
        });
    }
}

// WorksheetDTO class
export class WorksheetDTO {
    id: string;
    workbookId: string;
    name: string;
    index: number;
    metadata: ApiTypes.WorksheetMetadata;

    constructor(data: Partial<WorksheetDTO>) {
        Object.assign(this, data);
    }

    static fromModel(worksheet: Worksheet): WorksheetDTO {
        return new WorksheetDTO({
            id: worksheet.id,
            workbookId: worksheet.workbookId,
            name: worksheet.name,
            index: worksheet.index,
            metadata: worksheet.metadata,
        });
    }

    toModel(): Worksheet {
        return new Worksheet({
            id: this.id,
            workbookId: this.workbookId,
            name: this.name,
            index: this.index,
            metadata: this.metadata,
        });
    }
}

// CellDTO class
export class CellDTO {
    id: string;
    worksheetId: string;
    column: string;
    row: number;
    value: ApiTypes.CellValue;
    formula: Formula | null;
    format: ApiTypes.CellFormat | null;

    constructor(data: Partial<CellDTO>) {
        Object.assign(this, data);
    }

    static fromModel(cell: Cell): CellDTO {
        return new CellDTO({
            id: cell.id,
            worksheetId: cell.worksheetId,
            column: cell.column,
            row: cell.row,
            value: cell.value,
            formula: cell.formula,
            format: cell.format,
        });
    }

    toModel(): Cell {
        return new Cell({
            id: this.id,
            worksheetId: this.worksheetId,
            column: this.column,
            row: this.row,
            value: this.value,
            formula: this.formula,
            format: this.format,
        });
    }
}

// ChartDTO class
export class ChartDTO {
    id: string;
    worksheetId: string;
    options: ApiTypes.ChartOptions;

    constructor(data: Partial<ChartDTO>) {
        Object.assign(this, data);
    }

    static fromModel(chart: Chart): ChartDTO {
        return new ChartDTO({
            id: chart.id,
            worksheetId: chart.worksheetId,
            options: chart.options,
        });
    }

    toModel(): Chart {
        return new Chart({
            id: this.id,
            worksheetId: this.worksheetId,
            options: this.options,
        });
    }
}

// UserDTO class
export class UserDTO {
    id: string;
    name: string;
    email: string;
    role: ApiTypes.UserRole;

    constructor(data: Partial<UserDTO>) {
        Object.assign(this, data);
    }

    static fromModel(user: User): UserDTO {
        return new UserDTO({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    }

    toModel(): User {
        return new User({
            id: this.id,
            name: this.name,
            email: this.email,
            role: this.role,
        });
    }
}

// Mapping functions
export function mapWorkbookListResponse(workbooks: Workbook[], totalCount: number): ApiTypes.WorkbookListResponse {
    return {
        workbooks: workbooks.map(workbook => WorkbookDTO.fromModel(workbook)),
        totalCount: totalCount,
    };
}

export function mapWorksheetListResponse(worksheets: Worksheet[], totalCount: number): ApiTypes.WorksheetListResponse {
    return {
        worksheets: worksheets.map(worksheet => WorksheetDTO.fromModel(worksheet)),
        totalCount: totalCount,
    };
}

export function mapCellRangeResponse(cells: Cell[], range: ApiTypes.CellRange): ApiTypes.CellRangeResponse {
    return {
        cells: cells.map(cell => CellDTO.fromModel(cell)),
        range: range,
    };
}

export function mapChartListResponse(charts: Chart[], totalCount: number): ApiTypes.ChartListResponse {
    return {
        charts: charts.map(chart => ChartDTO.fromModel(chart)),
        totalCount: totalCount,
    };
}

// Human tasks (commented)
/*
TODO: Human tasks for apiModels.ts

Required:
1. Review and validate the DTO structures to ensure they match the database models and API requirements
2. Implement any missing DTO classes or mapping functions for additional entities in the system

Optional:
3. Consider adding validation logic to the DTO classes to ensure data integrity
4. Evaluate the need for partial update DTOs to support PATCH operations
*/