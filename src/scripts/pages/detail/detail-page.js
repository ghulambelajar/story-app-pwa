import { getStoryDetail } from "../../data/api";
import { parseActivePathname } from "../../routes/url-parser";
import { showFormattedDate } from "../../utils";
import Swal from "sweetalert2";

export default class DetailPage {
  async render() {
    return `
      <div class="page-title container">
        <h1 id="story-title">Memuat Cerita...</h1>
      </div>
      <div id="story-detail-content" class="home-content container">
        <div class="stories-container">
          </div>
      </div>
    `;
  }

  async afterRender() {
    const { id } = parseActivePathname();
    const loadingIndicator = document.querySelector("#loading-indicator");
    loadingIndicator.classList.remove("hidden");

    try {
      const story = await getStoryDetail(id);
      const contentEl = document.querySelector(
        "#story-detail-content .stories-container"
      );

      document.querySelector("#story-title").innerText = story.name;
      contentEl.innerHTML = `
        <img src="${story.photoUrl}" alt="${
        story.name
      }" style="width: 100%; border-radius: 8px;">
        <h3 style="margin-top: 1rem;">${story.name}</h3>
        <small class="story-date" style="display: block; margin-top: 8px;">
          Dibuat pada: ${showFormattedDate(story.createdAt)}
        </small>
        <p style="margin-top: 1rem;">${story.description}</p>
        ${
          story.lat && story.lon
            ? `<p style="margin-top: 1rem; font-style: italic;">Lokasi: ${story.lat}, ${story.lon}</p>`
            : ""
        }
      `;
    } catch (error) {
      Swal.fire("Gagal Memuat", error.message, "error");
    } finally {
      loadingIndicator.classList.add("hidden");
    }
  }
}
