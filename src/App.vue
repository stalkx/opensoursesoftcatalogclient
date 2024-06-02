<script setup>
import Button from 'primevue/button'
import { onMounted, reactive, ref, watch } from 'vue'
import Tiptap from '@/components/Tiptap.vue'
import Header from '@/components/Header.vue'
import Dropdown from 'primevue/dropdown'
import ProgramCard from '@/components/ProgramCard.vue'
import Paginator from 'primevue/paginator'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import Password from 'primevue/password'
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';


const toast = useToast();

const showMassage = (text, severity) => {
  toast.add({ severity: severity, summary: 'Повідомлення', detail: text, life: 3000 });
};

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
const authIsVisible = ref(false)
const currentUser = ref({})

const isLogin = ref(false)


const loginData = reactive({
  login: '',
  password: ''
})

const showEditUser = ref(false)
const showEditUserPassword = ref(false)


const editUserDataLogin = ref({})
const editUserDataPassword = ref({})



watch(currentUser, () => {
  editUserDataLogin.value = currentUser.value;
  editUserDataPassword.value = currentUser.value
  editUserDataPassword.value.password = ''
})


async function getUserInfo(){

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
  myHeaders.append('Content-Type', 'application/json');

  const options = {
    method: 'GET',
    headers: myHeaders
  };

  currentUser.value = await fetch('https://opensourcesoftcatalog-production.up.railway.app/api/v1/user/user-info', options)
    .then(response => response)
    .then(response => response.json())
    .then(data => data)

}

async function editUser(){
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
  myHeaders.append('Content-Type', 'application/json');

  const options = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(editUserDataLogin.value),
  };

  await fetch('https://opensourcesoftcatalog-production.up.railway.app/api/v1/user/update', options)
    .then(response => {
      if(response.status === 401){
        localStorage.removeItem('token')
      }else {
        logout()
        showEditUser.value = false
        return response.json()
      }
    })
    .then(data => console.log(data))
    .catch(error => console.error(error));

  console.log(editUserDataLogin.value)
}

async function editUserPassword(){
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
  myHeaders.append('Content-Type', 'application/json');

  const options = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(editUserDataPassword.value),
  };

  await fetch('https://opensourcesoftcatalog-production.up.railway.app/api/v1/user/update-password', options)
    .then(response => {
      if(response.status === 401){
        localStorage.removeItem('token')
      }else {
        logout()
        showEditUserPassword.value = false
        return response.json()
      }
    })
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function openAboutUserData(){
  showEditUser.value = true
  checkToken()
}

function checkToken() {
  const token = localStorage.getItem('token')
  if (token) {
    console.log(token)
    isLogin.value = true
    getUserInfo()
  } else {
    console.log(token)
    isLogin.value = false
  }
}


function login(){
  const jsonData = JSON.stringify(loginData)

  fetch('https://opensourcesoftcatalog-production.up.railway.app/api/v1/auth/authenticate', {
    method: 'POST',
    body: jsonData,
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      if( data.status === 401){
        showMassage('Некоректні дані', 'error')
      }else {
        console.log('Success:', data);
        localStorage.setItem("token", data.token)
        localStorage.setItem("role", data.rolesList)
        checkToken()
        authIsVisible.value = false
      }
    })
    .catch(error => {
      showMassage('Некоректні дані', 'info')
      console.error('Error:', error);
    });
}


