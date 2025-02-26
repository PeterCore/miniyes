<template>
  <view class="mt-20rpx bg-white">
    <u-cell-group>
      <u-cell title="选择课程" :value="courseType.length > 0 ? courseType : `请选择｜必填`" is-link @click="pickCourses" />
    </u-cell-group>
  </view>
  <view class="mt-20rpx bg-white">
    <u-cell-group>
      <u-cell title="任教老师" :value="teacher.length > 0 ? teacher : `请选择｜必填`" is-link @click="pickTeachers" />
    </u-cell-group>
  </view>
  <view class="mt-20rpx bg-white">
    <u-cell-group>
      <u-cell title="排课学员" :value="studentNames.length > 0 ? studentNames : `请选择｜必填`" is-link @click="pickerStudent" />
    </u-cell-group>
  </view>
  <view class="mt-20rpx bg-white">
    <u-cell title="排课日期" :value="classDate.length > 0 ? classDate : `请选择｜必填`" is-link @click="pickCalendar" />
    <u-cell title="上课时间" :value="classTime.length > 0 ? classTime : `请选择｜必填`" is-link :arrow-direction="arrowDirection" @click="expandTime" />
    <view v-if="isExpandTime === true">
      <view class="time-cell">
        <view class="time-title">
          选择时间
        </view>
        <text class="time-text" @click="onPickerTime('start')">
          {{ startTime.length > 0 ? startTime : '请点击开始时间' }}
        </text>
        <text class="arrow">
          -
        </text>
        <text class="time-text" @click="onPickerTime('end')">
          {{ endTime.length > 0 ? endTime : '请点击结束时间' }}
        </text>
        <button class="button" @click="onConfirm">
          确定
        </button>
      </view>
    </view>
  </view>
  <view
    class="mt-[10rpx] w-full flex flex-row items-center justify-start border-b border-gray-200 bg-white py-3"
  >
    <view class="w-32" />
    <view class="w-[80rpx] items-center text-30 color-#333">
      备注
    </view>
    <view class="w-full">
      <input
        v-model="remark"
        placeholder="选填"
        placeholderStyle="font-size:12 color: #ededed"
        border="surround"
        @change="on_remark"
      >
    </view>
  </view>
  <picker-students
    :show="showPickerStudent"
    :students="studentList"
    @update:show="val => showPickerStudent = val"
    @confirm="handleStudentsConfirm"
  />
  <up-datetime-picker
    :show="showPickerStartTime"
    :format="format"
    mode="time"
    title="选择开始时间"
    :filter="filterHandler"
    @confirm="confirmStartTime"
    @cancel="showPickerStartTime = false"
  />

  <up-datetime-picker
    :show="showPickerEndTime"
    :format="format"
    mode="time"
    title="选择结束时间"
    :min-hour="minEndHour"
    :min-minute="minEndMinute"
    :filter="filterHandler"
    @confirm="confirmEndTime"
    @cancel="showPickerEndTime = false"
  />

  <u-calendar :show="showCalendar" color="#3ed268" month-num="10" mode="single" @confirm="confirm" @close="close" />
  <u-picker :show="showPickerTeacher" key-name="text" :columns="teachers" @confirm="confirm" @cancel="cancel" />
  <u-picker :show="showPickerCourse" key-name="text" :columns="courses" @confirm="confirm" @cancel="cancel" />
  <view class="mx-[30rpx] mt-40rpx">
    <up-button type="primary" :disabled="disabled" text="提交" @click="submit" />
  </view>
</template>

<script setup lang="ts">
import type { CourseInfo } from '@/store/modules/course/types';
import type { StudentInfo } from '@/store/modules/student/types';
import { useCourseStore, useStudentStore, useTeacherStore, useTimetableStore } from '@/store/index';
import { TimetableStatus } from '@/store/modules/classtimetable/types';

const format = 'HH:mm';

