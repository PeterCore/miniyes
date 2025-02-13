<template>
  <view class="page-wrap">
    <view
      class="w-full flex flex-row items-center justify-start border-b border-gray-200 bg-white py-3"
    >
      <view class="w-30" />
      <view class="w-full flex flex-row items-center justify-start">
        <u-icon name="calendar" color="#f97316" size="24" />
        <view class="text-30">
          课程信息
        </view>
      </view>
      <view class="course-title">
        填写课程相关信息
      </view>
    </view>

    <view
      class="mt-[10rpx] w-full flex flex-row items-center justify-start border-b border-gray-200 bg-white py-3"
    >
      <view class="w-30" />
      <view class="mr-[10rpx] w-[180rpx] items-center text-30 color-#333">
        课程名称
      </view>
      <view class="w-full">
        <input
          v-model="courseName"
          placeholder="请输入课程名称(英语，数学，语文)"
          placeholderStyle="font-size:9 color: #ededed"
          border="surround"
          @change="edit_course"
        >
      </view>
    </view>

    <view
      class="mt-[10rpx] w-full flex flex-row items-center justify-start border-b border-gray-200 bg-white py-3"
    >
      <view class="w-30" />
      <view class="mr-[10rpx] w-[280rpx] items-center text-30 color-#333">
        默认上课时长(分钟)
      </view>
      <view class="flex-grow" />
      <view class="edit-course-time">
        <button class="btn" @click="increased">
          +
        </button>
        <view class="centered-input">
          <input
            v-model="duration"
            type="number"
            border="surround"
            @change="edit_duration"
          >
        </view>
        <button class="btn" @click="decreased">
          -
        </button>
      </view>
      <view class="w-15" />
    </view>

    <view
      class="mt-[10rpx] flex flex-row items-center justify-start border-b border-gray-200 bg-white py-3"
    >
      <view class="w-30" />
      <view class="w-[180rpx] items-center text-30 color-#333">
        课时费用
      </view>
      <view class="w-[80rpx]">
        <input
          v-model="cnyValue"
          placeholder="请输入课时费用"
          placeholderStyle="font-size:9 color: #ededed"
          border="surround"
          type="number"
          @change="edit_cnyValue"
        >
      </view>
      <view class="mr-[10rpx] w-[10rpx] items-center text-30 color-#333">
        元
      </view>
    </view>

    <view class="mt-20rpx bg-white">
      <u-cell-group>
        <u-cell title="课程类型" :value="courseType" is-link @click="pickCourses" />
      </u-cell-group>
    </view>
    <u-picker :show="showPicker" :columns="columns" @confirm="confirm" @cancel="cancel" />
  </view>
  <view class="mx-[30rpx] mt-40rpx">
    <up-button type="primary" :disabled="disabled" text="提交" @click="submit" />
  </view>
</template>

<script setup lang="ts">
import type { CourseInfo } from '@/store/modules/course/types';
import { useCourseStore } from '@/store/modules/course';
import { reactive, ref } from 'vue';

const courseStore = useCourseStore();

const cnyValue = ref(80);
const duration = ref(20);
const courseType = ref('文化');
const courseName = ref('');
const showPicker = ref(false);
const disabled = ref(false);
let courseId: number = 0;
const columns = reactive([['文化', '体育', '音乐']]);
const increased = () => {
  // +
  duration.value++;
};
// const course: CourseInfo = {} as CourseInfo;

onLoad((query: any) => {
  if (query.course !== undefined) {
    const courseParam = decodeURIComponent(query.course);
    const courseInfo = JSON.parse(courseParam) as CourseInfo;
    cnyValue.value = courseInfo.course_cost ?? 20;
    duration.value = courseInfo.course_duration ?? 20;
    courseType.value = courseInfo.course_type ?? '文化';
    courseName.value = courseInfo.course_name ?? '英语';
    courseId = courseInfo.course_id ?? 0;
  }
  else {
    const courseList = courseStore.courses;
    if (courseList !== undefined && courseList.length > 0) {
      courseId = courseList.length;
    }
  }
});

const edit_cnyValue = (e: any) => {
  const inputValue = e.detail.value;
  const _cny = Number.isNaN(Number(inputValue)) ? 0 : Number(inputValue);
  cnyValue.value = _cny;
};

// export interface CourseState {
//   course_id?: number;
//   course_name?: string;
//   course_duration?: number;
//   course_cost?: number;
//   course_type?: string;
// }

const submit = () => {
  if (courseName.value.trim().length < 1) {
    uni.showToast({
      title: '课程名称为空',
      icon: 'error',
    });
    return;
  }
  uni.showLoading({ title: '提交中' });
  disabled.value = true;

  const newCourse = {
    course_id: courseId,
    course_name: courseName.value,
    course_duration: duration.value,
    course_cost: cnyValue.value,
    course_type: courseType.value,
  };
  courseStore.commit(newCourse);
  uni.hideLoading();

  uni.navigateBack({
    delta: 1, // 返回到首页
  }); // const courses = courseStore.getAllCourses;
  // console.log(`----${JSON.stringify(courses)}---`);

  // console.log(`-------${courses?.toString()}`);
};

function goListPages() {
  // const pages = getCurrentPages();
  uni.navigateBack({
    delta: 1, // 返回到首页
  });
  // uni.switchTab({
  //   url: '/pages/tab/list/index',
  // });
}

const pickCourses = () => {
  showPicker.value = true;
};
const confirm = (e: any) => {
  courseType.value = e.value[0];
  showPicker.value = false;
};

const cancel = () => {
  showPicker.value = false;
};

async function decreased() {
  // -
  if (duration.value === 20) {
    uni.$u.toast('时长不能小于20分钟');
    return;
  }
  duration.value--;
}

async function edit_course(e: any) {
  console.log(e);
  courseName.value = e.detail.value;
}

async function edit_duration(e: any) {
  const inputValue = e.detail.value;
  const _duration = Number.isNaN(Number(inputValue)) ? 0 : Number(inputValue);
  // const _duration = Number(e.detail.value);
  console.log('_duration', _duration);
  if (_duration < 20) {
    uni.$u.toast('时长不能小于20分钟');
    duration.value = 20;
    return;
  }
  duration.value = _duration;
}
</script>

<style lang="scss" scoped>
.edit-course-time {
  @apply flex-row flex items-center w-[180rpx] justify-between;
}
.btn {
  @apply h-[50rpx] w-[50rpx] flex items-center justify-center bg-gray-50 text-[30rpx] text-black;
}
.course-title {
  @apply flex flex-grow flex-shrink-0 justify-center items-center color-_wn_969799 mr-[20rpx];
}
.centered-input {
  @apply text-center w-[80rpx] px-[10rpx];
}
</style>
