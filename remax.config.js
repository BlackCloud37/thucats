module.exports = {
  configWebpack({ config }) {
    config.module
      .rule('shake')
      .test(/index.js$/)
      .use('string-replace-loader')
      .loader('string-replace-loader')
      .options({
        multiple: [
          'getWeRunData',
          'chooseInvoiceTitle',
          'chooseInvoice',
          'chooseLicensePlate',
          'openBluetoothAdapter',
          'createBLEPeripheralServer',
          'addPhoneContact',
          'addPhoneRepeatCalendar',
          'addPhoneCalender',
          'chooseAddress',
          'chooseLocatio',
          'getLocation',
          'onLocationChange'
        ]
          .map((search, index) => {
            const replace = `REPLACEMENT${index}`;
            return [
              {
                search,
                replace
              },
              {
                search: `wx.${search}`,
                replace
              }
            ];
          })
          .flat()
      })
      .end();
  }
};
