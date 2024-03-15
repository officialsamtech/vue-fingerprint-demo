<template>
  <div class="home-container">
    <h1>Welcome {{ username }}</h1>
    <div class="home-links">
      <div v-if="!username">
        <router-link to="/register"> Register </router-link>
      </div>
    </div>
  </div>
</template>
  
<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    const username = ref("");

    onMounted(() => {
      // Check if username exists in localStorage
      const storedUsername = localStorage.getItem("user");
      if (storedUsername) {
        username.value = storedUsername;
      }
    });

    return {
      username,
    };
  },
};
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

.home-links {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
</style>
  