class Storage {
    static getStorage(key) {
        // поиск ключа
        return localStorage.getItem(key);
    }

    static setStorage(key, data) {
        // Добавить ключ и значение
        localStorage.setItem(key, data);
        return localStorage.getItem(key);
    }

    static removeStorage(key) {
        // удалить ключ
        delete localStorage[key];
    }
}

export default Storage;
