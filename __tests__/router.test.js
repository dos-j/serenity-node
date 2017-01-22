import router from '../src/router';


describe('router', () => {
  const di = {
    fetch: (...args) => {}
  };

  const express = {
    get: (...args) => {},
    post: (...args) => {} 
  }

  it('should register each route with express', () => {
    spyOn(express, 'get');
    spyOn(express, 'post');

    router(di, express, {
      'GET /hello': 'handler.hello',
      'POST /something': 'handler.create-something'
    });

    expect(express.get.calls.argsFor(0)[0]).toBe('/hello');
    expect(express.post.calls.argsFor(0)[0]).toBe('/something');
  
  });

});
