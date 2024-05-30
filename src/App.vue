<script setup>
import Button from 'primevue/button'
import { onMounted, ref, watch } from 'vue'
import Tiptap from '@/components/Tiptap.vue'
import Header from '@/components/Header.vue'
import Dropdown from 'primevue/dropdown'
import ProgramCard from '@/components/ProgramCard.vue'
import Paginator from 'primevue/paginator'
import InputText from 'primevue/inputtext'

const text = ref('')

const programResponse = ref([])
const pageNumber = ref(0)
const selectedSortByTime = ref({
  name: 'Спочатку старі',
  type: 'asc'
})
const typeSort = ref([
  { name: 'Спочатку старі', type: 'asc' },
  { name: 'Спочатку нові', type: 'desc' }
]);
const categoryData = ref([])
const selectedCategory = ref(null)
let searchProgram = ref('')


async function searchProgramByName(){

  if (searchProgram.value != ''){
    const options = {
      method: 'GET'
    };

    programResponse.value = await fetch(`http://localhost:8080/api/v1/program/search/${searchProgram.value}?size=4&page=${pageNumber.value}&sort=addedAt,${selectedSortByTime.value.type}`, options)
      .then(response => response)
      .then(response => response.json())
      .then(data => data)
  }else {
    await getAllProgram()
  }
}

async function getAllProgram(){
  const options = {
    method: 'GET',
  };

  programResponse.value = await fetch(`http://localhost:8080/api/v1/program?size=6&page=${pageNumber.value}&sort=addedAt,${selectedSortByTime.value.type}`, options)
    .then(response => {
      if (response.status === 401){
        localStorage.removeItem('token')
      }else {
        return response
      }
    })
    .then(response => response.json())
    .then(data => data)
}

async function getAllCategory(){
  const options = {
    method: 'GET',
  };

  categoryData.value = await fetch('http://localhost:8080/api/v1/category', options)
    .then(response => response)
    .then(response => response.json())
    .then(data => data)

}

onMounted(() => {
  getAllCategory()
  getAllProgram()
})

watch(pageNumber, () => {
  getAllProgram()
})

watch(selectedSortByTime, () => {
  getAllProgram()
})

watch(searchProgram, () => {
  searchProgramByName()
})

</script>

<template>
  <div class="flex flex-row p-2 justify-between items-center">
    <div class="border-b p-2">
      <span class="relative">
        <i class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600" />
        <InputText v-model:="searchProgram" placeholder="Пошук" class="pl-10" />
      </span>
    </div>
    <div>
      <Button label="Login"/>
    </div>
  </div>

  <div class="w-5/6 m-auto mt-2 program-content border rounded">
    <div class="flex flex-row border-b m-2 p-2 justify-between">
      <div>
        <Button label="Всі додатки"/>
      </div>
      <div class="flex flex-row gap-2">
        <Dropdown v-model="selectedCategory" :options="categoryData.content" optionLabel="categoryName" placeholder="Виберіть категорію" class="w-full md:w-[14rem]" />
        <Dropdown v-model="selectedSortByTime" :options="typeSort" optionLabel="name" placeholder="Тип сортування" class="w-full md:w-[14rem]" />
      </div>
    </div>
    <div class="m-5">
      <div class="grid grid-cols-3 grid-rows-2 mt-5 gap-2">
        <ProgramCard v-for="program in programResponse.content" :key="program.programId" :program-id="program.programId"
                     :program-name="program.programName"
                     :program-icon-url="program.programIconUrl"
                     :added-at="program.addedAt"
                     :program-developer="program.programDeveloper"
                     :program-version="program.programVersion"
                     :program-system-support="program.programSystemSupport"
                     :program-git-hub-url="program.programGitHubUrl"
                     :program-description="program.programDescription"
                     :program-download-url="program.programDownloadUrl"
                     :category="program.category"
                     :is-login="false"
        />
      </div>
      <Paginator class="mt-auto" v-model:first="pageNumber" :rows="1" :totalRecords="programResponse.totalPages" template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" />
    </div>
  </div>

</template>

<style scoped>
</style>
