<template>
    <div class="wrap">
        <div inert class="loader">
        </div>
    </div>
</template>

<style lang="scss">
.wrap {
    display: grid;
    place-items: center;
    position: fixed;
    width: 100%;
    height: 100dvh;
    left: 0;
    top: 0;
}

.loader {
    width: 48px;
    height: 48px;
    border: 5px solid #555555;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
}

@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>