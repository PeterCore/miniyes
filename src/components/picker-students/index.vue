<template>
  <!-- 学生选择弹窗组件 -->
  <u-popup
    :show="show"
    mode="right"
    :round="10"
    :custom-style="{ width: '400rpx', height: '100%' }"
    @close="handleClose"
  >
    <view class="picker-container">
      <!-- 头部 -->
      <view class="header">
        <text class="title">
          选择学生
        </text>
        <u-icon
          name="close"
          size="24"
          class="close-icon"
          @click="handleClose"
        />
      </view>

      <!-- 学生列表 -->
      <scroll-view class="student-list" scroll-y>
        <u-checkbox-group
          v-model="selectedIds"
          placement="column"
          @change="checkboxChange"
        >
          <view class="ml-[20rpx]">
            <u-checkbox
              v-for="(item, index) in students"
              :key="index"
              :custom-style="{ marginBottom: '8px' }"
              :label="item.name"
              :name="item.student_id ?? '0'"
            />
          </view>
        </u-checkbox-group>
        <!-- <view
          v-for="student in students"
          :key="student.student_id ?? '0'"
          class="student-item"
          @click="toggleSelection(student.student_id ?? '0')"
        >
          <text>{{ student.name }}</text>
          <u-checkbox
            :value="selectedIds.includes(student.student_id ?? '0')"
            @change="toggleSelection(student.student_id ?? '0')"
          />
        </view> -->
      </scroll-view>

      <!-- 底部操作 -->
      <view class="footer">
        <u-button
          type="primary"
          :disabled="selectedIds.length === 0"
          @click="handleConfirm"
        >
          确定（{{ selectedIds.length }}）
        </u-button>
      </view>
    </view>
  </u-popup>
</template>

<script setup lang="ts">
import type { StudentInfo } from '@/store/modules/student/types';
import { ref, watch } from 'vue';

// 组件 Props
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  students: {
    type: Array as () => StudentInfo[],
    default: () => [],
  },
  selected: {
    type: Array as () => string[],
    default: () => [],
  },
});

// 组件事件
const emit = defineEmits(['confirm', 'update:show']);

// 选中的学生ID数组
const selectedIds = ref<string[]>([]);

// 监听外部传入的选中值变化
watch(() => props.selected, (newVal: any) => {
  selectedIds.value = [...newVal];
}, { immediate: true });

// 切换选择状态
/**
 * 处理复选框状态变化的回调函数。
 *
 * @param {object} param0 - 回调函数的参数对象。
 * @param {string[]} param0.value - 选中的复选框值的数组。
 *
 * @example
 * // 当复选框状态变化时，调用此函数并传入选中的值。
 * checkboxChange({ value: ['id1', 'id2'] });
 */
const checkboxChange = (value: any) => {
  console.log(`selected id is ${value}`);
  // const index = selectedIds.value.indexOf(value);
  // if (index > -1) {
  //   selectedIds.value.splice(index, 1);
  // }
  // else {
  //   selectedIds.value.push(value);
  // }
};

// 关闭弹窗
const handleClose = () => {
  emit('update:show', false);
};

// 确认选择
const handleConfirm = () => {
  emit('confirm', [...selectedIds.value]);
  handleClose();
};
</script>

<style scoped>
.picker-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1rpx solid #eee;
}

.title {
  font-size: 32rpx;
  font-weight: 500;
}

.close-icon {
  padding: 8rpx;
}

.student-list {
  flex: 1;
  overflow-y: auto;
  padding: 16rpx 0;
}

.student-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.footer {
  padding: 24rpx;
  border-top: 1rpx solid #eee;
}
</style>
