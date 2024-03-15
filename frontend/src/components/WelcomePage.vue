<template>
  <div class="home-container">
    <h1>Welcome to the Application</h1>
    <div class="home-links">
      <router-link to="/register"> Register </router-link>
      <router-link to="/login"> Login </router-link>
    </div>
  </div>
</template>
  
  <script setup>
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
  