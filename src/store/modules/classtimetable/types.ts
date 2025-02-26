export interface TimetableInfo {
  timetable_id?: string;
  course_id: string;
  course_name: string;
  status: string;
  teacher: {
    teacher_id: string;
    teacher_name: string;
  };
  students: Array<{
    student_id: string;
    student_name: string;
  }>;
  schedule_time: string;
  remark?: string;
}
export interface TimetableState {
  timetables: TimetableInfo[];
}

export enum TimetableStatus {
  not_started = 'not_started',
  in_progress = 'in_progress',
  completed = 'completed',
  expired = 'expired',
}
