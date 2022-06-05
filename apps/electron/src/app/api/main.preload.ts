const cookies = document.cookie.split(';');

for (const cookie of cookies) {
  if (cookie.startsWith('easybsb-jwt')) {
    const jwt = cookie.substring('easybsb-jwt='.length);
    window.sessionStorage.setItem('Authorization', jwt);

    // delete cookie
    document.cookie = 'easybsb-jwt=; Max-Age=0; path=/; domain=' + location.hostname;
    break;
  }
}
