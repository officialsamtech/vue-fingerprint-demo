<template>
  <div class="form-container">
    <h2>Register</h2>
    <input v-model="username" placeholder="Username" type="text" />
    <input v-model="email" placeholder="Email" type="email" />
    <input v-model="password" placeholder="Password" type="password" />
    <button @click="register">Register</button>
    <p>Already have an account? <router-link to="/login">Login</router-link></p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const email = ref("");
const password = ref("");
const username = ref("");
const router = useRouter();

const register = async () => {
  // Send user registration data to your backend
  axios
    .post("http://localhost:3000/register", {
      email: email.value,
      password: password.value,
      username: username.value,
    })
    .then((response) => {
      toastr.success("Registration successful");
      localStorage.setItem("user", response.data.username);
      router.push("/");
    })
    .catch((error) => {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toastr.error(error.response.data.message); // Display error message from backend
      } else {
        toastr.error("Registration failed due to an unexpected error.");
      }
    });
};
</script>

<style scoped>
.form-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

input {
  width: calc(100% - 20px);
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #34568b; /* A cool shade of blue */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #274257;
}
</style>