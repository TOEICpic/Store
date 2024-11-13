<template>
  <div class="register-page">
    <main>
      <div class="register-container">
        <nav class="breadcrumb">
          <a href="/home">หน้าแรก</a> > <span>สมัครสมาชิก</span> > <a href="/login">เข้าสู่ระบบ</a>
        </nav>
        <div class="register-header">
          <h2>สมัครสมาชิกผู้ซื้อ</h2>
        </div>

        <form @submit.prevent="submitForm" class="register-form">
          <label class="form-label">
            ชื่อ *
            <input type="text" v-model="form.firstName" :class="['input-field', { 'input-error': errors.firstName }]"
              @input="clearError('firstName')" required />
          </label>

          <label class="form-label">
            นามสกุล *
            <input type="text" v-model="form.lastName" :class="['input-field', { 'input-error': errors.lastName }]"
              @input="clearError('lastName')" required />
          </label>

          <div class="login-info">
            <label>ข้อมูลเข้าสู่ระบบด้วย *</label>
            <div class="radio-group">
              <input type="radio" id="email" value="email" v-model="form.loginWith" required />
              <label for="email" class="radio-label">อีเมล</label>
              <input type="radio" id="phone" value="phone" v-model="form.loginWith" required />
              <label for="phone" class="radio-label">เบอร์โทรศัพท์</label>
            </div>
            <label v-if="form.loginWith === 'email'" class="form-label">
              อีเมล *
              <input type="email" v-model="form.email" :class="['input-field', { 'input-error': errors.email }]"
                @input="clearError('email')" required />
            </label>
            <label v-if="form.loginWith === 'phone'" class="form-label">
              เบอร์โทรศัพท์ *
              <input type="tel" v-model="form.phone" :class="['input-field', { 'input-error': errors.phone }]"
                @input="validatePhone" maxlength="10" required />
            </label>
          </div>

          <label class="form-label">
            รหัสผ่าน *
            <input type="password" v-model="form.password" :class="['input-field', { 'input-error': errors.password }]"
              @input="clearError('password')" required />
          </label>

          <label class="form-label">
            ยืนยันรหัสผ่าน *
            <input type="password" v-model="form.confirmPassword"
              :class="['input-field', { 'input-error': errors.confirmPassword }]" @input="clearError('confirmPassword')"
              required />
          </label>

          <button type="submit" class="submit-btn">ยืนยันการสมัคร</button>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2'; // นำเข้า SweetAlert2

export default {
  setup() {
    const router = useRouter();
    const gotoPage = () => {
      router.push('/login');
    };
    return {
      gotoPage,
    };
  },
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        loginWith: 'email',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
      },
      errors: {
        firstName: false,
        lastName: false,
        email: false,
        phone: false,
        password: false,
        confirmPassword: false,
      },
    };
  },
  methods: {
    async submitForm() {
      this.resetErrors();

      let valid = true;
      if (!this.form.firstName) {
        this.errors.firstName = true;
        valid = false;
      }
      if (!this.form.lastName) {
        this.errors.lastName = true;
        valid = false;
      }
      if (this.form.loginWith === 'email' && !this.form.email) {
        this.errors.email = true;
        valid = false;
      }
      if (this.form.loginWith === 'phone' && !this.form.phone) {
        this.errors.phone = true;
        valid = false;
      }
      if (!this.form.password) {
        this.errors.password = true;
        valid = false;
      }
      if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = true;
        valid = false;
        alert("Passwords do not match");
      }

      if (valid) {
        try {
          const response = await axios.post('http://localhost:8800/api/v1/customers', {
            first_name: this.form.firstName,
            last_name: this.form.lastName,
            email: this.form.email || null,
            phone: this.form.phone || null,
            password: this.form.password,
            login_method: this.form.loginWith
          });
          console.log("User registered with ID:", response.data.user.user_id);

          // แสดง pop-up เมื่อสมัครสำเร็จ
          Swal.fire({
            icon: 'success',
            title: 'คุณได้ทำการสมัครสมาชิกเรียบร้อยแล้ว',
            text: 'Registration successful!',
            confirmButtonText: 'OK'
          }).then(() => {
            // Redirect หรือทำงานอื่นๆ หลังจากกดปุ่ม OK
            this.gotoPage(); // เปลี่ยนเส้นทางไปหน้าอื่น
          });
        } catch (error) {
          if (error.response && error.response.status === 400) {
            alert(error.response.data.message);
          } else {
            console.error("Registration error:", error);
          }
        }
      }
    },
    validatePhone() {
      // Remove any non-numeric characters
      this.form.phone = this.form.phone.replace(/[^0-9]/g, '');
    },
    resetErrors() {
      for (const key in this.errors) {
        this.errors[key] = false;
      }
    },
    clearError(field) {
      this.errors[field] = false;
    },
  },
};
</script>


<style scoped>
.register-page {
  padding: 50px 0 79px 0;
  font-family: 'Arial', sans-serif;
  background-color: #f8f9fa;
}

.register-container {
  max-width: 700px;
  margin: auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

.register-header {
  text-align: center;
  margin-bottom: 20px;
}

.register-header h2 {
  color: #333;
  font-size: 24px;
}

.form-label {
  display: block;
  color: #555;
  margin-bottom: 8px;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.input-error {
  border-color: red;
}

.radio-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.radio-label {
  margin-left: 5px;
}

.submit-btn {
  background-color: #d9534f;
  color: white;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
}

.submit-btn:hover {
  background-color: #c9302c;
}
</style>
