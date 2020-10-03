const authService = require('../services/auth');
const User = require('../models/user');

test('authUser', (done) => {
  const user = new User(0, 'app@app.com', 'app');

  authService.login(user, function(code, msg) {
    expect(code).toBe(200);

    done();
  });
});
