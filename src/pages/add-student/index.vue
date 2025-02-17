<template>
  <view class="page-wrap">
    <view
      class="mt-[10rpx] w-full flex flex-row items-center justify-start border-b border-gray-200 bg-white py-3"
    >
      <view class="w-30" />
      <view class="mr-[10rpx] w-[100rpx] items-center text-30 color-#333">
        名字
      </view>
      <view class="w-full">
        <input
          v-model="studentName"
          placeholder="名字或昵称(必填)"
          placeholderStyle="font-size:9 color: #ededed"
          border="surround"
          @change="on_change_name"
        >
      </view>
    </view>
    <view
      class="mt-[10rpx] w-full flex flex-row items-center justify-start border-b border-gray-200 bg-white py-3"
    >
      <view class="w-30" />
      <view class="mr-[10rpx] w-[160rpx] items-center text-30 color-#333">
        名字备注
      </view>
      <view class="w-full">
        <input
          v-model="studentName"
          placeholder="备注真名或其他备注(为了识别)"
          placeholderStyle="font-size:9 color: #ededed"
          border="surround"
          @change="on_remark"
        >
      </view>
    </view>
    <view
      class="mt-[10rpx] w-full flex flex-row items-center justify-start border-b border-gray-200 bg-white py-3"
    >
      <view class="mx-[20rpx] w-[100rpx] items-center text-30 color-#333">
        性别
      </view>
      <view class="w-full" />
      <view class="flex flex-grow">
        <view class="mr-[40rpx] w-[10rpx] items-center text-30 color-#333">
          男
        </view>
        <u-switch v-model="isOpen" @change="genders_change" />
        <view class="ml-[20rpx] mr-[40rpx] w-[10rpx] items-center text-30 color-#333">
          女
        </view>
      </view>
    </view>
    <view
      class="mt-[10rpx] w-full flex flex-row items-center justify-start border-b border-gray-200 bg-white py-3"
    >
      <view class="w-30" />
      <view class="mr-[10rpx] w-[160rpx] items-center text-30 color-#333">
        联系电话
      </view>
      <view class="w-full">
        <input
          v-model="phone"
          placeholder="联系电话(必填)"
          placeholderStyle="font-size:9 color: #ededed"
          border="surround"
          @change="on_phone"
        >
      </view>
    </view>
    <view class="mx-[30rpx] mt-40rpx">
      <up-button type="primary" :disabled="disabled" text="提交" @click="submit" />
    </view>
  </view>
</template>

<script setup lang="ts">
import type { StudentInfo } from '@/store/modules/student/types';
import { useStudentStore } from '@/store/index';
import { ref } from 'vue';

const studentName = ref('');
const remark = ref('');
const isOpen = ref(false);
const genders = ref(1);
const phone = ref('');
const disabled = ref(true);
let stdId = '0';
const useStore = useStudentStore();

onLoad((query: any) => {
  if (query.course !== undefined) {
    const stdParam = decodeURIComponent(query.std);
    const stdInfo = JSON.parse(stdParam) as StudentInfo;
    studentName.value = stdInfo.name;
    genders.value = stdInfo.genders;
    remark.value = stdInfo.remark;
    phone.value = stdInfo.phone ?? '';
    stdId = stdInfo.student_id ?? '0';
  }
});

const on_change_name = (e: any) => {
  studentName.value = e.detail.value;
};

const submit = () => {
  disabled.value = false;
  if (studentName.value.trim().length < 1) {
    uni.showToast({
      title: '名字为空',
      icon: 'error',
    });
    return;
  }
  else if (remark.value.trim().length < 1) {
    uni.showToast({
      title: '备注为空',
      icon: 'error',
    });
    return;
  }
  // student_id?: string;
  // name: string;
  // remark: string;
  // spell_name: string;
  // genders: number;
  // phone?: string;

  // const newStudent = {
  //     student_id: `${response.course_id}`,
  //     name: courseName.value,
  //     remark: duration.value,
  //     spell_name: cnyValue.value,
  //     phone: courseType.value,
  //     genders:
  //   };
  disabled.value = true;
};

const genders_change = (e: any) => {
  console.log('change', e);
  genders.value = e === true ? 0 : 1;
};
const on_remark = (e: any) => {
  remark.value = e.detail.value;
};

const on_phone = (e: any) => {
  phone.value = e.detail.value;
};
</script>

<style scoped></style>
