export interface TeacherInfo {
  teacher_id?: string;
  name: string;
  remark: string;
  spell_name: string;
  genders: number;
  phone?: string;
  role: string;
  class_timetable: string[];
  create_time?: Date;
  update_time?: Date;
}

export interface TeacherState {
  teachers: TeacherInfo[];
}
