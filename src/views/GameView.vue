<template>
  <div class="home">
    <GridHeader />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import GridHeader from "@/components/GridHeader.vue"; // @ is an alias to /src

@Options({
  components: {
    GridHeader,
  },
})
export default class GameView extends Vue {}
</script>
