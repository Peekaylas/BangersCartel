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