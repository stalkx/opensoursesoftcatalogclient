<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const props = defineProps({
  modelValue:String
})

const emit = defineEmits(['update:modelValue'])


const editor = useEditor({
  content: props.modelValue,
  onUpdate: ({editor}) => {
    emit('update:modelValue', editor.getHTML())
  },
  editorProps: {
    attributes: {
      class: 'border p-4 overflow-y-auto min-h-[12rem] max-h-[12rem] outline-none max-w-none prose',
    }
  },
  extensions: [
    StarterKit,
  ],
})

</script>

<template>
  <div>
    <section v-if="editor" class="buttons flex items-center flex-wrap gap-x-4 border p-4">
      <button @click="editor.chain().focus().toggleBold().run()" :disabled="!editor.can().chain().focus().toggleBold().run()" :class="{ 'border': editor.isActive('bold') }" class="p-2 rounded">
        <i class="pi pi-bolt"></i>
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()" :disabled="!editor.can().chain().focus().toggleItalic().run()" :class="{ 'border': editor.isActive('italic') }" class="p-2 rounded">
        <i class="pi pi-info"></i>
      </button>
      <button @click="editor.chain().focus().toggleStrike().run()" :disabled="!editor.can().chain().focus().toggleStrike().run()" :class="{ 'border rounded': editor.isActive('strike') }" class="p-2 rounded">
        S
      </button>
      <button @click="editor.chain().focus().toggleCode().run()" :disabled="!editor.can().chain().focus().toggleCode().run()" :class="{ 'border rounded': editor.isActive('code') }" class="p-2 rounded">
        code
      </button>
      <button @click="editor.chain().focus().unsetAllMarks().run()">
        clear marks
      </button>
      <button @click="editor.chain().focus().clearNodes().run()">
        clear nodes
      </button>
      <button @click="editor.chain().focus().setParagraph().run()" :class="{ 'border rounded': editor.isActive('paragraph') }" class="p-2 rounded">
        paragraph
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'border rounded': editor.isActive('heading', { level: 1 }) }" class="p-2 rounded">
        h1
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'border rounded': editor.isActive('heading', { level: 2 }) }" class="p-2 rounded">
        h2
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'border rounded': editor.isActive('heading', { level: 3 }) }" class="p-2 rounded">
        h3
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'border rounded': editor.isActive('heading', { level: 4 }) }" class="p-2 rounded">
        h4
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'border rounded': editor.isActive('heading', { level: 5 }) }" class="p-2 rounded">
        h5
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'border rounded': editor.isActive('heading', { level: 6 }) }" class="p-2 rounded">
        h6
      </button>
      <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'border rounded': editor.isActive('bulletList') }" class="p-2 rounded">
        <i class="pi pi-list"></i>
      </button>
      <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'border rounded': editor.isActive('orderedList') }" class="p-2 rounded">
        ordered list
      </button>
      <button @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'border rounded': editor.isActive('codeBlock') }" class="p-2 rounded">
        <i class="pi pi-code"></i>
      </button>
      <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'border rounded': editor.isActive('blockquote') }" class="p-2 rounded">
        blockquote
      </button>
      <button @click="editor.chain().focus().setHorizontalRule().run()">
        horizontal rule
      </button>
      <button @click="editor.chain().focus().setHardBreak().run()">
        hard break
      </button>
      <button @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()">
        undo
      </button>
      <button @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()">
        redo
      </button>
    </section>
    <editor-content :editor="editor" />
  </div>
</template>

<style scoped>
</style>