import StoryDatabase from "../../data/database";
import { showFormattedDate } from "../../utils";
import Swal from "sweetalert2";

class BookmarkPage {
  async render() {
    return `
      <div class="page-title container">
        <h1>Cerita Tersimpan</h1>
      </div>
      <div class="home-content container">
        <div class="stories-container">
          <div class="stories-header">
            <h2>Cerita yang Kamu Simpan</h2>
            <div class="stories-count" id="stories-count"></div>
          </div>
          <div id="stories-list" class="stories-list"></div>
        </div>
      </div>
    `;
  }

  async afterRender() {
    await this.#renderBookmarkedStories();
  }

  async #renderBookmarkedStories() {
    const loadingIndicator = document.querySelector("#loading-indicator");
    loadingIndicator.classList.remove("hidden");
    const storiesListElement = document.querySelector("#stories-list");
    const storiesCount = document.querySelector("#stories-count");
    storiesListElement.innerHTML = "";

    try {
      const stories = await StoryDatabase.getAllStories();

      if (stories.length === 0) {
        storiesListElement.innerHTML = `
          <div class="empty-state">
            <i class="fa-solid fa-bookmark fa-3x"></i>
            <p class="empty-message">Kamu belum menyimpan cerita apapun.</p>
            <a href="#/home" class="btn btn-primary">Lihat Semua Cerita</a>
          </div>
        `;
        storiesCount.textContent = "";
        return;
      }

      storiesCount.innerHTML = `<span class="badge">${stories.length} Cerita Tersimpan</span>`;

      let storiesHTML = "";
      stories.forEach((story) => {
        storiesHTML += `
          <div class="story-item">
            <img src="${story.photoUrl}" alt="Cerita oleh ${
          story.name
        }" loading="lazy">
            <div class="story-content">
              <h3>${story.name}</h3>
              <small class="story-date">
                <i class="fa-regular fa-clock"></i> ${showFormattedDate(
                  story.createdAt
                )}
              </small>
              <p>${story.description}</p>
            </div>
            <button class="btn btn-delete" data-id="${story.id}">
              <i class="fa-solid fa-trash" aria-hidden="true"></i> Hapus
            </button>
          </div>
        `;
      });
      storiesListElement.innerHTML = storiesHTML;

      this.#addDeleteButtonListeners();
    } catch (error) {
      Swal.fire({
        title: "Gagal Memuat Cerita Tersimpan",
        text: error.message,
        icon: "error",
      });
    } finally {
      loadingIndicator.classList.add("hidden");
    }
  }

  #addDeleteButtonListeners() {
    const deleteButtons = document.querySelectorAll(".btn-delete");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", async (event) => {
        const storyId = event.currentTarget.dataset.id;

        try {
          const result = await Swal.fire({
            title: "Kamu yakin?",
            text: "Cerita yang dihapus tidak bisa dikembalikan.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
          });

          if (result.isConfirmed) {
            await StoryDatabase.deleteStory(storyId);

            Swal.fire(
              "Dihapus!",
              "Ceritamu telah dihapus dari daftar.",
              "success"
            );
            this.#renderBookmarkedStories();
          }
        } catch (err) {
          Swal.fire("Gagal Menghapus", err.message, "error");
        }
      });
    });
  }
}

export default BookmarkPage;
