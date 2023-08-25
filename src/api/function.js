const { app, ipcMain, shell, clipboard, nativeImage } = require('electron');
const fs = require('fs');

app.whenReady().then(() => {
  const { net } = require('electron');

  // 获取base64的图片
  const getHasRefererImageBase64 = (url, referer = 'https://weibo.com/') => {
    return new Promise((resolve, reject) => {
      const request = net.request(url);
      request.setHeader('Referer', referer);
      request.on('response', response => {
        let chunks = [];
        response.on('data', chunk => {
          chunks.push(chunk);
        });
        response.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const base64 = buffer.toString('base64');
          resolve(base64);
        });
      });
      request.on('error', error => {
        reject(error);
      });
      request.end();
    });
  };
  ipcMain.handle('getHasRefererImageBase64', (event, url, referer) => {
    return getHasRefererImageBase64(url, referer);
  });

  // 获取文件
  const getLocalFileText = path => {
    return new Promise((resolve, reject) => {
      fs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
        console.log(err);
        console.log(data);
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  };
  ipcMain.handle('getLocalFileText', function (event, path) {
    return getLocalFileText(path);
  });

  // 使用电脑默认浏览器打开链接
  ipcMain.handle('openUrlInBrowser', (event, url) => {
    shell.openExternal(url);
  });

  ipcMain.handle('copy', (event, data) => {
    if (data.type == 'img') {
      let image = nativeImage.createFromDataURL(data.data);
      clipboard.writeImage(image);
    } else if (data.type == 'text') {
      clipboard.writeText(data.data);
    }
  });

  // 是否开机自启
  ipcMain.handle('bootSetting', async (event, isBoot) => {
    if(isBoot){
      //设置开机启动
      app.setLoginItemSettings({
        openAtLogin: true,
        openAsHidden: true,
      });
    }else{
      app.setLoginItemSettings({
        openAtLogin: false,
        openAsHidden: false
      });
    }
    //获取是否开机启动
    const { openAtLogin } = app.getLoginItemSettings();
    return openAtLogin;
  });

  ipcMain.handle('getBootSetting', async (event) => {
    //获取是否开机启动
    const { openAtLogin } = app.getLoginItemSettings();
    return openAtLogin;
  });

  // 判断版本号大小
  ipcMain.handle('judgmentVersion', async (event, v1, v2) => {
    console.log(v1)
    console.log(v2)
    if (v1 == v2) {
      return false;
    }

    const vs1 = v1.split('.').map((a) => parseInt(a));
    const vs2 = v2.split('.').map((a) => parseInt(a));

    const digit = Math.min(vs1.length, vs2.length);
    for (let i = 0; i < digit; i++) {
      if (vs1[i] > vs2[i]) {
        return true;
      } else if (vs1[i] < vs2[i]) {
        return false;
      }
    }

    if (digit == vs1.length) {
      return false;
    } else {
      return true;
    }
  });
});
