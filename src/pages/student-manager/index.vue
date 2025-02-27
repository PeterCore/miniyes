<template>
  <view class="page-container">
    <!-- 搜索框 -->
    <view class="h-[180rpx] flex-grow flex-col items-start bg-white p-20rpx">
      <view class="search-container">
        <u-search v-model="searchQuery" :focus="focus" shape="square" :show-action="false" placeholder="搜索姓名、手机号" @change="onChange" />
        <button class="cancel-button" @click="onCancel">
          取消
        </button>
      </view>

      <view class="header-container">
        <view class="line" />
        <text class="title">
          学员列表
        </text>
        <button class="add-button" @click="onAddstudent">
          + 新增
        </button>
      </view>
    </view>

    <!-- 列表显示 -->
    <view v-if="searchQuery.length === 0">
      <view class="group-container">
        <view v-for="(group, letter) in groupedMembers" :key="letter" class="group">
          <u-cell-group :title="letter" :border="false">
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
    </view>
  </view>
</template>

<script setup lang="ts">
import type { StudentInfo } from '@/store/modules/student/types';
import { useStudentStore } from '@/store/index';
import { pinyin } from 'pinyin-pro';
import { computed, ref } from 'vue';

const useStore = useStudentStore();
const focus = ref(false);
const students = ref<StudentInfo[]>([]);
const searchQuery = ref('');
const searchResult = ref<StudentInfo[]>([]);
onLoad((_: any) => {
  uni.showLoading({
    title: '加载中',
    mask: true,
  });
  useStore.getAllStudentList().then((_: any) => {
    uni.hideLoading();
    const value = useStore.getAllStudents;
    students.value = value;
  });
});

const onCancel = () => {
  focus.value = false;
  searchQuery.value = '';
};

const onAddstudent = () => {
  console.log('add student');
  uni.navigateTo({ url: '/pages/add-student/index' });
};

const onChange = (e: any) => {
  const keyword = e;
  console.log(`keyword is ${keyword}`);
  searchResult.value = students.value.filter((e: StudentInfo) =>
    e.name.includes(keyword) || e.spell_name.includes(keyword));
};

const unsubscribe = useStore.$subscribe((_mutation: any, _state: any) => {
  if (_mutation.storeId === 'student') {
    const value = useStore.getAllStudents;
    students.value = value;
  }
  console.log('State changed:', _state);
  console.log('Mutation details:', _mutation);
});

// 组件卸载时取消监听
onUnmounted(() => {
  unsubscribe();
});

// 搜索查询
// const filteredMembers = computed(() => {
//   return students.value.filter((e: StudentInfo) =>
//     e.name.includes(searchQuery.value) || e.spell_name.includes(searchQuery.value),
//   );
// });

// 按首字母分组排序
const groupedMembers = computed(() => {
  const groups: Record<string, StudentInfo[]> = {};
  // 按字母分组
  students.value.forEach((member: StudentInfo) => {
    const firstLetter = pinyin(member.name.charAt(0), { pattern: 'first', toneType: 'none' }).toUpperCase();
    console.log(`首字母 student ${firstLetter} ---- ${firstLetter}`);
    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(member);
  });

  // 返回按字母顺序排列的分组
  const sortedGroups = Object.keys(groups).sort().reduce((acc, letter) => {
    acc[letter] = groups[letter];
    return acc;
  }, {} as Record<string, StudentInfo[]>);
  console.log('student sortedGroups', JSON.stringify(sortedGroups));
  return sortedGroups;
});

// const onSearch = () => {
//   console.log('Search executed:', searchQuery.value);
// };
</script>

<style scoped>
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
  @apply h-[60rpx] w-[180rpx] text-[24rpx] text-white flex-shrink-0 flex-row mr-[10rpx] bg-[#21d59d] items-center transition-all duration-300 hover:bg-[#21d59d] hover:shadow-[0_0_20px_#3ed268] hover:scale-110 active:bg-[#3ed268] active:scale-95 active:shadow-none
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
