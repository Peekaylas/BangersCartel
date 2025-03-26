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
        playlist.push({
            "artist": "Test Artist",
            "musicName": "Test Song",
            "audioSrc": "test_song.mp3",
            "albumCover": "images/albums/test.jpg"
        });
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
    } else {
        audio.pause();
        playBtn.textContent = "Play";
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
}

playBtn.addEventListener('click', playPause);
nextBtn.addEventListener('click', function() {
    currentSong = (currentSong + 1) % playlist.length;
    updateSong();
    playPause();
});
audio.addEventListener('timeupdate', updateSeekBar);

fetchPlaylist();