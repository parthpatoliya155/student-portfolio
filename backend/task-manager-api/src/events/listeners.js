/*
  listeners.js
  Asynchronous Event Listeners
  Author: Parth Patoliya | Practical: Asynchronous Processing with Event-Driven Architecture

  Registers listeners on the shared EventEmitter.
  Uses setImmediate() inside the handler to schedule the notification work
  asynchronously, proving that the API response is sent BEFORE this code runs.
*/

const taskEmitter = require('./event');

// ─── Listener: task-created ───────────────────────────────────────────────────
// Fired whenever a new task is created via POST /tasks.
// The handler is wrapped in setImmediate() so it executes in the next iteration
// of the event loop, AFTER the HTTP response has already been sent to the client.

taskEmitter.on('task-created', (taskData) => {
    // Schedule the notification processing asynchronously
    setImmediate(() => {
        const handlerTimestamp = new Date().toISOString();

        console.log('\n══════════════════════════════════════════════════════════');
        console.log('📬  BACKGROUND NOTIFICATION — task-created event');
        console.log('══════════════════════════════════════════════════════════');
        console.log(`   Task Title      : ${taskData.title}`);
        console.log(`   Assigned User   : ${taskData.assignedUser}`);
        console.log(`   Task ID         : ${taskData.taskId}`);
        console.log(`   Priority        : ${taskData.priority}`);
        console.log('──────────────────────────────────────────────────────────');
        console.log(`   🕐 API Response Sent At   : ${taskData.apiResponseTimestamp}`);
        console.log(`   🕐 Handler Executed At    : ${handlerTimestamp}`);
        console.log('══════════════════════════════════════════════════════════');
        console.log('✅  Notification processed asynchronously (after API response)\n');
    });
});

console.log('🔔 Event listeners registered: [task-created]');
