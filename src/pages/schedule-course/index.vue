<template>
  <view class="h-full w-full flex flex-col">
    <view class="flex-grow flex-col bg-white">
      <view class="w-full flex-row items-center bg-white">
        <view class="flex px-30rpx py-40rpx font-size-36rpx font-bold">
          课程:<view class="w-[20rpx]" />{{ courseDetail.course_name }}
        </view>
        <view class="flex px-30rpx pb-20rpx pt-15rpx font-size-28rpx color-#666 font-normal">
          建议课时:  {{ courseDetail.course_duration }}分钟
        </view>
        <view class="flex flex-row justify-start px-30rpx pb-20rpx pt-15rpx">
          <button class="add-course-btn" @click="scheduleCourse">
            + 课程安排
          </button>
          <view class="flex-grow" />
          <button class="custom-button" @click="editCourse">
            <view class="button-content">
              <u-icon name="file-text" color="white" />
              <text class="button-text">
                编辑
              </text>
            </view>
          </button>
          <view class="w-10rpx" />
          <button class="custom-button-deleted" @click="deleteCurrentCourse">
            <view class="button-content">
              <u-icon name="close-circle" color="#fe9831" />
              <text class="button-text-deleted">
                删除
              </text>
            </view>
          </button>
        </view>
      </view>
    </view>
  </view>
  <view>
    <up-modal :show="show" :title="title" :content="content" content-text-align="center" show-cancel-button="true" confirm-color="#fe9831" @confirm="confirm" @cancel="cancel" />
  </view>
</template>

<script setup lang="ts">
import type { CourseInfo } from '@/store/modules/course/types';
import { useCourseStore } from '@/store/index';
import { ref } from 'vue';

const show = ref(false);
const title = ref('提示');
const content = ref('确定删除吗?');
const courseStore = useCourseStore();

const courseDetail = ref<CourseInfo>({ course_cost: 80, course_id: '0', course_name: '', course_duration: 20, course_type: '文化' });
// const course: CourseInfo = {} as CourseInfo;

// onLoad 获取传递的参数
onLoad((query: any) => {
  if(query != undefined) {
    const courseId = query.Id;
  if (courseId) {
    const course = courseStore.getCourseById(courseId);
    if (course) {
      courseDetail.value = course;
    }
  }
}
});

const unsubscribe = courseStore.$subscribe((_mutation: any, _state: any) => {
  if (_mutation.storeId === 'course') {
    const courses = _state.courses;
    const info = courseDetail.value;
    const courseIndex = courses.findIndex((el: { course_id: string }) => el.course_id === info.course_id);
    if (courseIndex !== undefined && courseIndex >= 0) {
      courseDetail.value = courses[courseIndex];
    }
    console.log(`courses edit changed from ${JSON.stringify(info)}`);
  }
  console.log('State changed:', _state);
  console.log('Mutation details:', _mutation);
});

// 组件卸载时取消监听
onUnmounted(() => {
  unsubscribe();
});

const editCourse = () => {
  uni.navigateTo({
    url: `/pages/create-course/index?course=${encodeURIComponent(JSON.stringify(courseDetail.value))}`,
  });
};

const confirm = async () => {
  show.value = false;
  const courseId = courseDetail.value.course_id ?? '0';
  uni.showLoading({ title: '删除中' });
  const res = await courseStore.removeCourse(courseId);
  uni.hideLoading();
  uni.$u.toast(res[0]);
  if (res[1]) {
    uni.navigateBack({
      delta: 1,
    });
  }
};

const cancel = () => {
  show.value = false;
};
const scheduleCourse = () => {

};

const deleteCurrentCourse = () => {
  show.value = true;
};
</script>

<style lang="scss" scoped>
.add-course-btn {
  @apply h-[60rpx] w-[180rpx] flex-shrink-0 flex-row mr-[10rpx] items-center text-#3ed268 border-green-300 justify-center rounded-l-6rpx text-25rpx bg-white
}
.btn {
  @apply h-[40rpx] w-[120rpx] flex-shrink-0 flex-row mr-[10rpx] items-center text-#3ed268 border-green-300 justify-center rounded-l-6rpx text-24rpx bg-white
}
.edit-course-btn {
  @apply flex-grow flex-shrink-0 flex-row mr-[10rpx] items-center  justify-center h-[60rpx]  rounded-lg text-25rpx bg-green-500 border-none  text-white  hover:bg-green-600;
}
.custom-button {
  background-color: #3ed268;
  border: none;
  border-radius: 4rpx;
  padding: 5rpx 2rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 110rpx;
}

.custom-button-deleted {
 @apply  p-5rpx flex items-center border-2 rounded-4rpx justify-center w-110rpx;
}
.button-text-deleted {
  color: #fe9831;
  font-size: 23rpx;
}
.button-content {
  display: flex;
  align-items: center;
  gap: 6;
}

.button-text {
  color: #ffffff;
  font-size: 23rpx;
}
</style>
