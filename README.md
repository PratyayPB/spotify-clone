# Spotify Clone

**A frontend clone of the popular music streaming platform, Spotify.**

[Live Demo](http://spotify-clone-self-seven.vercel.app/) · [Report an Issue](https://github.com/PratyayPB/spotify-clone/issues)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Screenshots / Demo](#screenshots--demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)
- [Acknowledgements](#acknowledgements)

---

## Overview

### What is the project?

This project is a static frontend UI clone of Spotify. The primary goal of building this application was to practice and master **DOM Manipulation** and **UI Cloning** using core web technologies without relying on heavy frontend frameworks.

It successfully mimics the layout and aesthetic of the Spotify Web Player, complete with a working music player that fetches track data dynamically from a local JSON file.

### Project Goals

- Recreate the Spotify web interface with high fidelity.
- Gain hands-on experience with advanced vanilla JavaScript and DOM Manipulation.
- Implement custom audio controls (play/pause, progress bar, volume).
- Practice fetching and handling asynchronous data (JSON).

---

## Key Features

- **Music Player Controls:** Play, pause, skip to next, and return to the previous track.
- **Progress Tracking:** A functional seekbar to view current track time and skip to different parts of a song.
- **Volume Control:** Adjust the volume via a slider or click the volume icon to mute/unmute.
- **Dynamic Content Loading:** Albums and songs are dynamically loaded and rendered using the Fetch API from a static JSON file.
- **Search Functionality:** Search for specific songs across all available albums, implemented with a custom debounce function for optimized performance.
- **Responsive UI:** A dark-themed layout that closely resembles the authentic Spotify experience.

---

## Screenshots / Demo

### Application Preview

![Spotify Clone Dashboard](https://ik.imagekit.io/ulycoljug/Portfolio-resources/Spotify-clone/Screenshot%202026-02-03%20214705.png)
![Spotify Clone Player](https://ik.imagekit.io/ulycoljug/Portfolio-resources/Spotify-clone/Screenshot%202026-02-03%20214721.png)

### Demo

**Live Application:** [http://spotify-clone-self-seven.vercel.app/](http://spotify-clone-self-seven.vercel.app/)

---

## Tech Stack

### Frontend

- **HTML5:** Semantic markup and structure
- **CSS3:** Custom styling, Flexbox/Grid layouts, and CSS variables
- **Vanilla JavaScript:** DOM manipulation, Event handling, and Audio API integration
- **Fetch API:** Asynchronous data fetching

---

## Getting Started

### Prerequisites

You only need a modern web browser to view this project. If you wish to run it locally and modify the code, a local server environment (like VS Code's Live Server extension) is recommended to prevent CORS issues when fetching the JSON data.

### Clone the Repository

```bash
git clone https://github.com/PratyayPB/spotify-clone.git
cd spotify-clone
```

### Run the Development Server

If you are using VS Code, you can install the **Live Server** extension.

1. Open the project folder in VS Code.
2. Right-click on `index.html` and select **"Open with Live Server"**.

Alternatively, you can use Node.js `http-server` or Python's built-in HTTP server:

```bash
# Using Python 3
python -m http.server 3000
```

Then, open your browser and navigate to:

```text
http://localhost:3000
```

---

## Usage

1. **Browse Albums:** Click on any album card on the main dashboard to load its tracks into the library view on the left.
2. **Play Music:** Click the play button on an album cover or next to a specific song in the library.
3. **Control Playback:** Use the bottom playbar to pause, play, skip, or change the volume.
4. **Search:** Use the search bar at the top to find specific songs (results update as you type).

---

## Contributing

Contributions are welcome! If you'd like to improve the UI or add new features, feel free to fork the repository and submit a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Author

**Pratyay Pratim Borah**

- GitHub: [@PratyayPB](https://github.com/PratyayPB)
- LinkedIn: [Pratyay Pratim Borah](https://www.linkedin.com/in/pratyaypratimborah/)
- Portfolio: [https://portfolio-pratyay.vercel.app/](https://portfolio-pratyay.vercel.app/)

---

## Acknowledgements

- **[Google Fonts](https://fonts.google.com/):** Used for typography (Noto Sans, Oswald, Roboto, Roboto Condensed).
- **[Spotify](https://open.spotify.com/):** For the original UI design inspiration.

---
📄 License
This project is for educational purposes only and is not affiliated with Spotify.


