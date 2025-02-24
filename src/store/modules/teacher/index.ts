import type { TeacherInfo, TeacherState } from './types';
import { TeacherApi } from '@/api';
import { defineStore } from 'pinia';

const userTeacherStore = defineStore('teacher', {
  state: (): TeacherState => ({
    teachers: [], // 初始化为空的学生列表
  }),
  actions: {

    async getTeachers(forceRefresh = false) {
      if (!forceRefresh && this.teachers.length > 0) {
        return this.teachers;
      }

      try {
        const teachers = await TeacherApi.getTeachers();
        this.teachers = teachers;
        return [true, '获取成功'];
      }
      catch (error) {
        console.error('获取教师列表失败:', error);
        if (error instanceof Error) {
          return [false, error.message];
        }
      }
    },

    async commit(teacher: TeacherInfo, isEdit: boolean) {
      if (!isEdit) {
        try {
          const teacherId = await TeacherApi.createTeacher(teacher);
          console.log('创建成功，ID:', teacherId);
          teacher.teacher_id = teacherId;
          this.addTeacher(teacher);
        }
        catch (error) {
          if (error instanceof Error) {
            return [false, error.message];
          }
        }
        return [true, '创建成功'];
      }
      else {
        try {
          await TeacherApi.updateTeacher(teacher.teacher_id ?? '0', teacher);
          this.updateTeacher(teacher);
        }
        catch (error) {
          if (error instanceof Error) {
            console.log(`error is ${error}`);
            return [true, error.message];
          }
        }
        return [true, '更新成功'];
      }
    },
    // 添加老师
    addTeacher(teacher: TeacherInfo) {
      this.teachers?.push(teacher); // 向课程列表中添加新课程
    },
    // 删除老师
    async deletedTeacher(teacherId: string) {
      try {
        await TeacherApi.deleteTeacher(teacherId);
        this.teachers = this.teachers?.filter(el => (el.teacher_id ?? '0') !== teacherId); // 根据 ID 删除课程
        return [true, '删除成功'];
      }
      catch (error) {
        if (error instanceof Error) {
          console.log(`error is ${error}`);
          return [true, error.message];
        }
      }
    },

    existTeacher(teacherId: string) {
      let isExist = false;
      const index = this.teachers?.findIndex(e => e.teacher_id === teacherId);
      if (index !== undefined && index >= 0) {
        isExist = true;
      }
      return isExist;
    },
    // clearCurrentTeacher() {
    //   this.currentTeacher = null
    // }
    // removeCourseWithName(courseName: string) {
    //   this.courses = this.courses?.filter(course => course.course_name !== courseName); // 根据 ID 删除课程
    // },
    // 更新课程
    updateTeacher(updateTeacher: TeacherInfo) {
      const courseIndex = this.teachers?.findIndex(e => e.teacher_id === updateTeacher.teacher_id);
      if (courseIndex !== undefined && courseIndex >= 0) {
        this.teachers![courseIndex] = updateTeacher; // 更新课程数据
      }
    },
  },
  getters: {
    getAllTeachers: state => state.teachers,
    getTeacherById: state => (teacherId: string) => {
      return state.teachers?.find(e => e.teacher_id === teacherId);
    },
  },
  persist: true,
});
export default userTeacherStore;
