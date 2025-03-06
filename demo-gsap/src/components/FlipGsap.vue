<!--<template>-->
<!--  <div>-->
<!--    <div ref="containerEl" class="container" :class="currentLayout">-->
<!--      <div v-for="(char, index) in chars"-->
<!--           :key="index"-->
<!--           class="letter"-->
<!--           :class="[char.class, { [char.letter]: true }]">-->
<!--        {{ char.letter }}-->
<!--      </div>-->
<!--      <div class="for">for</div>-->
<!--      <div class="gsap">GSAP</div>-->
<!--    </div>-->

<!--    <a href="https://gsap.com/">-->
<!--      <img src="https://assets.codepen.io/16327/gsap-logo-light.svg" class="logo"/>-->
<!--    </a>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import {ref, onMounted, onBeforeUnmount} from 'vue'-->
<!--import {gsap} from 'gsap'-->
<!--import {Flip} from 'gsap/Flip'-->

<!--gsap.registerPlugin(Flip)-->

<!--const layouts = ['final', 'plain', 'columns', 'grid'] as const-->
<!--type Layout = typeof layouts[number]-->
<!--const currentLayout = ref<Layout>('final')-->
<!--const containerEl = ref<HTMLElement | null>(null)-->
<!--let animationTimeline: gsap.core.Timeline | null = null-->

<!--const chars = ref([-->
<!--  {letter: 'F', class: 'F'},-->
<!--  {letter: 'L', class: 'l'},-->
<!--  {letter: 'I', class: 'i'},-->
<!--  {letter: 'P', class: 'p'}-->
<!--])-->

<!--const nextState = () => {-->
<!--  if (!containerEl.value) return-->

<!--  const elements = [-->
<!--    ...containerEl.value.querySelectorAll<HTMLElement>('.letter, .for, .gsap')-->
<!--  ]-->
<!--  const state = Flip.getState(elements, {-->
<!--    props: 'color,backgroundColor',-->
<!--    simple: true-->
<!--  })-->

<!--  const current = layouts.findIndex(l => l === currentLayout.value)-->
<!--  const nextIndex = (current + 1) % layouts.length-->
<!--  currentLayout.value = layouts[nextIndex]-->

<!--  Flip.from(state, {-->
<!--    absolute: true,-->
<!--    stagger: 0.07,-->
<!--    duration: 0.7,-->
<!--    ease: 'power2.inOut',-->
<!--    spin: currentLayout.value === 'final',-->
<!--    simple: true,-->
<!--    onEnter: (elements, animation) => {-->
<!--      gsap.fromTo(elements,-->
<!--          {opacity: 0},-->
<!--          {opacity: 1, delay: animation.duration() - 0.1}-->
<!--      )-->
<!--    },-->
<!--    onLeave: elements => {-->
<!--      gsap.to(elements, {opacity: 0})-->
<!--    }-->
<!--  })-->

<!--  const delay = currentLayout.value === 'final' ? 3500 : 1500-->
<!--  animationTimeline = gsap.delayedCall(delay / 1000, nextState)-->
<!--}-->

<!--onMounted(() => {-->
<!--  gsap.delayedCall(1, nextState)-->
<!--})-->

<!--onBeforeUnmount(() => {-->
<!--  if (animationTimeline) {-->
<!--    animationTimeline.kill()-->
<!--  }-->
<!--})-->
<!--</script>-->

<!--<style scoped>-->
<!--/* 保持原有的 CSS 样式不变 */-->
<!--* {-->
<!--  box-sizing: border-box;-->
<!--}-->

<!--body {-->
<!--  padding: 0;-->
<!--  margin: 0;-->
<!--  font-family: "Mori",sans-serif;-->
<!--  font-weight: 300;-->
<!--  height: 100vh;-->
<!--  overflow: hidden;-->
<!--}-->

<!--.container {-->
<!--  display: flex;-->
<!--  height: 100vh;-->
<!--  width: 100%;-->
<!--  justify-content: center;-->
<!--  align-items: center;-->
<!--  overflow: hidden;-->
<!--}-->

<!--.container.grid,-->
<!--.container.columns {-->
<!--  align-content: stretch;-->
<!--  align-items: stretch;-->
<!--  flex-wrap: wrap;-->
<!--}-->

<!--.letter {-->
<!--  text-align: center;-->
<!--  color: black;-->
<!--  font-size: 10vmax;-->
<!--  font-weight: 400;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--  padding: 2px 6px;-->
<!--}-->

<!--.container.grid .letter {-->
<!--  flex-basis: 50%;-->
<!--}-->

<!--.container.columns .letter {-->
<!--  flex-basis: 25%;-->
<!--}-->

<!--.for,-->
<!--.gsap {-->
<!--  font-size: 5vmax;-->
<!--  color: #18D6FF;-->
<!--}-->

<!--.for {-->
<!--  padding: 2px 1.6vmax;-->
<!--  font-weight: 300;-->
<!--  display: none;-->
<!--}-->

<!--.gsap {-->
<!--  padding: 2px 0;-->
<!--  font-weight: 600;-->
<!--  display: none;-->
<!--}-->

<!--.container.final .for,-->
<!--.container.final .gsap {-->
<!--  display: block;-->
<!--}-->

<!--.F {-->
<!--  background: bisque;-->
<!--}-->

<!--.l {-->
<!--  background: pink;-->
<!--}-->

<!--.i {-->
<!--  background: #D7D7D7;-->
<!--}-->

<!--.p {-->
<!--  background: #9B51E0;-->
<!--}-->

<!--.container.plain .letter {-->
<!--  background: transparent;-->
<!--  color: #18D6FF;-->
<!--  padding: 0;-->
<!--}-->

<!--.logo {-->
<!--  position: fixed;-->
<!--  width: 100px;-->
<!--  bottom: 20px;-->
<!--  right: 30px;-->
<!--}-->
<!--</style>-->