// src/stores/index.js
import { writable } from 'svelte/store';

// You can set the initial value to null or any other appropriate default value
export const auth = writable(null);
