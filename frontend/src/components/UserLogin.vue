<template>
  <div class="form-container">
    <h2>Login</h2>
    <input v-model="email" placeholder="Email" type="email" />
    <input v-model="password" placeholder="Password" type="password" />
    <button @click="login">Login</button>
    <p>Need an account? <router-link to="/register">Register</router-link></p>
  </div>
</template>
  
  <script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-vue-v3";

const router = useRouter();

const email = ref("");
const password = ref("");
const { data, error, getData } = useVisitorData();

const login = async () => {
  await getData();

  if (error.value) {
    toastr.error(error.value.message);
    return;
  }

  if (!data.value || !data.value.visitorId) {
    toastr.error("Could not retrieve the device identifier.");
    return;
  }

  console.log("vis id", data.value.visitorId);

  axios
    .post("http://localhost:3000/login", {
      email: email.value,
      password: password.value,
      visitorId: data.value.visitorId,
      requestId: data.value.requestId,
    })
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      router.push("/");
      toastr.success("Logged in succesfully");
      email.value = "";
      password.value = "";
    })
    .catch((error) => {
      toastr.error(
        error.response?.data?.message ||
          "Login failed due to an unexpected error."
      );
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