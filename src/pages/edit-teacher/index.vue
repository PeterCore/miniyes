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
          v-model="teacherName"
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
      <view class="mx-[30rpx] w-[110rpx] items-center text-30 color-#333">
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
    <view class="mt-20rpx bg-white">
      <u-cell-group>
        <u-cell title="角色" :value="role" is-link @click="pickRoles" />
      </u-cell-group>
    </view>
    <u-picker :show="showPicker" :columns="columns" @confirm="confirm" @cancel="cancel" />
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
          placeholder="联系电话(手机号码必填)"
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
import { useTeacherStore } from '@/store/index';
import { pinyin } from 'pinyin-pro';
import { reactive, ref } from 'vue';

const teacherName = ref('');
const remark = ref('');
const isOpen = ref(false);
const genders = ref(1);
const phone = ref('');
const disabled = ref(false);
const isValidPhone = ref<boolean | null>(null);
const phoneRegEx = /^1[3-9]\d{9}$/;
const columns = reactive([['校长', '老师', '教务']]);
const role = ref('');
const showPicker = ref(false);
const useStore = useTeacherStore();
let isEdit = false;
let teacher_id = '0';
let class_timetable: string[] = [];
onLoad((query: any) => {
  console.log(`teacher query is ${query.info}`);
  if (query.info !== undefined) {
    const infoParam = decodeURIComponent(query.info);
    const jsonData = JSON.parse(infoParam); //
    const teacherId = jsonData.id;
    if (teacherId) {
      teacher_id = teacherId;
      isEdit = true;
      const teacherInfo = useStore.getTeacherById(teacherId);
      if (teacherInfo) {
        teacherName.value = teacherInfo.name;
        remark.value = teacherInfo.remark;
        genders.value = teacherInfo.genders;
        phone.value = teacherInfo.phone ?? '';
        role.value = teacherInfo.role;
        class_timetable = teacherInfo.class_timetable;
      }
    }
    // const stdInfo = JSON.parse(stdParam) as StudentInfo;
    // teacherName.value = stdInfo.name;
    // genders.value = stdInfo.genders;
    // remark.value = stdInfo.remark;
    // phone.value = stdInfo.phone ?? '';
    // stdId = stdInfo.student_id ?? '0';
    // class_timetable = stdInfo.class_timetable;
  }
  if (role.value.length < 1) {
    role.value = '请选择角色(必填)';
  }
});

const on_change_name = (e: any) => {
  teacherName.value = e.detail.value;
};

const pickRoles = () => {
  showPicker.value = true;
};
const confirm = (e: any) => {
  role.value = e.value[0];
  showPicker.value = false;
};

const cancel = () => {
  showPicker.value = false;
};

const submit = async () => {
  disabled.value = true;
  if (teacherName.value.trim().length < 1) {
    uni.showToast({
      title: '名字为空',
      icon: 'error',
    });
    disabled.value = false;
    return;
  }
  else if (remark.value.trim().length < 1) {
    uni.showToast({
      title: '备注为空',
      icon: 'error',
    });
    disabled.value = false;
    return;
  }
  isValidPhone.value = phoneRegEx.test(phone.value);
  if (isValidPhone.value !== true) {
    uni.showToast({
      title: '联系电话错误',
      icon: 'error',
    });
    disabled.value = false;
    return;
  }
  uni.showLoading({
    title: '加载中',
    mask: true,
  });
  const spellName = pinyin(teacherName.value, { toneType: 'none' });

  const teacherInfo = {
    teacher_id: `${teacher_id}`,
    name: teacherName.value,
    remark: remark.value,
    spell_name: spellName,
    genders: genders.value,
    phone: phone.value,
    role: role.value,
    class_timetable,
  };
  const res = await useStore.commit(teacherInfo, isEdit);
  if (res[0] === true) {
    uni.navigateBack({
      delta: 1,
    });
  }
  uni.$u.toast(res[1]);
  uni.hideLoading();
  disabled.value = false;
};

const genders_change = (e: any) => {
  console.log('change', e);
  genders.value = e === true ? 0 : 1;
};
const on_remark = (e: any) => {
  remark.value = e.detail.value;
};

const on_phone = (e: any) => {
  if (e.detail.value.length > 11) {
    phone.value = e.detail.value.substring(0, 11);
  }
  console.log(`phone is ${phone.value}`);
};
</script>

<style lang="scss" scoped></style>
