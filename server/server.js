import { handler } from './handler.js';
import polka from 'polka';
import serve from 'serve-static';

polka()
  .use(serve('./public'))
  .use(handler)
  .listen(3000, () => {
    console.log('server listening on port 3000');
  });