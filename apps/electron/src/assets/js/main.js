const form = document.querySelector('.login-form');
const errorContainer = form.querySelector('.error');
const versionContainer = document.querySelector('main .version');
const closeBtn = document.querySelector('[data-easybsb-action="close-application"]')

// LOGIN
function login(event) {
  event.preventDefault();
  event.stopPropagation();

  const userCtrl = form.querySelector('#username');
  const passwordCtrl = form.querySelector('#password');

  if (userCtrl.value.trim() === '' || passwordCtrl.value.trim() === '') {
    showError('username and password are required');
    return;
  }

  window.easybsb.login(userCtrl.value, passwordCtrl.value)
    .then((response) => JSON.parse(response))
    .then((response) => {
      if (response.success === false) {
        showError(response.message);
        return;
      }
    })
    .catch((error) => this.showError(error));
}

function showError(error) {
  errorContainer.textContent = error;
}

form.addEventListener('submit', login);

// CLOSE APP
closeBtn.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  window.easybsb.close();
});

// VERSION
window.easybsb.getAppVersion().then((version) => {
  versionContainer.textContent = `Version:` + version;
});
