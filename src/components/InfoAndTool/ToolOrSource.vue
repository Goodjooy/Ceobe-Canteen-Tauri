<template>
  <div class="tool">
    <v-card class="mt-2 position-relative">
      <v-card-text class="d-flex flex-wrap justify-start">
        <v-btn
          v-for="(item, index) in props.list"
          :key="index"
          class="mr-2 mb-2"
          @click.stop="openUrl(item.url)"
        >
          <template #prepend>
            <v-img width="20" class="btn-img" :src="getImage(item.img)"></v-img>
          </template>
          {{ item.name }}
        </v-btn>
      </v-card-text>
      <span class="card-title position-absolute">{{ props.title }}</span>
    </v-card>
  </div>
</template>

<script setup name="tool" lang="ts">
import { getImage } from "../../utils/imageUtil";
import operate from "../../api/operations/operate";

const props = defineProps({
  title: {
    type: String,
    default: () => "",
  },
  list: {
    type: Array,
    default: () => [],
  },
});

function openUrl(url) {
  operate.openUrlInBrowser(url);
}
</script>

<style rel="stylesheet/scss" lang="scss">
.tool {
  .btn-img {
    border-radius: 50%;
  }
  .card-title {
    right: 10px;
    bottom: -20px;
    display: none;
    font-size: 36px;
    color: #000;
    opacity: 0.1;
  }
  .v-card-text {
    padding-bottom: calc(1rem - 8px);
  }
}
</style>
