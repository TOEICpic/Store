<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-image">
        <img src="../assets/images/logo.png" alt="Market" />
      </div>

      <div class="login-form-container">
        <nav class="breadcrumb">
          <a href="/home">หน้าแรก</a> > <a href="/register">สมัครสมาชิก</a> > <span>เข้าสู่ระบบ</span>
        </nav>

        <h2>เข้าสู่ระบบ</h2>
        <form @submit.prevent="submitLogin" class="login-form">
          <label class="form-label">
            อีเมล / เบอร์โทรศัพท์
            <input type="text" v-model="form.username" class="input-field" required />
          </label>

          <label class="form-label">
            รหัสผ่าน
            <input type="password" v-model="form.password" class="input-field" required />
          </label>


          <button type="submit" class="login-btn">เข้าสู่ระบบ</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

export default {
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    async submitLogin() {
      try {
        // Send the login request, determining whether the input is an email or phone
        const response = await axios.post('http://localhost:8800/api/v1/login', {
          email: this.form.username.includes('@') ? this.form.username : null,
          phone: !this.form.username.includes('@') ? this.form.username : null,
          password: this.form.password,
        });

        // Extract the token and user_id from the response
        const { token, user_id } = response.data;

        // Store the token and user_id in local storage to ensure fresh login data
        localStorage.setItem('token', token);
        localStorage.setItem('user_id', user_id); // Store the current user_id

        console.log('Token:', token);
        console.log('User ID:', user_id);

        // Show a success message using SweetAlert and navigate to home on confirmation
        Swal.fire({
          icon: 'success',
          title: 'เข้าสู่ระบบสำเร็จ',
          text: 'คุณเข้าสู่ระบบสำเร็จแล้ว!',
          confirmButtonText: 'OK'
        }).then(() => {


          location.reload();
        });
        this.$router.push('/home');
      } catch (error) {
        if (error.response && error.response.data.error) {
          Swal.fire({
            icon: 'error',
            title: 'เข้าสู่ระบบไม่สำเร็จ',
            text: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
            confirmButtonText: 'OK'
          });
          console.error('Login failed:', error.response.data.error);
        } else {
          alert('Failed to connect to server');
        }
      }
    }
  },
};
</script>

<style scoped>
.login-page {
  padding: 150px 0 150px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
}

.login-container {
  display: flex;
  max-width: 900px;
  width: 100%;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.login-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.login-image {
  flex: 1;
  background-color: #ccc;
}

.login-form-container {
  flex: 1;
  padding: 40px;
}

.breadcrumb {
  font-size: 14px;
  color: #007bff;
  margin-bottom: 10px;
}

.breadcrumb a {
  text-decoration: none;
  color: #007bff;
}

.breadcrumb span {
  color: #333;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-label {
  display: block;
  margin-bottom: 10px;
  font-size: 16px;
  color: #555;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

.forgot-password-link {
  color: #007bff;
  font-size: 14px;
  margin-top: 10px;
  text-decoration: none;
}

.forgot-password-link:hover {
  text-decoration: underline;
}

.login-btn {
  background-color: #d9534f;
  color: white;
  padding: 12px;
  margin-top: 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.login-btn:hover {
  background-color: #c9302c;
}
</style>
