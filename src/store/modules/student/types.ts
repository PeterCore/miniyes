export interface StudentInfo {
  student_id?: string;
  name: string;
  remark: string;
  spell_name: string;
}

export interface StudentState {
  students: StudentInfo[];
}
