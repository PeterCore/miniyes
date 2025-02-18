export interface StudentInfo {
  student_id?: string | null;
  name: string;
  remark: string;
  spell_name: string;
  genders: number;
  phone?: string;
}

export interface StudentState {
  students: StudentInfo[];
}
