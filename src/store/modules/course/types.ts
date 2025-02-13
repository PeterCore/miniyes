export interface CourseInfo {
  course_id?: string;
  course_name: string;
  course_duration?: number;
  course_cost?: number;
  course_type?: string;
}

export interface CoursesState {
  courses?: CourseInfo[];
}
