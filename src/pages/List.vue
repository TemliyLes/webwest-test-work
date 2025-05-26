<template>
    <div>
        <div class="topbar">
            <h4 class="topbar__title">Список тендеров ({{ from }}-{{ to }}) {{ searchText ? `,
                содержащих ${searchText}` :
                searchText }}</h4>
            <div class="topbar__search"><input type="text" v-model="searchText"></div>
        </div>
        <div class="container" :style="containerHeightStyle">
            <transition name="fade" @enter="onEnter">
                <TenderList v-if="resultData?.length" :tenders="resultData" />
            </transition>
            <transition name="fade">
                <Loader v-if="!resultData?.length && !errorMes" />
            </transition>
            <transition name="fade">
                <div class="container__error" v-if="errorMes">Ошибка получения данных: {{ errorMes }}</div>
            </transition>
        </div>

        <Paginator :blocked="blockedPaginator" :max="realMax" :current="routeId" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { useRoute } from "vue-router"
import TenderList from '@/components/TenderList.vue'
import Paginator from '@/components/Paginator.vue'
import Loader from '@/components/Loader.vue'

import type { Tender } from '@/types/types'

const props = defineProps<{
    size: number,
    max: number
}>()
const COUNT_PER_PAGE = 30;

const emits = defineEmits(['scrollup']);

const tenderRef = ref<HTMLElement>();

const realMax = computed(() => Math.ceil(props.max * props.size / COUNT_PER_PAGE));

const route = useRoute();
const routeId = computed<number>(() => +route?.params?.page || 1);

const from = computed<number>(() => COUNT_PER_PAGE * +route?.params?.page - COUNT_PER_PAGE);
const to = computed<number>(() => COUNT_PER_PAGE + from.value);

const firstPart = ref<Tender[]>([])
const secondPart = ref<Tender[]>([])

const fullPart = computed(() => firstPart.value && secondPart.value ? [...firstPart.value, ...secondPart.value] : firstPart.value);

const blockedPaginator = ref(false);

const errorMes = ref<string>('');
const searchText = ref<string>('');
const resultData = computed<Tender[] | undefined>(() => searchText.value ? fullPart.value.filter((elem: Tender) => (elem.title?.includes(searchText.value))) : fullPart.value)

const containerHeight = ref<number>();
const containerHeightStyle = computed<string>(() => `height: ${containerHeight.value}px;`)

async function getData(page: number) {
    blockedPaginator.value = true;
    const BASE_URL: string = 'https://api.test-webest.ru/list/?page='
    try {

        const response = await fetch(BASE_URL + page);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();
        blockedPaginator.value = false;
        return result?.data
    } catch (error) {
        if (error instanceof Error) {
            firstPart.value = [];
            secondPart.value = [];
            containerHeight.value = window.innerHeight - 200;
            errorMes.value = error.message;
            blockedPaginator.value = false;
        }
    }

}

const setContainerHeight = (h: number) => {
    containerHeight.value = h;
}

const onEnter = (e: Element) => {
    tenderRef.value = e as HTMLElement;
    const elem = tenderRef.value as HTMLElement;
    requestAnimationFrame(() => {
        setContainerHeight(elem.offsetHeight)
    })
}

watch(() => routeId.value, async (val: number) => {
    errorMes.value = '';
    firstPart.value = [];
    secondPart.value = [];
    const targetFirstPage: number = Math.trunc(from.value / props.size) + 1;
    const targetSecondPage: number = Math.trunc(to.value / props.size) + 1;

    const startIndex: number = from.value % props.size;
    const endIndex: number = to.value % props.size;

    const firstPartData = await getData(targetFirstPage);

    if (startIndex < endIndex) {
        firstPart.value = firstPartData?.slice(startIndex, endIndex)

    }
    else {
        if (!errorMes.value) {
            const secondPartData = await getData(targetSecondPage);
            firstPart.value = firstPartData?.slice(startIndex, firstPartData.length)
            secondPart.value = secondPartData?.slice(0, endIndex)
        }

    }
    emits('scrollup');

}, { immediate: true });

watch(() => resultData.value, () => {
    requestAnimationFrame(() => {
        if (tenderRef?.value?.offsetHeight) {
            setContainerHeight(tenderRef.value.offsetHeight);
        }
    })
}, { deep: true });


</script>

<style lang="scss">
.topbar {
    height: 40px;
    position: relative;
    margin-bottom: 6px;

    &__title {
        padding-top: 6px;
        font-size: 24px;
        font-weight: bold;
        color: #2e2e2e;
    }

    &__search {
        position: absolute;
        left: calc(100vw - 218px);
        top: 0;


        & input {
            border: solid 1px #9f9f9f;
            border-radius: 3px;
            font-size: 12px;
            height: 30px;
            padding: 8px;
        }
    }
}

.container {
    position: relative;
    overflow: hidden;
    transition: all 0.4s ease;

    &__error {
        color: #ad1111;
    }
}
</style>