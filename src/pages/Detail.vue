<template>
    <div class="details">
        <transition name="fade">
            <div :key="detailsData ? detailsData?.title : errorMes">
                <div class="details__error" v-if="errorMes">{{ errorMes }}</div>
                <div class="details__content" v-else>
                    <h4>{{ detailsData?.title }}</h4>
                    <p>{{ detailsData?.description }}</p>
                    <p>{{ detailsData?.description }}</p>
                    <p>{{ detailsData?.description }}</p>
                    <p>{{ detailsData?.description }}</p>
                    <p>{{ detailsData?.description }}</p>
                </div>
            </div>
        </transition>
        <div class="details__bottom">
            <div class="details__bottom__btn" @click="$router.go(-1)"><span>Назад</span></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from "vue-router"
import type { Details } from '@/types/types'

const route = useRoute();
const detailsData = ref<Details>();
const elementId = computed<string>(() => route.params.id.toString());

const errorMes = ref<string>('');

async function getDetailsData() {
    const BASE_URL: string = 'https://api.test-webest.ru/element/?id='
    try {
        const response = await fetch(BASE_URL + elementId.value);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        detailsData.value = await response.json();
    } catch (error) {
        if (error instanceof Error) {
            errorMes.value = error.message;
        }
    }
}
onMounted(() => {
    getDetailsData();
})

</script>

<style scoped lang="scss">
.details {
    position: relative;

    & h4 {
        font-size: 24px;
        font-weight: bold;
        color: #414141;
        line-height: 60px;
    }

    &__error {
        color: #ad1111;
    }

    &__bottom {
        position: fixed;
        height: 60px;
        width: 100%;
        bottom: 0;
        left: 0;
        box-shadow: 0 0 14px #2a2a2a47;
        display: flex;
        justify-content: end;
        padding: 12px 20px;

        &__btn {
            display: grid;
            place-items: center;
            background: #414141;
            height: 40px;
            border-radius: 8px;
            width: 80px;
            color: #fff;
            cursor: pointer;
        }
    }
}
</style>