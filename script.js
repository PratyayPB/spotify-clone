//Global variables - Static JSON-based approach
let recentsContainer = document.querySelector(".recently-played"); // Container to display songs in library
let currentSong;
let currentAlbum = null; // Currently selected album from JSON
let currentSongIndex = 0; // Current song index in the album
let songsData = null; // Loaded JSON data

//Attach event listeners to play, pause, prev and next buttons
let playPauseBtn = document.querySelector(".play-pause-btn button");
let playBtn = playPauseBtn.querySelector(".play-btn-playbar");
let pauseBtn = playPauseBtn.querySelector(".pause-btn-playbar");

var showPlayhidePause = function () {
  playBtn.classList.add("show");
  playBtn.classList.remove("hide");
  pauseBtn.classList.add("hide");
  pauseBtn.classList.remove("show");
};

var showPausehidePlay = function () {
  playBtn.classList.add("hide");
  playBtn.classList.remove("show");
  pauseBtn.classList.add("show");
  pauseBtn.classList.remove("hide");
};

// Loads songs data from static JSON file (replaces directory fetching)
const loadSongsData = async () => {
  try {
    let response = await fetch("./songs.json");
    let data = await response.json();
    console.log("Songs data loaded successfully");
    return data;
  } catch (error) {
    console.error("Error loading songs.json:", error);
    return null;
  }
};

// Displays all the albums from JSON data (replaces directory scanning)
async function displayAlbums() {
  if (!songsData) {
    console.error("Songs data not loaded");
    return;
  }

  let cardContainer = document.querySelector(".card-collection");
  cardContainer.innerHTML = "";

  // Iterate through albums from JSON
  songsData.albums.forEach((album) => {
    // Ensure songs is an array (fix for single-song albums)
    if (!Array.isArray(album.songs)) {
      album.songs = [album.songs];
    }

    cardContainer.innerHTML += `<div data-album-id="${album.id}" class="card-container flex-cards bg-grad-2 ">
                            <div class="card relative-pos">
                                <div class="song-cover-img relative-pos"><img src="${album.cover}" alt="">
                                </div>
                                <div class="play-btn absolute-pos"><img class="invert hover-pointer" src="elements/play.svg" alt="">
                                </div>
                                <p class="song-name">${album.title}</p>
                            <p class="artist-name">${album.description}</p>
                            </div>
                            
                        </div>`;
  });

  // Add click event listeners to album cards
  document.querySelectorAll(".card-container").forEach((e) => {
    e.addEventListener("click", async (event) => {
      const albumId = event.currentTarget.dataset.albumId;
      
      // Find the album in songsData
      currentAlbum = songsData.albums.find((album) => album.id === albumId);
      
      if (currentAlbum) {
        // Ensure songs is an array
        if (!Array.isArray(currentAlbum.songs)) {
          currentAlbum.songs = [currentAlbum.songs];
        }
        
        document.querySelector(".cover-image-playbar img").src = currentAlbum.cover;
        displaySongs(currentAlbum);
        
        // If play button is clicked, play the first song
        if (
          event.target.matches(".play-btn") ||
          event.target.matches(".play-btn img")
        ) {
          currentSongIndex = 0;
          playSong(currentAlbum.songs[0]);
          showPausehidePlay();
        }
      }
    });
  });
}

// Displays the fetched songs in the library (uses JSON data)
async function displaySongs(album) {
  recentsContainer.innerHTML = ""; // Clear previous content
  recentsContainer.innerHTML += `<ul class="song-list-recents flex"></ul>`; // Add a new ul element to hold the songs

  // Ensure songs is an array
  const songs = Array.isArray(album.songs) ? album.songs : [album.songs];

  // Loop through the songs from JSON and add them to the recentsContainer
  songs.forEach((song, index) => {
    recentsContainer.firstChild.innerHTML += ` <div class="recents-song-container bg-grey-2 flex" data-song-index="${index}">
        <div class="cover-and-details-recents flex">
                     <img src="${album.cover}" alt="" width="50px" height="50px" style="border-radius: 5px;">
                      <span class="song-info-recents">
                      <p class="song-name-recents">${song.title}</p>
                      </span>
                      </div>

                      <div class="play-btn-recents">
                      <img class="invert hover-pointer" src="elements/play.svg" alt="" width="20px">
                      </div>
        </div>`;
  });
}

// Plays song - now accepts song object from JSON
function playSong(song) {
  if (currentSong) {
    currentSong.pause(); // Pause the currently playing song if it exists
    currentSong.currentTime = 0; // Reset the current time to the beginning
  }

  currentSong = new Audio(song.src); // Create a new Audio object with the song URL from JSON
  currentSong.play(); // Play the song
  timeUpdate(currentSong); // Call the timeUpdate function to update the play bar

  document.querySelector(".playbar-song-name p").innerText = song.title;
}

// Converts seconds to a string in the format "MM:SS"
function secondsToMinutesSeconds(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const paddedSecs = secs < 10 ? "0" + secs : secs;
  return `${mins}:${paddedSecs}`;
}

// Time update event listener to update the play bar
function timeUpdate(song) {
  song.addEventListener("timeupdate", () => {
    document.querySelector(".current-time").innerText =
      `${secondsToMinutesSeconds(song.currentTime)}`;
    document.querySelector(".total-time").innerText =
      `${secondsToMinutesSeconds(song.duration)}`;

    document.querySelector(".circle-seek").style = `left: ${
      (song.currentTime / song.duration) * 100
    }%`;
    document.querySelector(".seekbar").classList.remove("color-bar");
    document.querySelector(".seekbar").style =
      `background: linear-gradient(to right, #1ED760 , #282828 ${
        (song.currentTime / song.duration) * 100
      }%)`;
  });
}

