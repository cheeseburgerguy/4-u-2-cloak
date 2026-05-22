// 1. Create the _CONFIG object your repository expects
let _CONFIG = {
    prefix: '/service/',
    bare: '/bare/',
    encodeUrl: typeof Scramjet !== 'undefined' ? Scramjet.codec.xor.encode : (url) => url,
    decodeUrl: typeof Scramjet !== 'undefined' ? Scramjet.codec.xor.decode : (url) => url,
    search: 'https://www.google.com/search?q=%s'
};

// 2. Attach it to the global window/self context under BOTH names
self._CONFIG = _CONFIG;
self.__scramjet_config = _CONFIG;

// 3. Fallback check for Node.js backend environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = _CONFIG;
}
