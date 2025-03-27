const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const seekBar = document.getElementById('seekBar');
const fill = document.getElementById('fill');
const time = document.getElementById('time');
const albumArt = document.getElementById('albumArt');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const addSongForm = document.getElementById('addSongForm');
const songNameInput = document.getElementById('songName');
const songImageInput = document.getElementById('songImage');
const songLinkInput = document.getElementById('songLink');
const toggleThemeBtn = document.getElementById('toggleTheme');
const playlistContainer = document.getElementById('playlistContainer');
const clickSound = document.getElementById('clickSound');
const submitSound = document.getElementById('submitSound');

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
        updatePlaylistUI();
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

function playPause() {
    if (audio.paused) {
        audio.play();
        playBtn.textContent = "Pause";
        clickSound.play();
    } else {
        audio.pause();
        playBtn.textContent = "Play";
        clickSound.play();
    }
}

function updateSeekBar() {
    const percent = (audio.currentTime / audio.duration) * 100;
    fill.style.width = percent + '%';
    const current = formatTime(audio.currentTime);
    const total = formatTime(audio.duration);
    time.textContent = current + ' / ' + total;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' + secs : secs);
}

function updateSong() {
    playlist[currentSong].musicName = "Updated Song " + (currentSong + 1);
    loadSong(currentSong);
    updatePlaylistUI();
}

function addCustomSong(event) {
    event.preventDefault();
    const newSongName = songNameInput.value.trim();
    const newSongImage = songImageInput.value.trim();
    const newSongLink = songLinkInput.value.trim();
    if (newSongName && newSongImage && newSongLink) {
        playlist.push({
            "artist": "User Added",
            "musicName": newSongName,
            "audioSrc": newSongLink,
            "albumCover": newSongImage
        });
        songNameInput.value = '';
        songImageInput.value = '';
        songLinkInput.value = '';
        updatePlaylistUI();
        submitSound.play();
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    clickSound.play();
}

function updatePlaylistUI() {
    playlistContainer.innerHTML = '';
    for (let i = 0; i < playlist.length; i++) {
        const item = document.createElement('div');
        item.className = 'playlist-item';
        item.textContent = playlist[i].musicName + ' - ' + playlist[i].artist;
        item.onclick = function() {
            currentSong = i;
            loadSong(currentSong);
            playPause();
        };
        playlistContainer.appendChild(item);
    }
}

playBtn.addEventListener('click', playPause);
prevBtn.addEventListener('click', function() {
    currentSong = (currentSong - 1 + playlist.length) % playlist.length;
    updateSong();
    playPause();
    clickSound.play();
});
audio.addEventListener('timeupdate', updateSeekBar);
addSongForm.addEventListener('submit', addCustomSong);
toggleThemeBtn.addEventListener('click', toggleTheme);

fetchPlaylist();