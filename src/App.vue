<script setup>
import Button from 'primevue/button'
import { ref } from 'vue'
import Tiptap from '@/components/Tiptap.vue'

const text = ref('')
</script>

<template>
<h1>Hello user!!!!</h1>
  <Button label="Hello"/>
  <Tiptap v-model:="text"/>
  <i class="pi pi-check" style="font-size: 1rem"></i>


  <div class="prose" v-html="text"></div>
</template>

<style scoped>
</style>
