<template>
  <view class="page-container">
    <!-- 搜索框 -->
    <view class="h-[180rpx] flex-grow flex-col items-start bg-white p-20rpx">
      <view class="search-container">
        <u-search v-model="searchQuery" :focus="focus" shape="square" :show-action="false" placeholder="搜索姓名、手机号" @change="onChange" />
        <button class="cancel-button" @tap="onCancel">
          取消
        </button>
      </view>

      <view class="header-container">
        <view class="line" />
        <text class="title">
          教师列表
        </text>
        <button class="add-button" @tap="onAddTeachers">
          + 新增
        </button>
      </view>
    </view>

    <!-- 列表显示 -->
    <!-- <view v-if="searchQuery.length === 0">
      <view class="group-container">
        <view v-for="(group, letter) in groupedMembers" :key="letter" class="group">
          <u-cell-group :title="letter" border="false">
            <view v-for="(item, index) in group" :key="index" class="bg-white">
              <u-cell :title="`${item.name}`" :label="`${item.remark}`">
                <template #icon>
                  <view class="circle-container">
                    <text class="circle-text">
                      {{ item.name.charAt(0) }}
                    </text>
                  </view>
                </template>
              </u-cell>
            </view>
          </u-cell-group>
        </view>
      </view>
    </view>
    <view v-else>
      <view v-for="(item, index) in searchResult" :key="index" class="bg-white">
        <u-cell :title="`${item.name}`" :label="`${item.remark}`">
          <template #icon>
            <view class="circle-container">
              <text class="circle-text">
                {{ item.name.charAt(0) }}
              </text>
            </view>
          </template>
        </u-cell>
      </view>
    </view> -->
  </view>
</template>

<script setup lang="ts">
const searchQuery = ref('');
const focus = ref(false);

const onCancel = () => {
  focus.value = false;
  searchQuery.value = '';
};

const onChange = (e: any) => {
  console.log(`e is ${e}`);
};

const onAddTeachers = () => {

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
  @apply h-[60rpx] w-[180rpx] flex-shrink-0 flex-row mr-[10rpx] items-center text-#3ed268 border-green-300 justify-center rounded-l-6rpx text-25rpx bg-white
}

.cancel-button {
  @apply h-[60rpx] w-[120rpx] flex-shrink-0 flex-row mx-[10rpx] items-center text-#3ed268 border-green-300 justify-center rounded-l-6rpx text-25rpx bg-white
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
</style>
