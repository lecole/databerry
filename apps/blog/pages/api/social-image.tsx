import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import React from 'react'; // Импортируйте React напрямую

import { api, apiHost, rootNotionPageId } from '@/lib/config';
import { NotionPageInfo } from '@/lib/types';

export const config = {
  runtime: 'experimental-edge',
};

export default async function OGImage(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageId = searchParams.get('id') || rootNotionPageId;
  if (!pageId) {
    return new Response('Invalid notion page id', { status: 400 });
  }

  const pageInfoRes = await fetch(`${apiHost}${api.getNotionPageInfo}`, {
    method: 'POST',
    body: JSON.stringify({ pageId }),
    headers: {
      'content-type': 'application/json',
    },
  });
  if (!pageInfoRes.ok) {
    return new Response(pageInfoRes.statusText, { status: pageInfoRes.status });
  }
  const pageInfo: NotionPageInfo = await pageInfoRes.json();

  // Удаляем загрузку шрифтов
  // Удаляем fonts из настроек

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#1F2027',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Arial, sans-serif', // Используем системный шрифт
          color: 'black',
        }}
      >
        {pageInfo.image && (
          <img
            src={pageInfo.image}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}

        <div
          style={{
            position: 'relative',
            width: 900,
            height: 465,
            display: 'flex',
            flexDirection: 'column',
            border: '16px solid rgba(0,0,0,0.3)',
            borderRadius: 8,
            zIndex: '1',
            backgroundColor: '#fff',
            padding: 24,
            alignItems: 'center',
            textAlign: 'center',
            justifyContent: 'center', // Добавляем для выравнивания
          }}
        >
          {pageInfo.detail && (
            <div style={{ fontSize: 32, opacity: 0.6 }}>
              {pageInfo.detail}
            </div>
          )}

          <div
            style={{
              fontSize: 70,
              fontWeight: 700,
            }}
          >
            {pageInfo.title}
          </div>

          {pageInfo.detail && (
            <div style={{ fontSize: 32, opacity: 0.6 }}>
              {pageInfo.detail}
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      // Удаляем fonts
    }
  );
}
