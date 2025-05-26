<template>
  <header>
    <div class="header">
      <p class="header_p">Тестовое задание WebWest</p>
    </div>
  </header>

  <main>
    <div ref="mainRef" class="main">
      <router-view @scrollup="scrollUp" v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <component v-if="size" :size="size" :max="max" :is="Component" :key="route.path.split('/')?.[0]" />
        </transition>
      </router-view>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Data } from './types/types';

const mainRef = ref<HTMLDivElement>();


// В целом, что касается этого разного pageSize, есть только один правильный ответ - тыкать бэкендера, чтобы сделал параметр pageSize, иначе это всё костыли
const size = ref<number>(0);
const max = ref<number>(0);


const ANIMATION_DURATION = 500;

const scrollUp = () => {
  setTimeout(() => {
    const elem = mainRef.value as HTMLElement;
    elem.scrollTop = 0;
  }, ANIMATION_DURATION)

}

async function getData() {
  const BASE_URL: string = 'https://api.test-webest.ru/list/?page=1'
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result: Data = await response.json();
    size.value = result?.page_size;
    max.value = result?.page_count;
    return result?.data
  } catch (error) {
    if (error instanceof Error) {
      console.log('фиаско')
    }
  }
}

onMounted(() => {
  getData();
})
</script>

<style scoped lang="scss">
$header-height: 54px;
$pagination-height: 60px;

.header {
  position: relative;
  z-index: 12;
  background: rgba(9, 9, 9, 0.548);
  box-shadow: 0 0 14px #080807c9;
  height: $header-height;

  &_p {
    padding: 12px 20px;
    font-size: 24px;
    color: #fff;
  }
}

.main {
  padding: 20px;
  height: calc(100dvh - $header-height - $pagination-height);
  overflow: auto;
  scroll-behavior: smooth;
}
</style>
