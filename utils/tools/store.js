let config = require('../config/config.js');

let db_prefix = config.db_prefix;


class Store {

  constructor() {

    this.prefix = db_prefix;

    this.staticName = {
      USER_TOKEN: "user_token"
    }
  }

  set(key, value) {
    wx.setStorageSync(this.prefix + key, value);

    my.setStorage({
      key: this.prefix + key,
      data: value
    });
  }

  get(key) {
    my.getStorage({
      key: this.prefix + key,
      success: function(res) {
        return res.data;
      },
      fail: function(res) {
        // my.showToast({
        //   content: res.errorMessage,
        //   duration: 1000,
        // });
      }
    });
  }

  remove(key) {
    wx.removeStorageSync(this.prefix + key);
    //this.store.removeItem(this.prefix + key);
    my.removeStorage({
      key: this.prefix + key, // 缓存数据的key
    });
  }
}

export let myStore = new Store();
