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
    <z-paging ref="pagingRef" @query="queryList" :auto="false" @onRefresh="onRefresh" :use-page-scroll="true">

    <view v-for="(item, index) in timeTables" :key="index">
      <up-card :border="false" padding="20rpx 20rpx 20rpx" margin="10rpx 20rpx" :title="item.course_name" title-color="#ff7043" :sub-title="item.schedule_time.split(' ')[1]" @body-click="onSelected(item.timetable_id ?? '')">
        <template #body>
          <!-- <view class="mb-[20rpx]">
            <up-line-progress :percentage="0" height="20rpx" active-color="#3ed268" :show-text="true" />
          </view> -->

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
        <template #foot>
          <view class="flex flex-row items-center justify-between">
            <text class="bg-[#fe9831] p-[5rpx] text-[24rpx] text-[#fff]">
              {{ item.status === TimetableStatus.not_started ? '未开始' : '已结束' }}
            </text>
            <view v-if="item.status === TimetableStatus.not_started">
              <button class="button" @click="onStartCourse">
                开 始
              </button>
            </view>
          </view>
        </template>
      </up-card>
    </view>
  </z-paging>
  </view>
</template>

<script setup lang="ts">
import type { TimetableInfo } from '@/store/modules/classtimetable/types';
import { useTimetableStore } from '@/store/index';
import { TimetableStatus } from '@/store/modules/classtimetable/types';
import { ref } from 'vue';
import { usePermission } from '@/hooks';

let currentPage = 1;

const pagingRef = ref<InstanceType<typeof zPaging> | null>(null);


const useStore = useTimetableStore();
const timeTables = ref<TimetableInfo[]>([]);

onShow(async () => {
  const hasPermission = await usePermission();
  if(hasPermission){
   await fetchTimetables(1, 10,true);
   const list = timeTables.value;
  pagingRef.value?.complete(list);
  currentPage++;

  }
  console.log(hasPermission ? '已登录' : '未登录，拦截跳转');
});

const queryList = async () => {
  console.log('query list');
  let isRefresh = true;
  if (currentPage !== 1) {
    isRefresh = false;
  }
  await fetchTimetables(currentPage, 10,isRefresh);
  const list = timeTables.value;
  pagingRef.value?.complete(list);
  currentPage++;

}

const onRefresh = async () => {
  console.log('onRefresh list');
  currentPage = 1;
};

const onSelected = (timetableId: string) => {
  console.log('selected timetable id is ', timetableId);
  uni.navigateTo({ url: `/pages/timetable-detail/index?Id=${timetableId}` });
};

const onStartCourse = () => {
  console.log('start course');
};

const sortByTimeDesc = (items: TimetableInfo[]): TimetableInfo[] => {
  return [...items].sort((a, b) => {
    // 将时间转换为可比较的格式
    const parseTime = (timeStr: string) => {
      const [datePart, timePart] = timeStr.split(' ');
      const [year, month, day] = datePart.split('-').map(Number);
      const [startTime, _] = timePart.split('-');
      const [hour, minute] = startTime.split(':').map(Number);
      const dateTime = new Date(year, month - 1, day, hour, minute).getTime();
      return dateTime;
    };

    try {
      return parseTime(b.schedule_time) - parseTime(a.schedule_time);
    }
    catch (error) {
      console.error('时间格式错误:', error);
      return 0;
    }
  });
};

const fetchTimetables = async (page: number, pageSize: number , isRefresh: boolean) => {
  uni.showLoading({ title: '加载中...' });
  const params = {
    page,
    pageSize,
  };
  const res = await useStore.fectchTimetable(params,isRefresh);
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



const unsubscribe = useStore.$subscribe((_mutation: any, _state: any) => {
  if (_mutation.storeId === 'classtimetable') {
    const value = useStore.getAllTimetable;
    timeTables.value = sortByTimeDesc(value);
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
  @apply bg-[#1db147] mr-20rpx text-white rounded-full w-[50px] h-[50px] flex items-center justify-center;
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
  @apply h-[60rpx] w-[180rpx] text-[24rpx] text-white flex-shrink-0 flex-row mr-[10rpx] bg-[#21d59d] items-center transition-all duration-300 hover:bg-[#21d59d] hover:shadow-[0_0_20px_#3ed268] hover:scale-110 active:bg-[#3ed268] active:scale-95 active:shadow-none
}
.button {
  @apply h-[50rpx] w-[120rpx] text-[21rpx] text-white flex-shrink-0 flex-row mr-[10rpx] bg-[#21d59d] items-center transition-all duration-300 hover:bg-[#21d59d] hover:shadow-[0_0_20px_#3ed268] hover:scale-110 active:bg-[#3ed268] active:scale-95 active:shadow-none
}

.cancel-button {
  @apply ml-[20rpx] h-[60rpx] w-[120rpx] text-[24rpx] text-white flex-shrink-0 flex-row mr-[10rpx] bg-[#21d59d] items-center transition-all duration-300 hover:bg-[#21d59d] hover:shadow-[0_0_20px_#3ed268] hover:scale-110 active:bg-[#3ed268] active:scale-95 active:shadow-none
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