// Search songs across all albums in JSON data
async function searchSongs(query) {
  if (!songsData) {
    console.error("Songs data not loaded");
    return;
  }

  const searchQuery = query.target.value.toLowerCase().trim();
  
  if (searchQuery === "") {
    // If search is empty, clear the display
    recentsContainer.innerHTML = "";
    return;
  }

  let filteredSongsArr = [];
  let searchResults = []; // Store {album, song, songIndex} objects

  // Search across all albums
  songsData.albums.forEach((album) => {
    const songs = Array.isArray(album.songs) ? album.songs : [album.songs];
    
    songs.forEach((song, index) => {
      if (song.title.toLowerCase().includes(searchQuery)) {
        searchResults.push({
          album: album,
          song: song,
          songIndex: index
        });
      }
    });
  });

  if (searchResults.length === 0) {
    recentsContainer.innerHTML = ""; // Clear previous content
    recentsContainer.innerHTML = `<h4>No results found with "${query.target.value}"</h4>`;
  } else {
    // Display search results
    recentsContainer.innerHTML = ""; // Clear previous content
    recentsContainer.innerHTML += `<ul class="song-list-recents flex"></ul>`;

    searchResults.forEach((result) => {
      recentsContainer.firstChild.innerHTML += ` <div class="recents-song-container bg-grey-2 flex" data-search-result="true">
        <div class="cover-and-details-recents flex">
                     <img src="${result.album.cover}" alt="" width="50px" height="50px" style="border-radius: 5px;">
                      <span class="song-info-recents">
                      <p class="song-name-recents">${result.song.title}</p>
                      </span>
                      </div>

                      <div class="play-btn-recents">
                      <img class="invert hover-pointer" src="elements/play.svg" alt="" width="20px">
                      </div>
        </div>`;
    });

    // Add click handler for search results
    recentsContainer.querySelectorAll(".recents-song-container").forEach((container, index) => {
      container.addEventListener("click", (event) => {
        if (
          event.target.matches(".play-btn-recents") ||
          event.target.matches(".play-btn-recents img")
        ) {
          const result = searchResults[index];
          currentAlbum = result.album;
          currentSongIndex = result.songIndex;
          
          document.querySelector(".cover-image-playbar img").src = currentAlbum.cover;
          playSong(result.song);
          showPausehidePlay();
        }
      });
    });
  }
}

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId); // Clear previous timer
    timeoutId = setTimeout(() => {
      func.apply(this, args); // Call the actual function
    }, delay);
  };
}

// Main function
async function main() {
  // Load songs data from JSON (replaces directory scanning)
  songsData = await loadSongsData();
  
  if (!songsData) {
    console.error("Failed to load songs data");
    return;
  }

  displayAlbums();

  // Click event listener for songs in the library
  recentsContainer.addEventListener("click", (event) => {
    if (
      event.target.matches(".play-btn-recents") ||
      event.target.matches(".play-btn-recents img")
    ) {
      // Skip if this is a search result (handled separately)
      const container = event.target.closest(".recents-song-container");
      if (container.dataset.searchResult === "true") {
        return;
      }

      // Get the song index from the container
      const songIndex = parseInt(container.dataset.songIndex);
      
      if (currentAlbum && !isNaN(songIndex)) {
        currentSongIndex = songIndex;
        const songs = Array.isArray(currentAlbum.songs) ? currentAlbum.songs : [currentAlbum.songs];
        playSong(songs[songIndex]);
        showPausehidePlay();
      }
    }
  });

  // Play and pause button functionality
  playPauseBtn.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      showPausehidePlay();
    } else {
      currentSong.pause();
      showPlayhidePause();
    }
  });

  // Event listener for seekbar to change the current time of the song
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle-seek").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Event listener for previous button - now uses array index
  document.querySelector(".prev-btn").addEventListener("click", () => {
    if (!currentAlbum) {
      window.alert("No album selected");
      return;
    }

    const songs = Array.isArray(currentAlbum.songs) ? currentAlbum.songs : [currentAlbum.songs];

    if (currentSongIndex === 0) {
      window.alert("No previous song available");
      return;
    }

    currentSongIndex--;
    playSong(songs[currentSongIndex]);
    showPausehidePlay();
  });

  // Event listener for next button - now uses array index
  document.querySelector(".next-btn").addEventListener("click", () => {
    if (!currentAlbum) {
      window.alert("No album selected");
      return;
    }

    const songs = Array.isArray(currentAlbum.songs) ? currentAlbum.songs : [currentAlbum.songs];

    if (currentSongIndex === songs.length - 1) {
      window.alert("No next song available");
      return;
    }

    currentSongIndex++;
    playSong(songs[currentSongIndex]);
    showPausehidePlay();
  });

  // Volume control functionality
  document.querySelector(".volume-slider").addEventListener("change", (e) => {
    currentSong.volume = e.target.value / 100; // Set the volume of the current song
  });

  // Mute functionality
  document.querySelector(".volume-icon>img").addEventListener("click", () => {
    if (currentSong.muted) {
      currentSong.muted = false;
      document.querySelector(".volume-icon>img").src = "elements/volume.svg";
      document.querySelector(".volume-slider").value = 50;
    } else {
      currentSong.muted = true;
      document.querySelector(".volume-icon>img").src = "elements/mute.svg";
      document.querySelector(".volume-slider").value = 0;
    }
  });

  // Search functionality with debouncing
  let searchBox = document.querySelector(".src-input input");
  const debounceSearch = debounce(searchSongs, 500);
  searchBox.addEventListener("input", debounceSearch);
}

main();
