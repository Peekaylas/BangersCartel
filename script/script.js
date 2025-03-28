const audio = document.getElementById('audio');
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const prevButton = document.getElementById('prevBtn');
const albumArt = document.getElementById('albumArt');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const addSongForm = document.getElementById('addSongForm');
const deleteBtn = document.getElementById('deleteBtn');
const playlistContainer = document.getElementById('playlistContainer');

let playlist = [];
let currentSong = 0;
const apiUrl = 'https://musicbrainz.org/ws/2/recording?query=love&fmt=json';
const defaultAudioSources = [
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3'
];

const albumCovers = [
    'images/avenged_sevenfold.jpg',
    'images/chvrches.jpg',
    'images/coldplay.jpg',
    'images/eminem.jpg',
    'images/hollywood_undead.jpg',
    'images/odesza.jpg'
];

function fetchPlaylist() {
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'MusicPlayer/1.0'
        },
        mode: 'cors'
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('API request failed with status ' + response.status);
        }
        return response.json();
    })
    .then(function(data) {
        console.log('API Response:', data);
        if (data && data.recordings && Array.isArray(data.recordings)) {
            playlist = data.recordings.map(function(item, index) {
                return {
                    id: item.id,
                    artist: item['artist-credit'] && item['artist-credit'][0] && item['artist-credit'][0].name ? item['artist-credit'][0].name : 'Unknown Artist',
                    musicName: item.title,
                    audioSrc: defaultAudioSources[index % defaultAudioSources.length],
                    albumCover: albumCovers[index % albumCovers.length]
                };
            });
        } else {
            throw new Error('Invalid API response format');
        }
        if (playlist.length > 0) {
            loadSong(currentSong);
            updatePlaylistUI();
        } else {
            console.log('No songs found in API response. Using fallback data.');
            useFallbackData();
        }
    })
    .catch(function(error) {
        console.error('Error fetching songs:', error.message);
        console.log('Falling back to sample data.');
        useFallbackData();
    });
}

function useFallbackData() {
    playlist = [
        {
            id: 1,
            artist: "Sample Artist",
            musicName: "Sample Song",
            audioSrc: defaultAudioSources[0],
            albumCover: albumCovers[0]
        },
        {
            id: 2,
            artist: "Another Artist",
            musicName: "Another Song",
            audioSrc: defaultAudioSources[1],
            albumCover: albumCovers[1]
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
    albumArt.style.backgroundImage = `url(${song.albumCover})`;
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

function prevSong() {
    if (playlist.length === 0) return;
    currentSong = (currentSong - 1 + playlist.length) % playlist.length;
    loadSong(currentSong);
    playSong();
}

function addCustomSong(event) {
    event.preventDefault();
    const newSongName = document.getElementById('songName').value.trim();
    if (newSongName) {
        const newSong = {
            id: Date.now(),
            artist: 'User Added',
            musicName: newSongName,
            audioSrc: defaultAudioSources[playlist.length % defaultAudioSources.length],
            albumCover: albumCovers[playlist.length % albumCovers.length]
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
            playSong();
        } else {
            audio.src = '';
            songTitle.textContent = 'No Songs';
            songArtist.textContent = '';
            albumArt.style.backgroundImage = '';
            audio.pause();
        }
        updatePlaylistUI();
    }
}

function updatePlaylistUI() {
    playlistContainer.innerHTML = '';
    for (let i = 0; i < playlist.length; i++) {
        const item = document.createElement('div');
        item.className = 'playlist-item';
        item.textContent = `${playlist[i].musicName} - ${playlist[i].artist}`;
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
prevButton.addEventListener('click', prevSong);
addSongForm.addEventListener('submit', addCustomSong);
deleteBtn.addEventListener('click', deleteLastSong);

fetchPlaylist();