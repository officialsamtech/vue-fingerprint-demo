<template>
  <div class="home-container">
    <h1>Welcome, {{ username }}</h1>
    <button @click="logout">Logout</button>
  </div>
</template>
  
  <script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const router = useRouter();

onMounted(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    router.push("/login");
  } else {
    username.value = user.username;
  }
});

const logout = () => {
  localStorage.removeItem("user");
  router.push("/login");
};
</script>

  <style scoped>
.home-container {
  text-align: center;
  margin-top: 50px;
}

button {
  margin-top: 20px;
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
  