/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const tcb = require('@cloudbase/node-sdk');
const { exit } = require('process');

const app = tcb.init({
  secretId: process.env.TCB_API_KEY_ID,
  secretKey: process.env.TCB_API_KEY
});

const db = app.database();
const _ = db.command;

db.collection('tcb-ext-cms-schemas')
  .where(
    _.and([
      {
        collectionName: _.neq('tcb-ext-cms-sms-activities')
      },
      {
        collectionName: _.neq('tcb-ext-cms-sms-tasks')
      }
    ])
  )
  .get()
  .then(({ data }) => {
    const dir = path.resolve(
      __dirname,
      '../extensions/cloudbase-extension-cms/packages/cms-init/scripts'
    );
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.resolve(dir, 'schemas.json'), JSON.stringify(data));
    exit(0);
  })
  .catch((e) => {
    console.error(e);
    exit(1);
  });
