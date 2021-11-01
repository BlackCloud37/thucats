import { usePageEvent } from '@remax/framework-shared';
import { WebView } from '@remax/wechat';
import * as React from 'react';

export interface WebViewPayload {
  link: string;
}

const WebViewPage = () => {
  const [url, setUrl] = React.useState('');
  usePageEvent('onLoad', ({ payload }) => {
    const { link } = JSON.parse(payload) as WebViewPayload;
    console.log('link is ', link);
    setUrl(link);
  });

  return <WebView src={url} />;
};

export default WebViewPage;
