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