async function searchProgramByName(){

  if (searchProgram.value != ''){
    const options = {
      method: 'GET'
    };

    programResponse.value = await fetch(`https://opensourcesoftcatalog-production.up.railway.app/api/v1/program/search/${searchProgram.value}?size=4&page=${pageNumber.value}&sort=addedAt,${selectedSortByTime.value.type}`, options)
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

  programResponse.value = await fetch(`https://opensourcesoftcatalog-production.up.railway.app/api/v1/program?size=6&page=${pageNumber.value}&sort=addedAt,${selectedSortByTime.value.type}`, options)
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


async function getAllProgramByCategory(){
  const options = {
    method: 'GET',
  };

  programResponse.value = await fetch(`https://opensourcesoftcatalog-production.up.railway.app/api/v1/program/category/${selectedCategory.value.categoryId}?size=6&page=${pageNumber.value}&sort=addedAt,${selectedSortByTime.value.type}`, options)
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

async function getAllCategoryFunction(){
  const options = {
    method: 'GET',
  };

  categoryData.value = await fetch('https://opensourcesoftcatalog-production.up.railway.app/api/v1/category', options)
    .then(response => response)
    .then(response => response.json())
    .then(data => data)

}

function resetSelectedCategory() {
  selectedCategory.value = null
  getAllProgram()
}

function logout(){
  localStorage.removeItem('token')
  localStorage.removeItem('roles')
  checkToken()
  showEditUser.value = false
  showEditUserPassword.value = false
}

async function saveUser(){
  if (loginData.login  === '' && loginData.password === ''){
    showMassage('Поля не можуть бути пустими!!!', 'error')
  }else {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const registerUserData = {
      login: loginData.login,
      password: loginData.password,
      role: {
        roleId: 2
      }
    };

    const options = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(registerUserData),
    };

    await fetch('https://opensourcesoftcatalog-production.up.railway.app/api/v1/auth/register', options)
      .then(response => {
        if(response.status === 401){
          localStorage.removeItem('token')
        }else {
          return response.json()
          authIsVisible.value = false
        }
      })
      .then(data => console.log(data))
      .catch(error => console.error(error));
  }
}

onMounted(() => {
  getAllCategoryFunction()
  getAllProgram()
  checkToken()
})

watch(pageNumber, () => {
  getAllProgram()
})

watch(selectedSortByTime, () => {
  if (selectedCategory.value) {
    getAllProgramByCategory()
  } else {
    getAllProgram()
  }
})

watch(searchProgram, () => {
  searchProgramByName()
})

watch(selectedCategory, () => {
  getAllProgramByCategory()
})


</script>

<template>

  <Toast />

  <Dialog v-model:visible="authIsVisible" modal header="Авторизація/Реєстрація" :style="{ width: '25rem' }">
    <span class="text-surface-600 dark:text-surface-0/70 block mb-5">Авторизація потрібно для того щоб була можливість класти відгуки.</span>
    <div class="flex items-center gap-3 mb-3">
      <label for="username" class="font-semibold w-[6rem]">Логін</label>
      <InputText v-model:="loginData.login" id="username" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex items-center gap-3 mb-5">
      <label for="password" class="font-semibold w-[6rem]">Пароль</label>
      <Password v-model="loginData.password" id="password" toggleMask />
    </div>
    <div class="flex justify-end gap-2">
      <Button @click="login" type="button" label="Авторизація"></Button>
      <Button @click="saveUser" type="button" label="Реєстрація"></Button>
    </div>
  </Dialog>

  <Dialog v-model:visible="showEditUserPassword" modal header="Редагування" :style="{ width: '25rem' }">
    <span class="text-surface-600 dark:text-surface-0/70 block mb-5">Змінна пароля</span>
    <div class="flex items-center gap-3 mb-5">
      <label for="email" class="font-semibold w-[6rem]">Пароль</label>
      <InputText v-model:="editUserDataPassword.password" id="email" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" icon="pi pi-check" @click="editUserPassword()"></Button>
    </div>
  </Dialog>

  <Dialog v-model:visible="showEditUser" modal header="Редагування" :style="{ width: '25rem' }">
    <span class="text-surface-600 dark:text-surface-0/70 block mb-5">Редагування користувача</span>
    <div class="flex items-center gap-3 mb-3">
      <label for="username" class="font-semibold w-[6rem]">Лоігн</label>
      <InputText v-model:="editUserDataLogin.login" id="username" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="Змінити пароль" @click="showEditUserPassword = true"></Button>
      <Button type="button" label="Зберегти" @click="editUser()"></Button>
      <Button type="button" label="Вийти з аккаунту" @click="logout()"></Button>
    </div>
  </Dialog>


  <div class="flex flex-row p-2 justify-between items-center">
    <div class="border-b p-2 flex-1">
      <InputText v-model:="searchProgram" placeholder="Пошук" class="w-full" />
    </div>
    <div class="p-2">
      <Button v-tooltip="'Авторизація потрібна для можливості залишати відгуки для додатків'" v-if="!isLogin" @click="authIsVisible = true" icon="pi pi-user"/>
      <Button @click="openAboutUserData" v-if="isLogin" :label="currentUser.login" icon="pi pi-user"/>
    </div>
  </div>

  <div class="w-5/6 m-auto mt-2 program-content border rounded">
    <div class="flex flex-row border-b m-2 p-2 justify-between">
      <div>
        <Button @click="resetSelectedCategory" label="Всі додатки"/>
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
                     :is-login="isLogin"
        />
      </div>
      <Paginator class="mt-auto" v-model:first="pageNumber" :rows="1" :totalRecords="programResponse.totalPages" template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" />
    </div>
  </div>

</template>

<style scoped>
</style>
