const User = require('../models/user');
const userService = require('../services/user');

test('createUserAndDeleteUser', async () => {
  const userTest = new User(0, 'user@user.com', '123456');

  try {
    const a = await User.save(userTest);

    await User.delete(a.res.id);
  } catch (e) {
    expect(e).toBe(null);
  }
});

test('findUserByEmail', async () => {
  const email = 'app@app.com';

  try {
    const res = await User.selectWhereEmail(email);

    expect(res.res.email).toBe(email);
  } catch (e) {
    expect(e).toBe(null);
  }
});

// Services tests
test('createUserFromService', (done) => {
  const userTest = new User(0, 'user@user.com', '123456');

  userService.register(userTest, function(code, msg) {
    expect(code).toBe(200);

    User.delete(msg.id);

    done();
  });
});
