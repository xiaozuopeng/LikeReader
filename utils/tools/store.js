let config = require('../request/config.js');

let db_prefix = config.db_prefix;


class Store {

  constructor() {

    this.prefix = db_prefix;

    this.staticName = {
      USER_TOKEN: "user_token"
    }
  }

  set(key, value) {
    my.setStorageSync({
      key: this.prefix + key,
      data: value
    });
  }

  get(key) {
    return my.getStorageSync({key: this.prefix + key}).data;
  }

  remove(key) {
    my.removeStorageSync({
      key: this.prefix + key, // 缓存数据的key
    });
  }
}

export default new Store();
