import type { GetTimetableParams } from '@/api/types/uniCloud';
import type { TimetableInfo, TimetableState } from './types';
import { TimetableApi } from '@/api';
import { defineStore } from 'pinia';

const useTimetableStore = defineStore('classtimetable', {
  state: (): TimetableState => ({
    timetables: [],
    totalPages: 0,
    total: 0,
    current: 1,
  }),
  actions: {
    async getTimetable(params: GetTimetableParams) {
      const res = await TimetableApi.getTimetableList(params);
      if (res.success) {
        const timetableList: TimetableInfo[] = res.data!.list.map((item: any) => ({
          timetable_id: item._id,
          course_id: item.course_id,
          status: item.status,
          teacher: item.teacher,
          students: item.students,
          course_name: item.course_name,
          schedule_time: item.schedule_time,
          remark: item.remark,
        }));
        this.timetables = timetableList;
      }
      else {
        this.timetables = [];
      }
      return [res?.success, res?.message];
    },

    async commit(timetable: TimetableInfo, isEdit: boolean) {
      if (!isEdit) {
        try {
          const timetable_id = await TimetableApi.createTimetable(timetable);
          timetable.timetable_id = timetable_id;
          this.timetables.push(timetable);
          return [true, '创建成功'];
        }
        catch (error) {
          if (error instanceof Error) {
            return [false, error.message];
          }
        }
      }
      else {
        try {
          const res = await TimetableApi.updateTimetable(timetable);
          if (res.success) {
            this.updateTimetable(timetable);
            return [true, res.message];
          }
        }
        catch (error) {
          if (error instanceof Error) {
            return [false, error.message];
          }
        }
      }
      return [false, '操作失败'];
    },

    async fectchTimetable(params: GetTimetableParams, isRefresh: boolean) {
      console.log('获取课表列表参数', JSON.stringify(params));
      const res = await TimetableApi.getTimetableList(params);
      if (res.success) {
         console.log('获取课表列表', JSON.stringify(res.data?.pagination));
          this.totalPages = res.data?.pagination.totalPages ?? 0;
          this.total = res.data?.pagination.total ?? 0;
          this.current = res.data?.pagination.current ?? 1;

        if (res.data!.list.length > 0) {
          const timetableList: TimetableInfo[] = res.data!.list.map((item: any) => ({
            timetable_id: item._id,
            course_id: item.course_id,
            status: item.status,
            teacher: item.teacher,
            students: item.students,
            course_name: item.course_name,
            schedule_time: item.schedule_time,
            remark: item.remark,
          }));
          console.log('获取课表列表',isRefresh);
          if(isRefresh) {
            this.timetables = timetableList;
          }else {
            this.timetables.push(...timetableList);
          }
        }
        return [true, res.message];
      }
      else {
        return [false, res.message];
      }
    },


    async deleteTimetable(timetableId: string) {
      const res = await TimetableApi.deleteTimetable(timetableId);
      if (res.success) {
        this.deleteStoreTimetable(timetableId);
        return [true, res.message];
      }
    },

    updateTimetable(updateTimetable: TimetableInfo) {
      const courseIndex = this.timetables?.findIndex(e => e.timetable_id === updateTimetable.timetable_id);
      if (courseIndex !== undefined && courseIndex >= 0) {
        this.timetables![courseIndex] = updateTimetable; // 更新课程数据
      }
    },

    deleteStoreTimetable(timetableId: string) {
      this.timetables = this.timetables?.filter(course => course.timetable_id !== timetableId); // 根据 ID 删除课程
    },

  },
  getters: {
    getCurrent: state => state.current,
    getAllTimetable: state => state.timetables,
    getTotalPages: state => state.totalPages,
    getTotal: state => state.total,
    getTimeTableById: state => (timetableId: string) => {
      return state.timetables?.find(e => e.timetable_id === timetableId);
    },

    // getTimetable(state) {
    //   return state.timetable;
    // },
  },

  persist: true,

});
export default useTimetableStore;
