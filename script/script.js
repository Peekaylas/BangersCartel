const audio = document.getElementById('audio');
const playButton = document.getElementById('playButton');
const prevBtn = document.getElementById('prevBtn');
const albumArt = document.getElementById('albumArt');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const addSongForm = document.getElementById('addSongForm');

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

function updateSong() {
    playlist[currentSong].musicName = "Updated Song " + (currentSong + 1);
    loadSong(currentSong);
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

playButton.addEventListener('click', playSong);
prevBtn.addEventListener('click', function() {
    currentSong = (currentSong - 1 + playlist.length) % playlist.length;
    updateSong();
    playSong();
});
addSongForm.addEventListener('submit', addCustomSong);

fetchPlaylist();