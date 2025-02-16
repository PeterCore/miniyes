import type { StudentInfo, StudentState } from './types';
import { defineStore } from 'pinia';

const useStudentStore = defineStore('student', {
  state: (): StudentState => ({
    students: [], // 初始化为空的课程列表
  }),
  actions: {
    commit(student: StudentInfo) {
      const courseIndex = this.students?.findIndex(el => el.student_id === student.student_id);
      if (courseIndex !== undefined && courseIndex >= 0) {
        this.students![courseIndex] = student; // 更新课程数据
      }
      else {
        this.students?.push(student);
      }
    },
    // 添加课程
    addStd(student: StudentInfo) {
      this.students?.push(student); // 向课程列表中添加新课程
    },
    // 删除课程
    removeStd(studentId: string) {
      try {
        this.students = this.students?.filter(el => (el.student_id ?? '0') !== studentId); // 根据 ID 删除课程
      }
      catch (error) {
        if (error instanceof Error) {
          console.log(`error is ${error}`);
        }
      }
    },
    existStd(studentId: string) {
      let isExist = false;
      const index = this.students?.findIndex(e => e.student_id === studentId);
      if (index !== undefined && index >= 0) {
        isExist = true;
      }
      return isExist;
    },
    // removeCourseWithName(courseName: string) {
    //   this.courses = this.courses?.filter(course => course.course_name !== courseName); // 根据 ID 删除课程
    // },
    // 更新课程
    updateCourse(updateStd: StudentInfo) {
      const courseIndex = this.students?.findIndex(e => e.student_id === updateStd.student_id);
      if (courseIndex !== undefined && courseIndex >= 0) {
        this.students![courseIndex] = updateStd; // 更新课程数据
      }
    },
  },
  getters: {
    getAllStudent: state => state.students,
    getStudentById: state => (stdId: string) => {
      return state.students?.find(e => e.student_id === stdId);
    },
  },
  persist: true,
});
export default useStudentStore;
