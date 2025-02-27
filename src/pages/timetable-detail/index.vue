<template>
  <div class="index">
    index
  </div>
</template>

<script setup lang="ts">
onLoad((query: any) => {
  console.log(`${query.Id}`);
},
);
</script>

<style scoped></style>
