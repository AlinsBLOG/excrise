 /* jshint esversion: 6 */ 
 import fetch from '../../../config/fetch';
 
 export const base = (data) => fetch('/api/apply/handleApply', data , 'POST');