const disabled = ref(false);
const minEndHour = ref(0);
const minEndMinute = ref(0);
const isExpandTime = ref(false);
const arrowDirection = ref('down');
const courseType = ref('');
const teacher = ref('');
const classDate = ref('');
const classTime = ref('');
const studentNames = ref('');
const remark = ref('');
const showCalendar = ref(false);
const showPickerCourse = ref(false);
const showPickerTeacher = ref(false);
const showPickerStartTime = ref(false);
const showPickerEndTime = ref(false);
const useTStore = useTeacherStore();
const useCStore = useCourseStore();
const useSStore = useStudentStore();
const useTTStore = useTimetableStore();
const showPickerStudent = ref(false);
const studentList = ref<StudentInfo[]>([]);
const selectedStudentIds = ref([]);
const startTime = ref('');
const endTime = ref('');
const teachers = ref([[
  { text: '校长', value: '0' },

]]);
// const columns = reactive([['校长', '老师', '教务']]);
const courses = ref([[
  { text: '数学', value: '0' },

]]);
let cList: CourseInfo[] = [];
let selectedCourseId = '';
let selectedTeacherId = '';
let duration = 0;
const expandTime = () => {
  if (selectedCourseId.length === 0) {
    uni.$u.toast('请选择课程');
    return;
  }
  isExpandTime.value = !isExpandTime.value;
  arrowDirection.value = isExpandTime.value ? 'up' : 'down';
};
// timetable_id?: string;
//   course_id: string;
//   course_name: string;
//   status: TimetableStatus;
//   teacher: {
//     teacher_id: string;
//     teacher_name: string;
//   };
//   students: Array<{
//     student_id: string;
//     student_name: string;
//   }>;
//   schedule_time: string;
//   remark?: string;
//   create_time: number;
//   update_time: number;
const submit = async () => {
  if (courseType.value.length === 0) {
    uni.$u.toast('请选择课程');
    return;
  }
  else if (teacher.value.length === 0) {
    uni.$u.toast('请选择老师');
    return;
  }
  else if (classDate.value.length === 0) {
    uni.$u.toast('请选择日期');
    return;
  }
  else if (classTime.value.length === 0) {
    uni.$u.toast('请确定时间');
    return;
  }
  else if (selectedStudentIds.value.length === 0) {
    uni.$u.toast('请选择学员');
    return;
  }
  disabled.value = true;

  const info = {
    course_name: courseType.value,
    course_id: selectedCourseId,
    status: TimetableStatus.not_started,
    teacher: {
      teacher_id: selectedTeacherId,
      teacher_name: teacher.value,
    },
    students: selectedStudentIds.value.map((id: string) => ({
      student_id: id,
      student_name: studentList.value.find((item: any) => item.student_id === id)?.name ?? '',
    })),
    schedule_time: `${classDate.value} ${classTime.value}`,
    remark: remark.value,

  };
  const res = await useTTStore.commit(info, false);
  disabled.value = false;
  if (res[0] === true) {
    uni.$u.toast(res[1]);
    uni.navigateBack();
  }
  else {
    uni.$u.toast(res[1]);
  }
};

type DateTimeColumnType = 'year' | 'month' | 'day' | 'hour' | 'minute';

/**
 * 计算最小结束时间
 *
 * @param {string} start - 开始时间，格式为 "HH:MM"
 *
 * 该函数根据给定的开始时间和持续时间计算最小结束时间。
 * 处理了跨天的情况，确保返回的结束时间在 24 小时制内。
 */
const calculateMinEndTime = (start: string) => {
  const [startHour, startMinute] = start.split(':').map(Number);
  const totalMinutes = startHour * 60 + startMinute + (duration ?? 0);

  // 处理跨天情况
  const maxDayMinutes = 24 * 60;
  const clampedMinutes = totalMinutes % maxDayMinutes;

  minEndHour.value = Math.floor(clampedMinutes / 60);
  minEndMinute.value = clampedMinutes % 60;
  endTime.value = `${minEndHour.value.toString().padStart(2, '0')}:${minEndMinute.value.toString().padStart(2, '0')}`;
};

const filterHandler = (type: DateTimeColumnType, values: number[]): number[] => {
  return values; // 必须返回原始值或其他处理后的数组
};
const onPickerTime = (type: string) => {
  if (type === 'start') {
    showPickerStartTime.value = true;
  }
  else {
    const isStart = startTime.value.length !== 0;
    if (isStart) {
      showPickerEndTime.value = true;
    }
    else {
      uni.$u.toast('请选择开始时间');
    }
  }
};

watch(startTime, (newStart: string) => {
  console.log('new start: ', newStart);
  if (newStart) {
    calculateMinEndTime(newStart);
  }
  else {
    endTime.value = '';
  }
});

onLoad((_: any) => {
  const tList = useTStore.getAllTeachers;
  console.log(JSON.stringify(tList));
  const teacherList = tList.map((item: any) => ({ text: item.name, value: item.teacher_id }));
  teachers.value = [teacherList];
  cList = useCStore.getAllCourses ?? [];
  const courseList = cList.map((item: any) => ({ text: item.course_name, value: item.course_id }));
  courses.value = [courseList];

  studentList.value = useSStore.getAllStudents;
});

/**
 * 处理学生确认事件
 *
 * @param {any} e - 选中的学生 ID 数组
 *
 * 当用户确认选择的学生时，此函数会更新学生名称和选中的学生 ID。
 * 如果选中的学生 ID 数组不为空，将根据 ID 查找学生信息并拼接学生姓名。
 */
