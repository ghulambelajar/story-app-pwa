import "../../../styles/form.css";
import { registerUser } from "../../data/api";
import Swal from "sweetalert2";

class RegisterPage {
  async render() {
    return `
      <div class="form-container">
        <h2>Register</h2>
        <form id="registerForm">
          <div class="form-group">
            <label for="name">Nama</label>
            <input type="text" id="name" name="name" required> 
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required> 
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" minlength="8" required> 
          </div>
          <button type="submit" class="btn" id="submitButton">Register</button>
        </form>
        <p class="mt-3">Sudah punya akun? <a href="#/">Login di sini</a></p>
      </div>
    `;
  }

  async afterRender() {
    const registerForm = document.querySelector("#registerForm");
    const submitButton = document.querySelector("#submitButton");
    const loadingIndicator = document.querySelector("#loading-indicator");

    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      loadingIndicator.classList.remove("hidden");
      submitButton.disabled = true;

      try {
        const name = event.target.name.value;
        const email = event.target.email.value;
        const password = event.target.password.value;

        await registerUser({ name, email, password });

        Swal.fire({
          title: "Registrasi Berhasil!",
          text: "Akunmu berhasil dibuat. Silakan login.",
          icon: "success",
        });

        window.location.hash = "#/";
      } catch (error) {
        Swal.fire({
          title: "Registrasi Gagal",
          text: error.message,
          icon: "error",
        });
      } finally {
        loadingIndicator.classList.add("hidden");
        submitButton.disabled = false;
      }
    });
  }
}

export default RegisterPage;
