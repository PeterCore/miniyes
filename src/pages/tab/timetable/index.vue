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
  </view>
</template>

<script setup lang="ts">
const onEditTimetable = () => {
  uni.navigateTo({ url: '/pages/edit-timetable/index' });
};
</script>

<style lang="scss" scoped>
.page-container {
  @apply bg-#f5f5f5
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
