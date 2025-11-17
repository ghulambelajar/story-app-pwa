import "../../../styles/form.css";
import { loginUser } from "../../data/api";
import { updateNavLinks } from "../../utils";
import Swal from "sweetalert2";

class LoginPage {
  async render() {
    return `
      <div class="form-wrapper">
        <div class="form-container">
          <h2><i class="fa-solid fa-right-to-bracket"></i> Login</h2>
          <form id="loginForm">
            <div class="form-group">
              <label for="email">
                <i class="fa-solid fa-envelope"></i> Email
              </label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="nama@email.com"
                required
              >
            </div>
            <div class="form-group">
              <label for="password">
                <i class="fa-solid fa-lock"></i> Password
              </label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="Masukkan password"
                required
              >
            </div>
            <button type="submit" class="btn" id="submitButton">
              <i class="fa-solid fa-right-to-bracket"></i> Login
            </button>
          </form>
          <p class="mt-3">
            Belum punya akun? 
            <a href="#/register">Daftar di sini</a>
          </p>
        </div>
      </div>
    `;
  }

  async afterRender() {
    const loginForm = document.querySelector("#loginForm");
    const submitButton = document.querySelector("#submitButton");
    const loadingIndicator = document.querySelector("#loading-indicator");

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      loadingIndicator.classList.remove("hidden");
      submitButton.disabled = true;

      try {
        const email = event.target.email.value;
        const password = event.target.password.value;

        const loginResult = await loginUser({ email, password });

        localStorage.setItem("token", loginResult.token);
        localStorage.setItem("userName", loginResult.name);

        updateNavLinks(true);
        localStorage.setItem(
          "login_success_message",
          `Selamat datang kembali, ${loginResult.name}.`
        );

        window.location.hash = "#/home";
      } catch (error) {
        Swal.fire({
          title: "Login Gagal",
          text: error.message,
          icon: "error",
          confirmButtonColor: "#667eea",
        });
      } finally {
        loadingIndicator.classList.add("hidden");
        submitButton.disabled = false;
      }
    });
  }
}

export default LoginPage;
