/*
  event.js
  EventEmitter Configuration
  Author: Parth Patoliya | Practical: Asynchronous Processing with Event-Driven Architecture

  Creates and exports a single shared EventEmitter instance.
  All parts of the application import this same emitter so that
  events emitted in one module are received by listeners in another.
*/

const { EventEmitter } = require('events');

// Create a single, shared EventEmitter instance for the entire application
const taskEmitter = new EventEmitter();

module.exports = taskEmitter;
