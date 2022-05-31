<template>
  <div class="menu">
    <GameView />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import GameView from "@/views/GameView.vue"; // @ is an alias to /src

@Options({
  components: {
    GameView,
  },
})
export default class MenuView extends Vue {}
</script>
