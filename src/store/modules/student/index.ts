import type { StudentInfo, StudentState } from './types';
import { StudentApi } from '@/api';
import { defineStore } from 'pinia';

const useStudentStore = defineStore('student', {
  state: (): StudentState => ({
    students: [], // 初始化为空的学生列表
  }),
  actions: {
    async commit(student: StudentInfo, isEdit: boolean) {
      if (isEdit) {
        const response = await StudentApi.addStudent(student);
        if (response?.success) {
          student.student_id = response.id;
          this.addStd(student);
        }
        return [response?.success, response?.message];
      }
      else {
        const res = await StudentApi.updateStudent(student);
        if (res?.success) {
          student.student_id = res.id;
          this.updateStudent(student);
        }
        return [res?.success, res?.message];
      }
    },
    // 添加学生
    addStd(student: StudentInfo) {
      this.students?.push(student); // 向课程列表中添加新课程
    },
    // 删除学生
    async deletedStd(studentId: string) {
      const response = await StudentApi.deleteStudent(studentId);
      if (response.success) {
        try {
          this.students = this.students?.filter(el => (el.student_id ?? '0') !== studentId); // 根据 ID 删除课程
        }
        catch (error) {
          if (error instanceof Error) {
            console.log(`error is ${error}`);
            if (error instanceof Error) {
              console.log(`error is ${error}`);
            }
            return [response.success, `${error}`];
          }
        }
      }
      else {
        return [response.success, response.message];
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
    updateStudent(updateStd: StudentInfo) {
      const courseIndex = this.students?.findIndex(e => e.student_id === updateStd.student_id);
      if (courseIndex !== undefined && courseIndex >= 0) {
        this.students![courseIndex] = updateStd; // 更新课程数据
      }
    },
  },
  getters: {
    getAllStudents: state => state.students,
    getStudentById: state => (stdId: string) => {
      return state.students?.find(e => e.student_id === stdId);
    },
  },
  persist: true,
});
export default useStudentStore;