const handleStudentsConfirm = (e: any) => {
  console.log(e);
  if (e.length > 0) {
    studentNames.value = '';
    for (let index = 0; index < e.length; index++) {
      const res = studentList.value.find((el: any) => el.student_id === e[index]);
      if (res !== undefined) {
        if (index === 0) {
          studentNames.value = res.name ?? '';
        }
        else {
          studentNames.value += `、${res.name ?? ''}`;
        }
      }
    }
    selectedStudentIds.value = e;
  }
};

/**
 * 显示学生选择器的函数。
 * 当调用此函数时，将 `showPickerStudent` 的值设置为 `true`，
 * 以便在界面上显示学生选择器。
 */
const pickerStudent = () => {
  showPickerStudent.value = true;
};

const confirmStartTime = (e: any) => {
  startTime.value = e.value;
  showPickerStartTime.value = false;
};

const confirmEndTime = (e: any) => {
  endTime.value = e.value;
  showPickerEndTime.value = false;
};

const onConfirm = () => {
  if (startTime.value === '') {
    uni.$u.toast('请选择开始时间');
    return;
  }
  else if (endTime.value === '') {
    uni.$u.toast('请选择结束时间');
    return;
  }
  else if (startTime.value > endTime.value) {
    uni.$u.toast('开始时间不能大于结束时间');
    return;
  }
  classTime.value = `${startTime.value}-${endTime.value}`;
  showPickerStudent.value = false;
};

const pickCalendar = () => {
  showCalendar.value = true;
};

const close = () => {
  showCalendar.value = false;
};

/**
 * 显示课程选择器的函数。
 * 当调用此函数时，将 `showPickerCourse` 的值设置为 `true`，
 * 以便显示课程选择界面。
 */
const pickCourses = () => {
  console.log('pickCourses', courses.value);
  if (courses.value[0].length === 0) {
    // 课程为空
    uni.$u.toast('请先添加课程');
    setTimeout(() => {
      uni.navigateTo({ url: '/pages/course-manager/index' });
    }, 300);
    return;
  }
  showPickerCourse.value = true;
};

const unsubCourseScribe = useCStore.$subscribe((_mutation: any, _state: any) => {
  if (_mutation.storeId === 'course') {
    const cList = useCStore.getAllCourses ?? [];
    const courseList = cList.map((item: any) => ({ text: item.course_name, value: item.course_id }));
    courses.value = [courseList];
  }
});

const unsubTeacherScribe = useTStore.$subscribe((_mutation: any, _state: any) => {
  if (_mutation.storeId === 'teacher') {
    const tList = useTStore.getAllTeachers;
    const teacherList = tList.map((item: any) => ({ text: item.name, value: item.teacher_id }));
    teachers.value = [teacherList];
  }
});

// 组件卸载时取消监听
onUnmounted(() => {
  unsubCourseScribe();
  unsubTeacherScribe();
});

const pickTeachers = () => {
  console.log('pickTeachers', teachers.value);
  if (teachers.value[0].length === 0) {
    uni.$u.toast('请先添加教师');
    setTimeout(() => {
      uni.navigateTo({ url: '/pages/edit-teacher/index' });
    }, 300);
    return;
  }
  showPickerTeacher.value = true;
};
const on_remark = (e: any) => {
  remark.value = e.detail.value;
};
const confirm = (e: any) => {
  if (showPickerCourse.value) {
    courseType.value = e.value[0].text;
    selectedCourseId = e.value[0].value;
    cList.forEach((item: CourseInfo) => {
      if (item.course_id === selectedCourseId) {
        duration = item.course_duration ?? 0;
      }
    });
  }
  else if (showPickerTeacher.value) {
    console.log('----teacher', e.value[0]);
    teacher.value = e.value[0].text;
    selectedTeacherId = e.value[0].value; //
  }
  else if (showCalendar.value) {
    classDate.value = e[0];
    showCalendar.value = false;
  }
  showPickerTeacher.value = showPickerCourse.value = false;
};

const cancel = () => {
  showPickerTeacher.value = showPickerCourse.value = false;
};
</script>

<style lang="scss" scoped>
.time-cell {
  @apply flex flex-row items-center justify-start h-70rpx px-10rpx
}

.time-title {
  @apply  justify-center items-center font-size-30rpx color-_wn_969799 mx-[20rpx];
}
.button {
  @apply h-[50rpx] w-[100rpx] text-[22rpx] text-white flex-shrink-0 flex-row mr-[10rpx] bg-[#21d59d] items-center transition-all duration-300 hover:bg-[#21d59d] hover:shadow-[0_0_20px_##3ed268] hover:scale-110 active:bg-[#3ed268] active:scale-95 active:shadow-none
}
.time-text {
  font-size: 26rpx;
  color: #333;
  cursor: pointer;
  user-select: none; /* 禁止文本被选中 */
}

.arrow {
  padding: 0 10px 0 10px;
  font-size: 16px;
  color: #aaa;
  user-select: none;
}
.page-container {
  @apply bg-#f5f5f5
}
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
