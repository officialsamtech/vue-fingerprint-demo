<template>
  <div class="home-container">
    <h1>Welcome to the Application</h1>
    <button @click="getData({ ignoreCache: true })">Identify Device</button>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>
      <p>Visitor ID: {{ data?.visitorId }}</p>
      <pre>{{ JSON.stringify(data, null, 2) }}</pre>
    </div>
  </div>
</template>
  
  <script setup>
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-vue-v3";

const { data, error, isLoading, getData } = useVisitorData(
  { extendedResult: true },
  { immediate: false }
);
</script>

  <style scoped>
.home-container {
  text-align: center;
  margin-top: 20px;
}
button {
  margin: 20px 0;
  padding: 10px 20px;
  background-color: #34568b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #274257;
}
</style>
  