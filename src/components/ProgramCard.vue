<script setup>

import Image from 'primevue/image'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import { onMounted, ref, watch } from 'vue'
import { format } from 'date-fns'
import Tiptap from '@/components/Tiptap.vue'
import InputText from 'primevue/inputtext'
import FileUpload from 'primevue/fileupload'
import Dialog from 'primevue/dialog'
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Rating from 'primevue/rating'
import Paginator from 'primevue/paginator'
import Dropdown from 'primevue/dropdown';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';


const toast = useToast();


const averageRating = ref(0)

const props = defineProps({
  programId: Number,
  programName: String,
  programDescription: String,
  programIconUrl: String,
  programVersion: String,
  programDeveloper: String,
  programSystemSupport: String,
  programDownloadUrl: String,
  programGitHubUrl: String,
  addedAt: [String, Date],
  category: Object,
  isLogin: Boolean
})

const createComment = ref({
  commentBody: '',
  rating: 0,
  user:{},
  program:{
    programId:props.programId
  }
})

const formattedAddedAt = ref('')
const readMoreProgramDialog = ref(false)
const showAddComment = ref(false)
const commentResponse = ref([])
const commentPage = ref(0)
const selectedSortByTime = ref({
  name: 'Спочатку старі',
  type: 'asc'
})
const typeSort = ref([
  { name: 'Спочатку старі', type: 'asc' },
  { name: 'Спочатку нові', type: 'desc' }
]);
const currentUser = ref({})


const showMassage = (text, severity) => {
  toast.add({ severity: severity, summary: 'Повідомлення', detail: text, life: 3000 });
};


// Додайте нову функцію для форматування дати
function formatCommentDate(date) {
  return format(new Date(date), 'dd-MM-yyyy HH:mm');
}


async function getAverageRating() {
  const options = {
    method: 'GET'
  };

  const response = await fetch(`https://opensourcesoftcatalog-production.up.railway.app/api/v1/comment/average/${props.programId}`, options);
  const data = await response.json();
  averageRating.value = data.averageRating;
}

async function getUserInfo(){

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
  myHeaders.append('Content-Type', 'application/json');

  const options = {
    method: 'GET',
    headers: myHeaders
  };

  createComment.value.user = await fetch('https://opensourcesoftcatalog-production.up.railway.app/api/v1/user/user-info', options)
    .then(response => response)
    .then(response => response.json())
    .then(data => data)

  currentUser.value = createComment.value.user // Set the current user

}

async function saveComment(){
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
  myHeaders.append('Content-Type', 'application/json');

  const options = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(createComment.value),
  };

  await fetch('https://opensourcesoftcatalog-production.up.railway.app/api/v1/comment/save', options)
    .then(response => {
      if(response.status === 401){
        localStorage.removeItem('token')
      }else {
        getAverageRating()
        getAllComment()
        showMassage('Відгук успішно доданий', 'success')
        showAddComment.value = false
        return response.json()
      }
    })
    .then(data => console.log(data))
    .catch(error => console.error(error));
}


async function getAllComment() {

  const options = {
    method: 'GET',
  };

  const response = await fetch(`https://opensourcesoftcatalog-production.up.railway.app/api/v1/comment/program/${props.programId}?size=6&page=${commentPage.value}&sort=addedAt,${selectedSortByTime.value.type}`, options);
  if (response.status === 401) {
    localStorage.removeItem('token');
  } else {
    const data = await response.json();
    // Форматування дати для кожного коментаря
    data.content.forEach(comment => {
      comment.formattedAddedAt = formatCommentDate(comment.addedAt);
    });
    commentResponse.value = data;
  }
}

// Function to delete a comment
async function deleteComment(comment) {
  const myHeaders = new Headers()
  myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`)
  myHeaders.append('Content-Type', 'application/json')

  const options = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(comment),
  }

  await fetch(`https://opensourcesoftcatalog-production.up.railway.app/api/v1/comment/remove`, options)
    .then(response => {
      if (response.status === 401) {
        localStorage.removeItem('token')
      } else {
        showMassage('Відгук успішно видалений', 'success')
        getAllComment()
        getAverageRating()
        return response.json()
      }
    })
    .then(data => console.log(data))
    .catch(error => console.error(error))
}

function goToDownload() {
  window.location.href = props.programDownloadUrl;
}

onMounted(() => {

  if (props.isLogin){
    getUserInfo()
  }

  if (props.addedAt) {
    const date = new Date(props.addedAt)
    formattedAddedAt.value = format(date, 'dd-MM-yyyy HH:mm')
  }

  getAverageRating()
  getAllComment()

})

watch(selectedSortByTime, () => {
  getAllComment()
})

watch(commentPage, () => {
  getAllComment()
})

</script>

