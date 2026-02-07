// API Configuration - auto-detects environment based on hostname
// Production: sedna.fm → production Function App
// Development: localhost / anything else → dev Function App

const API_BASE_URLS = {
  production: 'https://sedna-website-func-ch.azurewebsites.net',
  development: 'https://sedna-website-func-dev-ch.azurewebsites.net'
};

function getEnvironment() {
  const hostname = window.location.hostname;
  if (hostname === 'sedna.fm' || hostname === 'www.sedna.fm') {
    return 'production';
  }
  return 'development';
}

const ENV = getEnvironment();
const API_BASE = API_BASE_URLS[ENV];

export { API_BASE, ENV };
