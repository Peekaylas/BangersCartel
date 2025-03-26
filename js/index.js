document.addEventListener('DOMContentLoaded', () => {
    const songForm = document.getElementById('song-form');
    const songList = document.getElementById('song-list');
    const playlistSection = document.querySelector('.playlist-section');
    const clientId = 'YOUR_CLIENT_ID';
    const redirectUri = 'http://localhost:3000';
    const playlistId = 'YOUR_PLAYLIST_ID';
    let accessToken;

    function getAccessToken() {
        const hash = window.location.hash.substring(1).split('&').reduce((initial, item) => {
            let parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
            return initial;
        }, {});
        window.location.hash = '';
        return hash.access_token;
    }
    function showLoading() {
        playlistSection.classList.add('loading');
    }

    function hideLoading() {
        playlistSection.classList.remove('loading');
    }
    async function getSongs() {
        showLoading();
        try {
            const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            if (!response.ok) throw new Error('Failed to fetch Bangers Cartel playlist');
            const data = await response.json();
            songList.innerHTML = '';
            data.items.forEach(item => {
                const song = item.track;
                const albumImage = song.album.images.length > 0 ? song.album.images[0].url : '';
                const li = document.createElement('li');
                li.innerHTML = `
                    <div>
                        ${albumImage ? `<img src="${albumImage}" alt="Album Art">` : ''}
                        ${song.name} by ${song.artists[0].name}
                    </div>
                    <button class="delete-btn" data-id="${song.id}" data-uri="${song.uri}">Delete</button>
                `;
                songList.appendChild(li);
            });
        } catch (error) {
            console.error('Error fetching songs for Bangers Cartel:', error);
            songList.innerHTML = '<li>Error loading your Cartel playlist. Please try again.</li>';
        } finally {
            hideLoading();
        }
    }
    songForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const artist = document.getElementById('artist').value;

        try {
            const searchResponse = await fetch(
                `https://api.spotify.com/v1/search?q=track:${title}+artist:${artist}+genre:afrobeat&type=track&limit=1`,
                { headers: { 'Authorization': `Bearer ${accessToken}` } }
            );
            if (!searchResponse.ok) throw new Error('Failed to search for banger');
            const searchData = await searchResponse.json();
            const trackUri = searchData.tracks.items[0]?.uri;

            if (trackUri) {
                const addResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    songList.appendChild(li);
            });
        } catch (error) {
            console.error('Error fetching songs for Bangers Cartel:', error);
            songList.innerHTML = '<li>Error loading your Cartel playlist. Please try again.</li>';
        } finally {
            hideLoading();
        }
    }
    songForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const artist = document.getElementById('artist').value;
        try {
            const searchResponse = await fetch(
                `https://api.spotify.com/v1/search?q=track:${title}+artist:${artist}+genre:afrobeat&type=track&limit=1`,
                { headers: { 'Authorization': `Bearer ${accessToken}` } }
            );
            if (!searchResponse.ok) throw new Error('Failed to search for banger');
            const searchData = await searchResponse.json();
            const trackUri = searchData.tracks.items[0]?.uri;

            if (trackUri) {
                const addResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ uris: [trackUri] })
                });
                if (!addResponse.ok) throw new Error('Failed to add banger to Cartel');
                songForm.reset();
                getSongs();
            } else {
                alert('Banger not found. Try a different title or artist.');
            }
        } catch (error) {
            console.error('Error adding banger to Bangers Cartel:', error);
            alert('Error adding banger to your Cartel playlist. Please try again.');
        }
    });
    songList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const trackUri = e.target.dataset.uri;
            try {
                const deleteResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        tracks: [{ uri: trackUri }]
                    })
                });
                if (!deleteResponse.ok) throw new Error('Failed to delete banger from Cartel');
                getSongs();
            } catch (error) {
                console.error('Error deleting banger from Bangers Cartel:', error);
                alert('Error deleting banger from your Cartel playlist. Please try again.');
            }
        }
    });