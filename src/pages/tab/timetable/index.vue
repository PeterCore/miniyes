<template>
  <view class="page-container">
    <!-- 搜索框 -->
    <view class="h-[100rpx] flex-grow flex-col items-start bg-white p-20rpx">
      <view class="header-container">
        <view class="line" />
        <text class="title">
          排课列表
        </text>
        <button class="add-button" @click="onEditTimetable">
          + 新增排课
        </button>
      </view>
    </view>
    <view v-for="(item, index) in timeTables" :key="index">
      <up-card :border="false" padding="20rpx 20rpx 10rpx 30rpx" margin="10rpx 20rpx" :title="item.course_name" title-color="#ff7043" :sub-title="item.schedule_time.split(' ')[1]">
        <template #body>
          <view class="mb-[20rpx]">
            <up-line-progress :percentage="0" height="20rpx" active-color="#3ed268" :show-text="true" />
          </view>

          <view class="flex flex-col gap-[8rpx]">
            <view class="flex flex-row items-center justify-start">
              <text class="text-[24rpx] text-[#666]">
                教师：
              </text>
              <text class="text-[24rpx] text-[#ff7043]">
                {{ item.teacher.teacher_name }}
              </text>
            </view>
            <text class="text-[24rpx] text-[#666]">
              开始日期：{{ item.schedule_time.split(" ")[0] }}
            </text>
            <text class="text-[24rpx] text-[#666]">
              结束日期：{{ item.schedule_time.split(" ")[0] }}
            </text>
            <view class="flex flex-row items-center justify-start">
              <text class="text-[24rpx] text-[#666]">
                上课学员：
              </text>
              <text class="text-[24rpx] text-[#3ed268]">
                {{ item.students.map(item => item.student_name).join(',') }}
              </text>
            </view>
          </view>
          <view />
        </template>
      </up-card>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { TimetableInfo } from '@/store/modules/classtimetable/types';
import { useTimetableStore } from '@/store/index';
import { ref } from 'vue';

const useStore = useTimetableStore();
const timeTables = ref<TimetableInfo[]>([]);

const getTimetables = async (page: number, pageSize: number, isRefresh: boolean) => {
  uni.showLoading({ title: '加载中...' });
  const params = {
    page,
    pageSize,
  };
  const res = await useStore.getClassTimetable(params, isRefresh);
  uni.hideLoading();
  if (res[0] === true) {
    uni.$u.toast('加载成功');
    const value = useStore.getAllTimetable;
    timeTables.value = value;
    console.log('timetables is ', timeTables.value);
  }
  else {
    uni.$u.toast(res[1]);
  }
};

onLoad((_: any) => {
  getTimetables(1, 10, true);
});

const unsubscribe = useStore.$subscribe((_mutation: any, _state: any) => {
  if (_mutation.storeId === 'classtimetable') {
    const value = useStore.getAllTimetable;
    timeTables.value = value;
  }
  console.log('State changed:', _state);
  console.log('Mutation details:', _mutation);
});

// 组件卸载时取消监听
onUnmounted(() => {
  unsubscribe();
});

const onEditTimetable = () => {
  uni.navigateTo({ url: '/pages/edit-timetable/index' });
};
</script>

<style lang="scss" scoped>
.page-container {
  @apply bg-#f5f5f5 h-full w-full flex flex-col
}

.circle-container {
  @apply bg-#1db147 mr-20rpx text-white rounded-full w-[50px] h-[50px] flex items-center justify-center;
}

.circle-text {
  @apply text-2xl font-semibold ; /* 调整文字大小和粗细 */
}

.header-container {
  @apply h-90rpx flex justify-between items-center p-[10rpx] bg-white;
}
.search-container {
  @apply h-90rpx flex justify-between items-center  bg-white;
}

.line {
  @apply w-[4rpx] h-[30rpx] mr-30rpx bg-orange-500; /* 设置竖线的宽度、高度和颜色 */
}

.title {
  @apply text-[30rpx] font-bold text-gray-800;
}

.add-button {
  @apply h-[60rpx] w-[180rpx] text-[24rpx] text-white flex-shrink-0 flex-row mr-[10rpx] bg-[#21d59d] items-center transition-all duration-300 hover:bg-[#21d59d] hover:shadow-[0_0_20px_##3ed268] hover:scale-110 active:bg-[#3ed268] active:scale-95 active:shadow-none
}

.cancel-button {
  @apply ml-[20rpx] h-[60rpx] w-[120rpx] text-[24rpx] text-white flex-shrink-0 flex-row mr-[10rpx] bg-[#21d59d] items-center transition-all duration-300 hover:bg-[#21d59d] hover:shadow-[0_0_20px_##3ed268] hover:scale-110 active:bg-[#3ed268] active:scale-95 active:shadow-none
}

.group-container {
  margin-top: 0rpx;
}

.group-header {
  background-color: #f5f5f5;
  padding: 10rpx;
  font-weight: bold;
}

.group-letter {
  font-size: 24rpx;
  color: #333;
  font-weight: bold;
}

.member-card {
  margin: 10rpx 0;
}

u-avatar {
  margin-right: 10rpx;
}

u-search {
  margin-bottom: 20rpx;
}
</style>
