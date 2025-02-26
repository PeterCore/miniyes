import type { GetTimetableParams } from '@/api/types/uniCloud';
import type { TimetableInfo, TimetableState } from './types';
import { TimetableApi } from '@/api';
import { defineStore } from 'pinia';

const useTimetableStore = defineStore('classtimetable', {
  state: (): TimetableState => ({
    timetables: [],
  }),
  actions: {
    async getTimetable(params: GetTimetableParams) {
      const res = await TimetableApi.getTimetableList(params);
      if (res.success) {
        this.timetables = res.data!.list;
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

    async getClassTimetable(params: GetTimetableParams, isRefresh: boolean) {
      if (isRefresh) {
        const res = await TimetableApi.getTimetableList(params);
        if (res.success) {
          this.timetables = res.data!.list;
          return [true, res.message];
        }
        else {
          return [false, res.message];
        }
      }
      else {
        this.timetables = this.timetables?.slice((params.page! - 1) * params.pageSize!, params.page! * params.pageSize!);
        return [true, '获取成功'];
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
    getAllTimetable: state => state.timetables,

    // getTimetable(state) {
    //   return state.timetable;
    // },
  },

  persist: true,

});
export default useTimetableStore;
