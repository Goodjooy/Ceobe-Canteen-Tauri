<template>
  <div class="background"></div>
</template>

<script lang="ts" name="index" setup>
import { onBeforeMount, onUnmounted } from "vue";
import { BackgroundRunner } from "../utils/backgroundUtil.ts";

let background: null | BackgroundRunner = null;

onBeforeMount(() => {
  BackgroundRunner.init().then(async (br) => {
    background = br;
    await br.run();
  });
});

onUnmounted(() => {
  if (background) {
    background.release();
  }
});
</script>
