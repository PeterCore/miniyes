<template>
  <view class="h-full w-full flex flex-col">
    <view class="mb-[10rpx] w-full flex flex-row items-center justify-between border-b border-gray-200 bg-white py-3">
      <view class="w-15" />
      <view class="w-full flex flex-row items-center justify-start">
        <u-icon name="list-dot" color="text-orange-500" size="24" />
        <view class="text-30">
          课程列表
        </view>
      </view>
      <view class="w-full" />
      <button class="add-course-btn" @tap="pushCreateCoursePage">
        + 新增课程
      </button>
      <view class="w-20" />
    </view>
    <view v-for="(item, index) in courses" :key="index">
      <view class="bg-white">
        <u-cell :title="`${item.course_name}` " is-link @click="goSchedulePage(item.course_id ?? '0')" />
      </view>
    </view>
    <view v-if="(courses || []).length > 0">
      <view class="mt-[1rpx] h-[80rpx] w-full flex flex-row items-center bg-white px-[1rpx] px-[30rpx] text-28 color-#666">
        共有{{ courses?.length }}数据
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { CourseInfo } from '@/store/modules/course/types';
import { useCourseStore } from '@/store/index';

const courses = ref<CourseInfo[]>();
const courseStore = useCourseStore();

onLoad(() => {
  uni.showLoading({
    title: '加载中',
    mask: true,
  });
  courseStore.getAllcourseList().then((_: any) => {
    uni.hideLoading();
    const storeCourses = courseStore.getAllCourses;
    courses.value = storeCourses;
  });
});

const unsubscribe = courseStore.$subscribe((mutation: any, state: any) => {
  if (mutation.storeId === 'course') {
    courses.value = state.courses;
    console.log(`courses edit changed from ${JSON.stringify(courses.value)}`);
  }
  console.log('State changed:', state);
  console.log('Mutation details:', mutation);
});

// // 组件卸载时取消监听
onUnmounted(() => {
  unsubscribe();
});

const pushCreateCoursePage = () => {
  uni.navigateTo({ url: '/pages/create-course/index' });
};

const goSchedulePage = (courseId: string) => {
  uni.navigateTo({
    url: `/pages/schedule-course/index?course=${encodeURIComponent(JSON.stringify({
      id: courseId, // 必须字段      // 添加其他需要传递的非敏感字段...
    }))}`,
  });
};
</script>

<!-- $u-primary: #21d59d;
$u-primary-dark: #76a3fd;
$u-success: #3ed268; -->
<style lang="scss" scoped>
.add-course-btn {
  @apply h-[60rpx] w-[180rpx] text-[24rpx] text-white flex-shrink-0 flex-row mr-[10rpx] bg-[#21d59d] items-center transition-all duration-300 hover:bg-[#21d59d] hover:shadow-[0_0_20px_##3ed268] hover:scale-110 active:bg-[#3ed268] active:scale-95 active:shadow-none
}
</style>

<!-- <style scoped></style> -->
