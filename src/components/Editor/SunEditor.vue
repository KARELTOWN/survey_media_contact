<template>
  <div>
    <!-- Textarea pour SunEditor -->
    <textarea ref="sunEditor" class="sun-editor-textarea"></textarea>

  </div>
</template>

<script>
import "suneditor/dist/css/suneditor.min.css";
import SunEditor from "suneditor";
import plugins from "suneditor/src/plugins";
import { ref, onMounted, watch } from "vue";

export default {
  name: "SunEditor",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue", "contentRich"],
  setup(props, { emit }) {
    const content = ref(props.modelValue || "");
    const editorInstance = ref(null); // Référence de l'éditeur

    const initializeEditor = () => {
      editorInstance.value = SunEditor.create(document.querySelector(".sun-editor-textarea"), {
        width: "100%",
        height: "300px",
        placeholder: "Écrivez ici...",
        buttonList: [
          ['undo', 'redo'],
          ['font', 'fontSize'],
          ['paragraphStyle', 'blockquote'],
          ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
          ['fontColor', 'hiliteColor', 'textStyle'],
          ['removeFormat'],
          '/', // Saut de ligne
          ['align', 'list', 'lineHeight'],
          ['link'],
        ],

        plugins: plugins,
        defaultStyle: 'font-family: Arial; font-size: 12px;',  // Applique Arial et taille 12px par défaut
        fontSize: [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72],
        fontFamily: ['Arial', 'Courier', 'Georgia', 'Times New Roman', 'Verdana'],

        charCounter: true,
        charCounterLabel: "Caractères:",
        attributesBlacklist: 'br',
      });
      if (props.modelValue) {
        editorInstance.value.setContents(props.modelValue); // Charger la valeur par défaut
      }
      // editorInstance.value.onInput = function (e, core) { console.log('onInput', e) }
      editorInstance.value.onChange = function (contents, core) {
        contents = contents.replace(/[\u200B-\u200D\uFEFF]/g, '')  // Supprime les caractères invisibles (espaces, ZWSP, BOM)
        editorInstance.value.save(); emit("contentRich", contents)
      }

    };

    onMounted(() => {
      initializeEditor();
    });

    // Surveiller les changements de `modelValue` pour les synchroniser avec l'éditeur
    watch(
      () => editorInstance,
      () => {
        content.value = editorInstance.value.getFullContents(true)

      }
    );
    watch(
      () => props.modelValue,
      (newValue) => {
        if (editorInstance.value && newValue !== editorInstance.value.getContents()) {
          editorInstance.value.setContents(newValue); // Mettre à jour l'éditeur avec la nouvelle valeur
        }
      }
    );


    return {
      content,
    };
  },
};
</script>

<style scoped>
.sun-editor-textarea {
  display: none;
  /* Masquer le textarea car SunEditor le remplace */
}

.preview {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}
</style>