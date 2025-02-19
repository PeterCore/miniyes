export interface TeacherInfo {
  teacher_id?: string | null;
  name: string;
  remark: string;
  spell_name: string;
  genders: number;
  phone?: string;
  role: string;
  class_timetable: string[];
}

export interface TeacherState {
  teachers: TeacherInfo[];
}
