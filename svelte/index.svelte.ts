import { mount } from 'svelte';
import App from './index.svelte';
import './jsApi.GEN.js';

const target = document.getElementById('app');
if (target) {
  target.innerHTML = '';
  mount(App, { target });
}
