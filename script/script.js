const audio = document.getElementById('audio');
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const albumArt = document.getElementById('albumArt');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const addSongForm = document.getElementById('addSongForm');
const deleteBtn = document.getElementById('deleteBtn');
const playlistContainer = document.getElementById('playlistContainer');

let playlist = [];
let currentSong = 0;
const defaultAudioSrc = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
const defaultAlbumCover = 'https://via.placeholder.com/150';

function fetchPlaylist() {
    console.log('API is unreachable. Using fallback data.');
    useFallbackData();
}

function useFallbackData() {
    playlist = [
        {
            id: 1,
            artist: "Sample Artist",
            musicName: "Sample Song",
            audioSrc: defaultAudioSrc,
            albumCover: defaultAlbumCover
        },
        {
            id: 2,
            artist: "Another Artist",
            musicName: "Another Song",
            audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            albumCover: defaultAlbumCover
        }
    ];
    if (playlist.length > 0) {
        loadSong(currentSong);
        updatePlaylistUI();
    }
}

function loadSong(index) {
    if (index < 0 || index >= playlist.length) {
        console.error('Invalid song index:', index);
        return;
    }
    const song = playlist[index];
    if (!song.audioSrc || !song.musicName || !song.artist || !song.albumCover) {
        console.error('Invalid song data:', song);
        return;
    }
    audio.src = song.audioSrc;
    songTitle.textContent = song.musicName;
    songArtist.textContent = song.artist;
    albumArt.style.backgroundImage = 'url(' + song.albumCover + ')';
    audio.load();
    console.log('Loaded song:', song);
}

function playSong() {
    if (!audio.src) {
        console.error('No audio source set.');
        return;
    }
    audio.play().catch(function(error) {
        console.error('Error playing audio:', error);
    });
}

function pauseSong() {
    audio.pause();
}

function addCustomSong(event) {
    event.preventDefault();
    const newSongName = document.getElementById('songName').value.trim();
    if (newSongName) {
        const newSong = {
            id: Date.now(),
            artist: 'User Added',
            musicName: newSongName,
            audioSrc: defaultAudioSrc,
            albumCover: defaultAlbumCover
        };
        playlist.push(newSong);
        document.getElementById('songName').value = '';
        updatePlaylistUI();
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
        updatePlaylistUI();
    }
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
            playSong();
        };
        playlistContainer.appendChild(item);
    }
}

playButton.addEventListener('click', playSong);
pauseButton.addEventListener('click', pauseSong);
addSongForm.addEventListener('submit', addCustomSong);

fetchPlaylist();