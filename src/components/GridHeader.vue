<template>
  <div class="grid-header">
    <span class="header-game-id">Game ID: {{ gameId }}</span>
    <span class="header-timer">{{ timer }}</span>
  </div>
</template>

<script lang="ts">
import * as Vue from "vue";

const GridHeader = Vue.extend({
  data() {
    return {
      gameId: 69420,
      timer: 0,
    };
  },

  methods: {
    incrementTimer() {
      this.timer++;
    },
  },

  mounted() {
    this.incrementTimer();
  },
});

export default GridHeader;
</script>
