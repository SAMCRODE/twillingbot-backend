const handleService = require('../services/handle');

test('search handle', (done) => {
  handleService.searchHandle('@neymarjr', function(code, msg) {
    console.log(msg);
    expect(code).toBe(200);
    done();
  });
});
