<template>
  <view class="h-full w-full flex flex-col">
    <view class="w-full flex flex-row items-center justify-between border-b border-gray-200 bg-white py-3">
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
  </view>
</template>

<script setup lang="ts">
const pushCreateCoursePage = () => {
  uni.navigateTo({ url: '/pages/create-course/index' });
};
</script>

<style lang="scss" scoped>
.add-course-btn {
  @apply flex-grow flex-shrink-0 flex-row mr-[10rpx] items-center  justify-center h-[60rpx]  rounded-lg text-25rpx bg-green-500 border-none  text-white  hover:bg-green-600;
}
</style>

<!-- <style scoped></style> -->
