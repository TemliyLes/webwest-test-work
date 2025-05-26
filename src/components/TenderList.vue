<template>
    <div class="tenderlist" :style="settedWidth">
        <div v-for="tender in tenders" class="tenderlist__elem" @click="$router.push(`/tender/${tender.id}`)">
            <div class="tenderlist__elem__title">{{ tender?.title }}</div>
            <div class="tenderlist__elem__line"></div>
            <div class="tenderlist__elem__description">{{ tender.description ? shortDescription(tender.description)
                :
                '' }}</div>
        </div>
    </div>

</template>

<script setup lang="ts">
import type { Tender } from '@/types/types'
import { computed } from 'vue'
defineProps<{
    tenders: Tender[] | undefined,
}>()

const MAX_SYMBOLS = 300;
const shortDescription = (str: string) => str.length >= MAX_SYMBOLS ? `${str.slice(0, MAX_SYMBOLS)}...` : str

const settedWidth = computed(() => `width:${window.innerWidth - 56}px`) 
</script>

<style scoped lang="scss">
.wrapper {
    position: relative;
}

.tenderlist {
    position: absolute;
    border: solid 1px #ddd;
    padding: 12px;
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
    overflow: hidden;
    left: 0;
    background: #fff;
    z-index: 6;
    padding-right: 8px;

    &__elem {
        background: #ddd;
        flex: 0 0 calc(20% - 5px);
        padding: 12px;
        font-size: 12px;
        word-break: break-word;
        cursor: pointer;
        transition: all 0.4s ease;

        &:hover {
            background: #969696;
        }

        &__title {
            font-weight: bold;
        }

        &__line {
            width: 100%;
            height: 1px;
            background: #878787;
            margin: 10px auto;
        }
    }


}
</style>