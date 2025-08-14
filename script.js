//global variables
let recentsContainer = document.querySelector(".recently-played"); // Container to display songs in library
let currentSong;
let folderName;
let songs = [];

//Attach event listeners to play,pause,prev and next buttons
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

//fetches and returns all songs() from the directory
const fetchSongs = async (getFolder) => {
  let response = await fetch(
    `http://127.0.0.1:5501/spotifyCloneSongsDir/${getFolder}`
  );
  let data = await response.text();

  let div = document.createElement("div");
  div.innerHTML = data;
  filteredSongs = div.getElementsByTagName("li");

  let songs = [];
  for (ele of filteredSongs) {
    if (ele.innerText.includes(".mp3")) {
      songs.push(ele);
    }
  }
  return songs;
};

//displays all the albums
async function displayAlbums() {
  let response = await fetch(`http://127.0.0.1:5501/spotifyCloneSongsDir`);
  let data = await response.text();
  let div = document.createElement("div");
  div.innerHTML = data; //populates the div with the fetched data
  let anchors = div.getElementsByTagName("a"); //the reuired data is wrapped around anchors
  let cardContainer = document.querySelector(".card-collection");
  cardContainer.innerHTML = "";

  let array = Array.from(anchors);
  for (let i = 0; i < array.length; i++) {
    const anchor = array[i];
    if (anchor.href.includes("/spotifyCloneSongsDir/")) {
      let url = anchor.href; //extracts the url
      let parts = url.split("/");
      let folderName = parts[parts.length - 1]; //extracts the folder name from Url

      let response = await fetch(
        `http://127.0.0.1:5501/spotifyCloneSongsDir/${folderName}/info.json`
      );
      let data = await response.json();

      //populates the cardContainer with the fetched data
      cardContainer.innerHTML += `<div data-folder="${folderName}" class="card-container flex bg-grad-2 ">
                            <div class="card relative-pos">
                                <div class="song-cover-img relative-pos"><img src="/spotifyCloneSongsDir/${folderName}/cover.jpg" alt="">
                                </div>
                                <div class="play-btn absolute-pos"><img class="invert hover-pointer" src="elements/play.svg" alt="">
                                </div>
                            </div>
                            <p class="song-name">${data.title}</p>
                            <p class="artist-name">${data.description}</p>
                        </div>`;
    }
  }
  document.querySelectorAll(".card-container").forEach((e) => {
    e.addEventListener("click", async (event) => {
      folderName = event.currentTarget.dataset.folder;
      songs = await fetchSongs(folderName);
      displaySongs(songs);
      if (
        event.target.matches(".play-btn") ||
        event.target.matches(".play-btn img")
      ) {
        playSong(songs[0].querySelector("a").getAttribute("href"));
        showPausehidePlay();
      }
    });
  });
}

//displays the fetched songs in the library(recentsContainer)
async function displaySongs(songs) {
  recentsContainer.innerHTML = ""; // Clear previous content
  recentsContainer.innerHTML += `<ul class="song-list-recents flex"></ul>`; // Add a new ul element to hold the songs

  // Loop through the fetched songs and add them to the recentsContainer
  songs.forEach((song) => {
    let getTitle = song.querySelector("a").getAttribute("title");

    recentsContainer.firstChild.innerHTML += ` <div class="recents-song-container bg-grey-2 flex">
        <div class="cover-and-details-recents flex">
                     <img src="elements/cover.jpg" alt="" width="50px" style="border-radius: 5px;">
                      <span class="song-info-recents">
                      <p class="song-name-recents">${getTitle}</p>
                      </span>
                      </div>

                      <div class="play-btn-recents">
                      <img class="invert hover-pointer" src="elements/play.svg" alt="" width="20px">
                      </div>
        </div>`;
    //console.log(song.querySelector("a"));
  });
}

//plays song-argument needs to be the href of the song to be played
function playSong(song) {
  if (currentSong) {
    currentSong.pause(); // Pause the currently playing song if it exists
    currentSong.currentTime = 0; // Reset the current time to the beginning
  }

  currentSong = new Audio(song); // Create a new Audio object with the song URL
  currentSong.play(); // Play the song
  timeUpdate(currentSong); // Call the timeUpdate function to update the play bar

  document.querySelector(".playbar-song-name p").innerText = song.split("/")[3];
  /*
  var audio = new Audio(song);
  console.log(song);
  audio.play();

*/
}

// Converts seconds to a string in the format "MM:SS"
function secondsToMinutesSeconds(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const paddedSecs = secs < 10 ? "0" + secs : secs;
  return `${mins}:${paddedSecs}`;
}

//time update event listener to update the play bar
function timeUpdate(song) {
  song.addEventListener("timeupdate", () => {
    document.querySelector(
      ".current-time"
    ).innerText = `${secondsToMinutesSeconds(song.currentTime)}`;
    document.querySelector(
      ".total-time"
    ).innerText = `${secondsToMinutesSeconds(song.duration)}`;

    document.querySelector(".circle-seek").style = `left: ${
      (song.currentTime / song.duration) * 100
    }%`;
    document.querySelector(".seekbar").classList.remove("color-bar");
    document.querySelector(
      ".seekbar"
    ).style = `background: linear-gradient(to right, #1ED760 , #282828 ${
      (song.currentTime / song.duration) * 100
    }%)`;
  });
}

