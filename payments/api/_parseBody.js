// ToyyibPay's webhook callback is sent as multipart/form-data — Vercel's Node
// runtime auto-parses JSON and urlencoded bodies into req.body, but leaves
// multipart entirely unparsed (req.body is undefined), so we need to read it
// ourselves. Falls back to whatever Vercel already parsed for other content
// types (e.g. urlencoded from local curl testing).
import Busboy from 'busboy';

export function parseFormFields(req) {
  const contentType = req.headers['content-type'] || '';
  if (!contentType.startsWith('multipart/form-data')) {
    return Promise.resolve(req.body || {});
  }
  return new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: req.headers });
    const fields = {};
    busboy.on('field', (name, value) => { fields[name] = value; });
    busboy.on('finish', () => resolve(fields));
    busboy.on('error', reject);
    req.pipe(busboy);
  });
}
