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
const apiKey = '2Y-PkH1D0n6R8i84';
const apiUrl = 'https://osdb.confidence.sh/api/songs';
const defaultAudioSrc = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
const defaultAlbumCover = 'https://via.placeholder.com/150';

function fetchPlaylist() {
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
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
        playlist = data.data.map(function(item) {
            return {
                id: item.id,
                artist: item.artist ? item.artist.name : 'Unknown Artist',
                musicName: item.name,
                audioSrc: defaultAudioSrc,
                albumCover: item.artist && item.artist.image ? item.artist.image : defaultAlbumCover
            };
        });
        if (playlist.length > 0) {
            loadSong(currentSong);
            updatePlaylistUI();
        } else {
            console.log('No songs found in API response. Using fallback data.');
            useFallbackData();
        }
    })
    .catch(function(error) {
        console.error('Error fetching songs:', error);
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
            audioSrc: defaultAudioSrc,
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
            name: newSongName,
            artist: { name: 'User Added' },
            audioSrc: defaultAudioSrc,
            albumCover: defaultAlbumCover
        };
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
            },
            mode: 'cors',
            body: JSON.stringify(newSong)
        })
        .then(function(response) {
            if (!response.ok) {
                throw new Error('POST request failed with status ' + response.status);
            }
            return response.json();
        })
        .then(function(data) {
            console.log('Added song:', data);
            playlist.push({
                id: data.id,
                artist: 'User Added',
                musicName: newSongName,
                audioSrc: defaultAudioSrc,
                albumCover: defaultAlbumCover
            });
            document.getElementById('songName').value = '';
            updatePlaylistUI();
        })
        .catch(function(error) {
            console.error('Error adding song:', error);
            playlist.push({
                id: Date.now(),
                artist: 'User Added',
                musicName: newSongName,
                audioSrc: defaultAudioSrc,
                albumCover: defaultAlbumCover
            });
            document.getElementById('songName').value = '';
            updatePlaylistUI();
        });
    }
}

function deleteLastSong() {
    if (playlist.length > 0) {
        const songToDelete = playlist[playlist.length - 1];
        fetch(apiUrl + '/' + songToDelete.id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
            },
            mode: 'cors'
        })
        .then(function(response) {
            if (!response.ok) {
                throw new Error('DELETE request failed with status ' + response.status);
            }
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
        })
        .catch(function(error) {
            console.error('Error deleting song:', error);
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
        });
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