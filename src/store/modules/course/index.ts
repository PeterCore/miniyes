import type { CourseInfo, CoursesState } from './types';
import { defineStore } from 'pinia';

export const useCourseStore = defineStore('course', {
  state: (): CoursesState => ({
    courses: [], // 初始化为空的课程列表
  }),
  actions: {
    commit(course: CourseInfo) {
      const courseIndex = this.courses?.findIndex(el => el.course_id === course.course_id);
      if (courseIndex !== undefined && courseIndex >= 0) {
        this.courses![courseIndex] = course; // 更新课程数据
      }
      else {
        this.courses?.push(course);
      }
    },
    // 添加课程
    addCourse(course: CourseInfo) {
      this.courses?.push(course); // 向课程列表中添加新课程
    },
    // 删除课程
    removeCourse(courseId: string) {
      try {
        this.courses = this.courses?.filter(el => (el.course_id ?? '0') !== courseId); // 根据 ID 删除课程
      }
      catch (error) {
        if (error instanceof Error) {
          console.log(`error is ${error}`);
        }
      }
    },
    existCourse(courseName: string) {
      let isExist = false;
      const courseIndex = this.courses?.findIndex(course => course.course_name === courseName);
      if (courseIndex !== undefined && courseIndex >= 0) {
        isExist = true;
      }
      return isExist;
    },
    // removeCourseWithName(courseName: string) {
    //   this.courses = this.courses?.filter(course => course.course_name !== courseName); // 根据 ID 删除课程
    // },
    // 更新课程
    updateCourse(updatedCourse: CourseInfo) {
      const courseIndex = this.courses?.findIndex(course => course.course_id === updatedCourse.course_id);
      if (courseIndex !== undefined && courseIndex >= 0) {
        this.courses![courseIndex] = updatedCourse; // 更新课程数据
      }
    },
  },
  getters: {
    // 获取所有课程
    getAllCourses: state => state.courses,
    // 获取特定课程
    getCourseById: state => (courseId: number) => {
      return state.courses?.find(course => course.course_id === courseId);
    },
  },
  persist: true,
});
