import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getAllStories } from "../../data/api";
import { showFormattedDate } from "../../utils";
import Swal from "sweetalert2";
import StoryDatabase from "../../data/database";

class HomePage {
  async render() {
    return `
      <div class="page-title container">
        <h1>Dasbor Cerita</h1>
      </div>
      <div class="home-content container"> 
        <div class="stories-container">
          <div class="stories-header">
            <h2>Daftar Cerita</h2>
          </div>
          <div id="stories-list" class="stories-list"></div>
        </div>
        <div class="map-container">
          <h2>Peta Cerita</h2>
          <div id="story-map" style="height: 400px;"></div>
        </div>
      </div>
    `;
  }

  async afterRender() {
    this.#showLoginSuccessToast();

    const defaultIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
    L.Marker.prototype.options.icon = defaultIcon;

    const map = L.map("story-map").setView([-6.2088, 106.8456], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const loadingIndicator = document.querySelector("#loading-indicator");
    loadingIndicator.classList.remove("hidden");

    try {
      const bookmarkedStories = await StoryDatabase.getAllStories();
      const savedStoryIds = new Set(bookmarkedStories.map((story) => story.id));
      const stories = await getAllStories();
      const storiesListElement = document.querySelector("#stories-list");
      let storiesHTML = "";

      stories.forEach((story) => {
        const isSaved = savedStoryIds.has(story.id);

        const saveButtonHtml = isSaved
          ? `<button class="btn btn-save" data-id="${story.id}" disabled>
               <i class="fa-solid fa-check" aria-hidden="true"></i> Tersimpan
             </button>`
          : `<button class="btn btn-save" data-id="${story.id}">
               <i class="fa-solid fa-bookmark" aria-hidden="true"></i> Simpan
             </button>`;

        storiesHTML += `
          <div class="story-item">
            <img src="${story.photoUrl}" alt="Cerita oleh ${story.name}">
            <h3>${story.name}</h3>
            <small class="story-date">${showFormattedDate(
              story.createdAt
            )}</small>
            <p>${story.description}</p>
            
            ${saveButtonHtml}
          </div>
        `;

        if (story.lat && story.lon) {
          L.marker([story.lat, story.lon])
            .addTo(map)
            .bindPopup(
              `<b>${story.name}</b><br>${story.description.substring(0, 30)}...`
            );
        }
      });
      storiesListElement.innerHTML = storiesHTML;

      this.#addSaveButtonListeners(stories);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Gagal Memuat Cerita",
        text: error.message,
        icon: "error",
      });
      window.location.hash = "#/";
    } finally {
      loadingIndicator.classList.add("hidden");
    }
  }

  #addSaveButtonListeners(stories) {
    const saveButtons = document.querySelectorAll(".btn-save");
    saveButtons.forEach((button) => {
      if (button.disabled) return;

      button.addEventListener("click", async (event) => {
        const buttonElement = event.currentTarget;
        const storyId = buttonElement.dataset.id;
        const storyToSave = stories.find((story) => story.id === storyId);

        if (!storyToSave) return;

        try {
          await StoryDatabase.putStory(storyToSave);

          Swal.fire({
            title: "Berhasil!",
            text: "Cerita telah disimpan.",
            icon: "success",
            toast: true,
            position: "top-end",
            customClass: { container: "my-swal-toast" },
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });

          buttonElement.disabled = true;
          buttonElement.innerHTML = `
            <i class="fa-solid fa-check" aria-hidden="true"></i> Tersimpan
          `;
        } catch (err) {
          Swal.fire("Gagal Menyimpan", err.message, "error");
        }
      });
    });
  }

  #showLoginSuccessToast() {
    const message = localStorage.getItem("login_success_message");

    if (message) {
      Swal.fire({
        title: "Login Berhasil!",
        text: message,
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          container: "my-swal-toast",
        },
      });
      localStorage.removeItem("login_success_message");
    }
  }
}

export default HomePage;
