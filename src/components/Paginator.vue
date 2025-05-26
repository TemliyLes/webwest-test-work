<template>
    <div :inert="blocked" class="paginator" :style="blocked ? 'opacity:0.6' : ''">
        <div class="paginator__btn paginator__element" :class="isFirst ? 'paginator__btn_disabled' : ''"
            @click="step(true)">&lt</div>
        <input :value="current" maxlength="4" type="text" class="paginator__element paginator__input"
            @keydown.enter="onEnter">
        <div class="paginator__element paginator__count"><span>из</span></div>
        <input inert :value="max ? max : ''" maxlength="4" type="text" class="paginator__element paginator__input">
        <div class="paginator__btn paginator__element" :class="isLast ? 'paginator__btn_disabled' : ''"
            @click="step(false)">&gt</div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router';

const props = defineProps<{
    current: number,
    max: number,
    blocked: boolean
}>()

const router = useRouter();
const step = (back: boolean) => {
    const shift = back ? -1 : 1;
    router.push(`/${props.current + shift}`)
}


const onEnter = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const num = parseInt(target.value);
    const boolNum = props.max ? num <= props.max : true
    if (!isNaN(num) && boolNum) {
        router.push(`/${target.value}`)
    } else {
        target.value = props.current.toString()
    }
}
const isFirst = computed<boolean>(() => props.current === 1)
const isLast = computed<boolean>(() => props.current === props.max)

</script>

<style lang="scss">
.paginator {
    display: flex;
    justify-content: end;
    gap: 12px;
    height: 60px;
    background: #ddd;
    padding: 12px;
    position: fixed;
    bottom: 0;
    z-index: 4343;
    width: 100%;
    left: 0;
    height: 60px;
    box-shadow: 0 0 14px #0808075d;

    &__element {
        width: 36px;
        height: 36px;
        border-radius: 10px;
        flex-shrink: 0;
    }

    &__btn {
        display: grid;
        place-items: center;
        background: #414141;
        color: white;
        cursor: pointer;
        transition: opacity 0.4s ease;

        &_disabled {
            pointer-events: none;
            opacity: 0.7;
        }
    }

    &__input {
        width: 56px;
        text-align: center;
        background: #fff;
    }

    &__count {
        text-align: center;
        display: grid;
        place-items: center;
    }
}
</style>