import path from 'path';
export default {
  uploadLocal(originalPath) {
    return `/uploads/${path.basename(originalPath)}`;
  }
};
