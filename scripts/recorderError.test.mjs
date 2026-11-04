// The error page hands the error it caught to the Contact Center session recorder (src/utils/static/recorderError.ts):
// once per error, as a window ErrorEvent, after the recorder bundle is on the page; never with a query string or an
// e-mail address in the message.
import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, mock, test } from 'node:test';

import { recorderErrorMessage, reportErrorToRecorder } from '../src/utils/static/recorderError.ts';

class FakeErrorEvent {
  constructor(type, init) {
    this.type = type;
    this.message = init?.message;
    this.error = init?.error;
  }
}

const boundaryError = (message, extra = {}) => {
  const error = Object.assign(new TypeError(message), extra);

  error.stack =
    'TypeError: whatever\n    at load (https://www.boat4you.com/_next/static/chunks/app/page-ab12.js:1:234)\n    at other (x.js:2:3)';

  return error;
};

describe('recorderErrorMessage', () => {
  test('name, message, digest and the first stack frame; query strings and e-mail addresses are dropped', () => {
    const error = boundaryError('fetch https://api.boat4you.com/x?email=ana@example.com failed for ana@example.com', {
      digest: '123',
    });

    assert.equal(
      recorderErrorMessage(error),
      'Error page: TypeError: fetch https://api.boat4you.com/x?… failed for [e-mail] · digest 123 · at load (https://www.boat4you.com/_next/static/chunks/app/page-ab12.js:1:234)'
    );
  });

  test("a Firefox/Safari frame, no digest, and Next's production boilerplate for a server error", () => {
    const error = Object.assign(
      new Error(
        'An error occurred in the Server Components render. The specific message is omitted in production builds.'
      ),
      {
        stack: 'Error: x\nrender@https://www.boat4you.com/_next/static/chunks/main.js:9:1',
        digest: '987654',
      }
    );

    assert.equal(
      recorderErrorMessage(error),
      'Error page: Error: Server Components render error (message omitted in production) · digest 987654 · render@https://www.boat4you.com/_next/static/chunks/main.js:9:1'
    );
  });

  test('a multi-line message is never mistaken for a frame; fragments with parameters and encoded e-mails go too', () => {
    const error = new Error('Invalid input\njohn.doe@gmail.com\nsee https://www.boat4you.com/a#access_token=X&b=1');

    error.stack = `Error: ${error.message}\n    at submit (https://www.boat4you.com/_next/static/chunks/form.js:1:2)`;
    assert.equal(
      recorderErrorMessage(error),
      'Error page: Error: Invalid input\n[e-mail]\nsee https://www.boat4you.com/a#… · at submit (https://www.boat4you.com/_next/static/chunks/form.js:1:2)'
    );
    assert.equal(
      recorderErrorMessage({ message: 'user john%40gmail.com, see #418' }),
      'Error page: Error: user [e-mail], see #418'
    );
    assert.equal(
      recorderErrorMessage({ message: 'x', stack: 'john.doe@gmail.com\nnothing else' }),
      'Error page: Error: x'
    );
  });

  test('a thrown string and an over-long message', () => {
    assert.equal(recorderErrorMessage('boom'), 'Error page: Error: boom');
    assert.equal(recorderErrorMessage({ message: 'x'.repeat(600) }).length, 450);
  });
});

describe('reportErrorToRecorder', () => {
  let events;

  beforeEach(() => {
    events = [];
    mock.timers.enable({ apis: ['setTimeout'] });
    global.ErrorEvent = FakeErrorEvent;
    global.window = { dispatchEvent: e => events.push(e) };
  });
  afterEach(() => {
    mock.timers.reset();
    delete global.window;
    delete global.ErrorEvent;
  });

  test('waits for the recorder bundle, then dispatches the error once as a window ErrorEvent', () => {
    const error = boundaryError('x is not a function', { digest: '42' });

    reportErrorToRecorder(error);
    mock.timers.tick(2500);
    assert.equal(events.length, 0);
    global.window.__b4yRec = {};
    mock.timers.tick(1000);
    assert.equal(events.length, 1);
    assert.equal(events[0].type, 'error');
    assert.equal(events[0].message, recorderErrorMessage(error));
    assert.equal(events[0].error.message, events[0].message);
    reportErrorToRecorder(error); // the boundary mounted again with the same error
    mock.timers.tick(120_000);
    assert.equal(events.length, 1);
  });

  test('gives up after a minute without the recorder (no consent, not in the recorded share)', () => {
    reportErrorToRecorder(boundaryError('late'));

    for (let i = 0; i < 61; i += 1) mock.timers.tick(1000); // a tick runs one timer level, the chain goes second by second

    global.window.__b4yRec = {};
    mock.timers.tick(5000);
    assert.equal(events.length, 0);
  });
});