async function searchSongs(query) {
  //const songNameQuery = query.value.toLowerCase();
  let response = await fetch(`http://127.0.0.1:5500/spotifyCloneSongsDir`);
  let data = await response.text();
  let div = document.createElement("div");
  div.innerHTML = data; //populates the div with the fetched data
  let anchors = div.getElementsByTagName("a");
  let array = Array.from(anchors);

  let albumsArr = [];
  let filteredSongsArr = [];
  for (let i = 0; i < array.length; i++) {
    const anchor = array[i];
    if (anchor.href.includes("/spotifyCloneSongsDir/")) {
      let url = anchor.href; //extracts the url
      let parts = url.split("/");
      let folderName = parts[parts.length - 1];
      albumsArr.push(folderName);
    }
  }

  albumsArr.forEach(async (album) => {
    let fetchedSongs = await fetchSongs(album);
    fetchedSongs.forEach((song) => {
      let getTitle = song.querySelector("a").getAttribute("title");
      if (getTitle.toLowerCase().includes(query.target.value.toLowerCase())) {
        filteredSongsArr.push(song);
      }

      if (filteredSongsArr.length == 0) {
        recentsContainer.innerHTML = " "; // Clear previous content
        recentsContainer.innerHTML = `<h4>No results found with "${query.target.value}"</h4>`;
      } else {
        displaySongs(filteredSongsArr);

        recentsContainer.addEventListener("click", (event) => {
          if (
            event.target.matches(".play-btn-recents") ||
            event.target.matches(".play-btn-recents img")
          ) {
            //Get the song title of the clicked event
            const recentsSongContainer = event.target.closest(
              ".recents-song-container"
            );
            // Then find the <p> element with the title
            const songTitleElement =
              recentsSongContainer.querySelector(".song-name-recents");
            // Get the title text
            const songTitle = songTitleElement.innerText;
            console.log(event.target);
            //Checks which song is clicked by comparing the clicked event with all the songs in the playlist
            let getHref = (filteredSongsArr) => {
              for (song of filteredSongsArr) {
                if (
                  song.querySelector("a").getAttribute("title") === songTitle
                ) {
                  return song.querySelector("a").getAttribute("href");
                }
              }
            };
            //plays the song returend by the getHref function
            playSong(getHref(filteredSongsArr));
            showPausehidePlay(); // Show the pause button when a song is played
          }
        });
      }
    });
  });
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
//main function
async function main() {
  displayAlbums();

  recentsContainer.addEventListener("click", (event) => {
    if (
      event.target.matches(".play-btn-recents") ||
      event.target.matches(".play-btn-recents img")
    ) {
      //Get the song title of the clicked event
      const recentsSongContainer = event.target.closest(
        ".recents-song-container"
      );
      // Then find the <p> element with the title
      const songTitleElement =
        recentsSongContainer.querySelector(".song-name-recents");
      // Get the title text
      const songTitle = songTitleElement.innerText;

      //Checks which song is clicked by comparing the clicked event with all the songs in the playlist
      let getHref = (songs) => {
        for (song of songs) {
          if (song.querySelector("a").getAttribute("title") === songTitle) {
            return song.querySelector("a").getAttribute("href");
          }
        }
      };

      //plays the song returend by the getHref function
      playSong(getHref(songs));
      showPausehidePlay(); // Show the pause button when a song is played
    }
  });

  //play and pause button functionality
  playPauseBtn.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      showPausehidePlay();
    } else {
      currentSong.pause();
      showPlayhidePause();
    }
  });

  //event listener for seekbar to change the current time of the song
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle-seek").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //event listener for previous button
  document.querySelector(".prev-btn").addEventListener("click", () => {
    let hrefSplit = currentSong.src.split("/spotify");
    let relativeHref = "/spotify" + hrefSplit[1];

    let index;
    for (let i = 0; i < songs.length; i++) {
      if (songs[i].querySelector("a").getAttribute("href") === relativeHref) {
        index = i;
        break;
      }
    }

    if (index === undefined || index === 0) {
      window.alert("No previous song available");
    }
    playSong(songs[index - 1].querySelector("a").getAttribute("href"));
    showPausehidePlay(); // Show the pause button when a song is played
  });

  //event listener for next button
  document.querySelector(".next-btn").addEventListener("click", () => {
    let hrefSplit = currentSong.src.split("/spotify");
    let relativeHref = "/spotify" + hrefSplit[1];

    let index;
    for (let i = 0; i < songs.length; i++) {
      if (songs[i].querySelector("a").getAttribute("href") === relativeHref) {
        index = i;
        break;
      }
    }

    if (index === undefined || index === songs.length - 1) {
      window.alert("No next song available");
    }
    playSong(songs[index + 1].querySelector("a").getAttribute("href"));
    showPausehidePlay();
  });

  //volume control functionality
  document.querySelector(".volume-slider").addEventListener("change", (e) => {
    currentSong.volume = e.target.value / 100; // Set the volume of the current song
  });

  //mute functionality
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

  let searchBox = document.querySelector(".src-input input");

  const debounceSearch = debounce(searchSongs, 500);
  searchBox.addEventListener("input", debounceSearch);
}

main();
