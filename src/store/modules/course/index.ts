import type { CourseInfo, CoursesState } from './types';
import { CourseApi } from '@/api';
import { defineStore } from 'pinia';

const useCourseStore = defineStore('course', {
  state: (): CoursesState => ({
    courses: [], // 初始化为空的课程列表
  }),
  actions: {
    async getAllcourseList() {
      const response = await CourseApi.getCourses(1, 10);
      if (response?.success) {
        const result = response.data;
        if (result === undefined) {
          this.courses = [];
        }
        else {
          const courseList: CourseInfo[] = result.map((item: any) => ({
            course_id: item._id,
            course_cost: item.course_cost,
            course_duration: item.course_duration,
            course_name: item.course_name,
            course_type: item.course_type,
          }));
          this.courses = courseList;
        }
      }
    },

    async commit(course: CourseInfo, isEdit: boolean) {
      if (isEdit) {
        const response = await CourseApi.updateCourse(course.course_id ?? '0', course.course_name, course.course_duration ?? 0, course.course_cost ?? 0, course.course_type ?? '文化');
        if (response.success) {
          this.updateCourse(course);
        }
        return [response.message, response.success];
      }
      else {
        const response = await CourseApi.createCourse(course.course_name, course.course_duration ?? 0, course.course_cost ?? 0, course.course_type ?? '文化');
        if (response.success) {
          course.course_id = `${response.course_id}`;
          this.addCourse(course);
        }
        return [response.message, response.success];
      }
    },
    // 添加课程
    addCourse(course: CourseInfo) {
      this.courses?.push(course); // 向课程列表中添加新课程
    },
    // 删除课程
    async removeCourse(courseId: string) {
      const response = await CourseApi.deleteCourse(courseId);
      if (response.success) {
        try {
          this.courses = this.courses?.filter(el => (el.course_id ?? '0') !== courseId); // 根据 ID 删除课程
        }
        catch (error) {
          if (error instanceof Error) {
            console.log(`error is ${error}`);
          }
          return [`${error}`, response.success];
        }
      }
      return [response.message, response.success];
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
    getCourseById: state => (courseId: string) => {
      return state.courses?.find(course => course.course_id === courseId);
    },
  },
  persist: true,
});
export default useCourseStore;
