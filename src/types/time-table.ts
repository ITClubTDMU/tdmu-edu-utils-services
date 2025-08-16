import { TDB } from './db';

export type TTimeTable = TDB['timetable']['Row'];

export type TTimeTableInsert = TDB['timetable']['Insert'];

export type TTimeTableUpdate = TDB['timetable']['Update'];

export type TTimeTablePeriod = TDB['periods_in_day']['Row'];
export type TTimeTablePeriodInsert = TDB['periods_in_day']['Insert'];

export type TTimeTableSemester = TDB['semesters']['Row'];

export type TTimeTableWeek = TDB['timetable_weeks']['Row'];

// CUSTOM
