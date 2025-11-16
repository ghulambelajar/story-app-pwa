import "../../../styles/form.css";
import L from "leaflet";
import { addNewStory } from "../../data/api";
import Swal from "sweetalert2";

class AddStoryPage {
  async render() {
    return `
      <div class="form-container">
        <h1>Tambah Cerita Baru</h1>
        <form id="addStoryForm">
          <div class="form-group">
            <label for="description">Deskripsi</label>
            <textarea id="description" name="description" rows="4" required></textarea>
          </div>
          <div class="form-group">
            <label for="photo">Unggah Foto</label>
            <input type="file" id="photo" name="photo" accept="image/*" required>
          </div>
          <div class="form-group">
            <label>Pilih Lokasi di Peta (Opsional)</label>
            <div id="location-map" style="height: 300px;"></div>
            <p id="coords-display" style="margin-top: 8px; font-style: italic;"></p>
          </div>
          <button type="submit" class="btn" id="submitButton">Kirim Cerita</button>
        </form>
      </div> 
    `;
  }

  async afterRender() {
    const map = L.map("location-map").setView([-6.2088, 106.8456], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map
    );

    let selectedLat = null;
    let selectedLon = null;
    let marker = null;
    const coordsDisplay = document.querySelector("#coords-display");

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      selectedLat = lat;
      selectedLon = lng;
      if (marker) {
        map.removeLayer(marker);
      }
      marker = L.marker([lat, lng]).addTo(map);
      coordsDisplay.textContent = `Lokasi dipilih: Lat: ${lat.toFixed(
        4
      )}, Lon: ${lng.toFixed(4)}`;
    });

    const addStoryForm = document.querySelector("#addStoryForm");
    const submitButton = document.querySelector("#submitButton");
    const loadingIndicator = document.querySelector("#loading-indicator");

    addStoryForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      loadingIndicator.classList.remove("hidden");
      submitButton.disabled = true;

      try {
        const description = event.target.description.value;
        const photo = event.target.photo.files[0];

        if (photo && photo.size > 1000000) {
          Swal.fire({
            title: "Oops...",
            text: "Ukuran file gambar tidak boleh lebih dari 1 MB!",
            icon: "error",
          });
          return;
        }

        if (!description || !photo) {
          Swal.fire({
            title: "Oops...",
            text: "Deskripsi dan foto tidak boleh kosong!",
            icon: "error",
          });
          return;
        }
        await addNewStory({
          description,
          photo,
          lat: selectedLat,
          lon: selectedLon,
        });
        Swal.fire({
          title: "Berhasil!",
          text: "Cerita berhasil ditambahkan!",
          icon: "success",
        });

        window.location.hash = "#/home";
      } catch (error) {
        if (error.message.includes("Failed to fetch")) {
          Swal.fire({
            title: "Berhasil (Offline)!",
            text: "Cerita berhasil disimpan dan akan diunggah otomatis saat Anda kembali online.",
            icon: "info",
          });

          window.location.hash = "#/home";
        } else {
          Swal.fire({
            title: "Gagal Menambahkan Cerita",
            text: error.message,
            icon: "error",
          });
        }
      } finally {
        loadingIndicator.classList.add("hidden");
        submitButton.disabled = false;
      }
    });
  }
}
export default AddStoryPage;
