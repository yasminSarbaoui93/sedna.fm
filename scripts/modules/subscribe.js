// Subscribe module for Sedna FM
// Handles inline email subscription via Azure Function + Cosmos DB

import { API_BASE } from './apiConfig.js';

const SUBSCRIBE_URL = `${API_BASE}/api/subscribe`;

/**
 * Submit email subscription to the API
 * @param {string} email
 * @returns {Promise<{message: string, status: string}>}
 */
async function submitSubscription(email) {
  const response = await fetch(SUBSCRIBE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  
  const data = await response.json();
  
  if (!response.ok && response.status !== 200) {
    throw new Error(data.error || 'Something went wrong');
  }
  
  return data;
}

/**
 * Wire up a subscribe form (email input + button + message)
 * @param {string} formId - ID of the form container
 */
function initSubscribeForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const input = form.querySelector('.subscribe-input');
  const button = form.querySelector('.subscribe-submit');
  const message = form.querySelector('.subscribe-message');

  if (!input || !button || !message) return;

  async function handleSubmit(e) {
    e.preventDefault();
    const email = input.value.trim();
    
    if (!email) {
      message.textContent = 'Please enter your email';
      message.className = 'subscribe-message error';
      return;
    }

    // Disable while submitting
    button.disabled = true;
    button.textContent = 'Sending...';
    message.textContent = '';
    message.className = 'subscribe-message';

    try {
      const result = await submitSubscription(email);
      message.textContent = result.message;
      message.className = 'subscribe-message success';
      
      if (result.status === 'created') {
        input.value = '';
        input.placeholder = 'You\'re in! 🛸';
      }
    } catch (err) {
      message.textContent = err.message;
      message.className = 'subscribe-message error';
    } finally {
      button.disabled = false;
      button.textContent = 'Subscribe';
    }
  }

  button.addEventListener('click', handleSubmit);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSubmit(e);
  });
}

/**
 * Initialize all subscribe forms on the page
 */
export function initSubscribe() {
  initSubscribeForm('subscribe-form-nav');
  initSubscribeForm('subscribe-form-banner');
}