<template>
  <Toast/>
  <Dialog v-model:visible="readMoreProgramDialog" modal :header="props.programName" :style="{ width: '83.333333%' }">
    <div class="flex flex-row gap-5 border-b w-full p-2">
      <div class="border rounded p-2 flex items-center">
        <Image :src="props.programIconUrl" width="250" alt="Image" preview />
      </div>
      <div>
        <div class="flex flex-row gap-2 items-center">
          <i class="pi pi-book"></i>
          <h1 class="font-bold">Ім'я додатку:</h1>
          <p>{{ props.programName }}</p>
        </div>
        <div class="flex flex-row gap-2 items-center">
          <i class="pi pi-server"></i>
          <h1 class="font-bold">Версія додатку:</h1>
          <p>{{ props.programVersion }}</p>
        </div>
        <div class="flex flex-row gap-2 items-center">
          <i class="pi pi-user"></i>
          <h1 class="font-bold">Розробник додатку:</h1>
          <p>{{ props.programDeveloper }}</p>
        </div>
        <div class="flex flex-row gap-2 items-center">
          <i class="pi pi-microsoft"></i>
          <h1 class="font-bold">Операційні системи які підримує додаток:</h1>
          <p>{{ props.programSystemSupport }}</p>
        </div>
        <div class="flex flex-row gap-2 items-center">
          <i class="pi pi-microsoft"></i>
          <h1 class="font-bold">Категорія:</h1>
          <p>{{ props.category.categoryName }}</p>
        </div>
        <div class="flex flex-row gap-2 items-center">
          <i class="pi pi-github"></i>
          <h1 class="font-bold">Посиланян на GitHub:</h1>
          <a :href="props.programGitHubUrl">{{ props.programGitHubUrl }}</a>
        </div>
        <div class="flex flex-row gap-2 items-center">
          <i class="pi pi-calendar-plus"></i>
          <h1 class="font-bold">Дата додавання додатку на сайт:</h1>
          <p>{{ formattedAddedAt }}</p>
        </div>
        <div class="flex flex-row gap-2 items-center">
          <i class="pi pi-star-fill"></i>
          <h1 class="font-bold">Рейтнг:</h1>
          <Rating v-model:="averageRating" readonly  :cancel="false" />
        </div>
        <div class="mt-4 w-full border">
          <Button class="w-full" label="Завантажити" @click="goToDownload"/>
        </div>
      </div>
    </div>
    <div>
      <TabView>
        <TabPanel header="Опис додатку">
          <div class="prose" :style="'max-width: 100%;'" v-html="props.programDescription"></div>
        </TabPanel>
        <TabPanel header="Відгуки">

          <div class="mb-5 flex flex-row justify-between">
            <Button v-if="isLogin" @click="showAddComment = true" icon="pi pi-plus" label="Додати відгук" />
            <Dropdown v-model="selectedSortByTime" :options="typeSort" optionLabel="name" placeholder="Тип сортування" class="w-full md:w-[14rem]" />
          </div>

          <Dialog v-model:visible="showAddComment" modal header="Додати відгук" class="w-4/5">
            <div class="flex flex-col gap-5">
              <div>
                <h1>Відгук</h1>
                <Tiptap v-model:="createComment.commentBody"/>
              </div>
              <div class="flex flex-row gap-2">
                <h1>Рейтинг</h1>
                <Rating v-model="createComment.rating"  :cancel="false" />
              </div>
              <Button @click="saveComment()" label="Зберегти"/>
            </div>
          </Dialog>

          <div class="flex flex-col gap-2">
            <div v-for="comment in commentResponse.content" :key="comment.commentId" class="flex flex-col gap-4">
              <div class="border p-2">
                <div class="flex flex-row items-center justify-between">
                  <div class="flex flex-row items-center gap-2">
                    <Avatar :label="comment.user.login[0]" class="mr-2" size="large" />
                    <h1>{{ comment.user.login + " " + "( " + comment.formattedAddedAt + " )"}}</h1>
                  </div>
                  <div>
                    <Rating v-model="comment.rating" readonly  :cancel="false" />
                  </div>
                </div>
                <div class="prose" v-html="comment.commentBody"></div>
                <div v-if="currentUser && comment.user.userId === currentUser.userId" class="flex justify-end">
                  <Button v-if="isLogin" @click="deleteComment(comment)" icon="pi pi-trash" label="Видалити" class="p-button-danger p-button-text"/>
                </div>
              </div>
            </div>
          </div>
          <Paginator class="mt-auto" v-model:first="commentPage" :rows="1" :totalRecords="commentResponse.totalPages" template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" />
        </TabPanel>
      </TabView>
    </div>
  </Dialog>

  <div class="card flex flex-col gap-3 p-2 border max-w-72">
    <div class="p-2 flex flex-col align-middle justify-center">
      <div class="max-h-64 min-h-64 flex flex-col justify-center">
        <Image :src="props.programIconUrl" width="250" alt="Image" preview />
      </div>
      <h1>{{props.programName}}</h1>
      <h1>Доданий на сайт: ( {{formattedAddedAt}} )</h1>
    </div>
    <div>
      <Button @click="readMoreProgramDialog = true" label="Читати більше" icon="pi pi-download" size="small" />
    </div>
  </div>
</template>

<style scoped>
</style>