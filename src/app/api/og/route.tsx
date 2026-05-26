/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Dynamic params
    const title = searchParams.has('title')
      ? searchParams.get('title')?.slice(0, 100)
      : 'Anuvab Das | Full Stack Developer';
    const description = searchParams.has('desc')
      ? searchParams.get('desc')?.slice(0, 150)
      : 'Premium portfolio of a full stack developer specializing in React Native, Flutter, and Next.js';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#09090b',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #27272a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #27272a 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            padding: '80px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '60px',
              height: '60px',
              backgroundColor: '#10b981',
              borderRadius: '12px',
              marginBottom: '40px',
            }}
          >
            <span style={{ fontSize: '30px', color: '#000', fontWeight: 'bold' }}>&gt;_</span>
          </div>
          
          <h1
            style={{
              fontSize: '60px',
              fontWeight: 900,
              color: 'white',
              lineHeight: 1.1,
              marginBottom: '20px',
              maxWidth: '800px',
            }}
          >
            {title}
          </h1>
          
          <p
            style={{
              fontSize: '30px',
              color: '#a1a1aa',
              lineHeight: 1.4,
              maxWidth: '800px',
            }}
          >
            {description}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 'auto',
            }}
          >
            <div style={{ color: '#10b981', fontSize: '24px', fontWeight: 'bold', marginRight: '16px' }}>anv-os</div>
            <div style={{ color: '#71717a', fontSize: '24px' }}>v1.0.0</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
