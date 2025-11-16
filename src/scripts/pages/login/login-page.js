import "../../../styles/form.css";
import { loginUser } from "../../data/api";
import { updateNavLinks } from "../../utils";
import Swal from "sweetalert2";

class LoginPage {
  async render() {
    return `
      <div class="form-container">
        <h2>Login</h2>
        <form id="loginForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
          </div>
          <button type="submit" class="btn" id="submitButton">Login</button>
        </form>
        <p class="mt-3">Belum punya akun? <a href="#/register">Daftar di sini</a></p>
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
        });
      } finally {
        loadingIndicator.classList.add("hidden");
        submitButton.disabled = false;
      }
    });
  }
}

export default LoginPage;
