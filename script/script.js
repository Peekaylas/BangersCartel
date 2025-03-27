const audio = document.getElementById('audio');
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const albumArt = document.getElementById('albumArt');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const addSongForm = document.getElementById('addSongForm');
const deleteBtn = document.getElementById('deleteBtn');

let playlist = [];
let currentSong = 0;

function fetchPlaylist() {
    fetch('db.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors'
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        playlist = data;
        loadSong(currentSong);
    })
    .catch(function(error) {
        console.error(error);
    });
}

function loadSong(index) {
    const song = playlist[index];
    audio.src = song.audioSrc;
    songTitle.textContent = song.musicName;
    songArtist.textContent = song.artist;
    albumArt.style.backgroundImage = 'url(' + song.albumCover + ')';
    audio.load();
}

function playSong() {
    audio.play();
}

function pauseSong() {
    audio.pause();
}

function addCustomSong(event) {
    event.preventDefault();
    const newSongName = document.getElementById('songName').value.trim();
    const newSongImage = document.getElementById('songImage').value.trim();
    const newSongLink = document.getElementById('songLink').value.trim();
    if (newSongName && newSongImage && newSongLink) {
        playlist.push({
            "artist": "User Added",
            "musicName": newSongName,
            "audioSrc": newSongLink,
            "albumCover": newSongImage
        });
        document.getElementById('songName').value = '';
        document.getElementById('songImage').value = '';
        document.getElementById('songLink').value = '';
    }
}

function deleteLastSong() {
    if (playlist.length > 0) {
        playlist.pop();
        if (currentSong >= playlist.length) {
            currentSong = playlist.length - 1;
        }
        if (playlist.length > 0) {
            loadSong(currentSong);
        } else {
            audio.src = '';
            songTitle.textContent = '';
            songArtist.textContent = '';
            albumArt.style.backgroundImage = '';
        }
    }
}

playButton.addEventListener('click', playSong);
pauseButton.addEventListener('click', pauseSong);
addSongForm.addEventListener('submit', addCustomSong);

fetchPlaylist();