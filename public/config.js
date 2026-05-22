let _CONFIG = {
    prefix: '/service/',
    bare: '/bare/',
    encodeUrl: Scramjet.codec.xor.encode,
    decodeUrl: Scramjet.codec.xor.decode,
    search: 'https://www.google.com/search?q=%s'
};

// Map it to self.__scramjet_config just in case the Service Worker looks for it there
self.__scramjet_config = _CONFIG;
