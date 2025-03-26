const track = document.getElementById('track');
const playPauseBtn = document.getElementById('play-pause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const songs = [
    {
        title: "Sicko Mode",
        artist: "Travis Scott",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Working test link
    },
    {
        title: "Mask Off",
        artist: "Future",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" // Working test link
    },
    {
        title: "Bank Account",
        artist: "21 Savage",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" // Working test link
    },
    {
        title: "Hot",
        artist: "Young Thug",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" // Working test link
    }
];

let currentSong = 0;

function loadSong(index) {
    const song = songs[index];
    track.src = song.src;
    document.querySelector('.controller .bold.text_md').textContent = song.title;
    document.querySelector('.controller .text_sm').textContent = song.artist;
    playPauseBtn.className = "play";
}

function playPause() {
    if (track.paused) {
        track.play();
        playPauseBtn.className = "pause";
    } else {
        track.pause();
        playPauseBtn.className = "play";
    }
}

function playNext() {
    currentSong = (currentSong + 1) % songs.length;
    loadSong(currentSong);
    track.play();
    playPauseBtn.className = "pause";
}

function playPrevious() {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    loadSong(currentSong);
    track.play();
    playPauseBtn.className = "pause";
}

playPauseBtn.addEventListener("click", playPause);
nextBtn.addEventListener("click", playNext);
prevBtn.addEventListener("click", playPrevious);

track.addEventListener("ended", playNext);

loadSong(currentSong);