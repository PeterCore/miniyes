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
          v-model="remark"
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
import { pinyin } from 'pinyin-pro';

import { ref } from 'vue';

const studentName = ref('');
const remark = ref('');
const isOpen = ref(false);
const genders = ref(1);
const phone = ref('');
const disabled = ref(false);
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

const submit = async () => {
  disabled.value = true;
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
  uni.showLoading({
    title: '加载中',
    mask: true,
  });
  // name, remark, spell_name, genders, phone
  const isEdit = stdId !== '0';
  const spellName = pinyin(studentName.value, { toneType: 'none' });
  const newStudent = {
    student_id: isEdit ? `${stdId}` : null,
    name: studentName.value,
    remark: remark.value,
    spell_name: spellName,
    genders: genders.value,
    phone: phone.value,
  };
  const res = await useStore.commit(newStudent, isEdit);
  uni.hideLoading();
  uni.$u.toast(res[1]);
  disabled.value = false;
  if (res[0]) {
    uni.navigateBack({
      delta: 1,
    });
  }
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
