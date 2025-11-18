/**
 * DESIGN SYSTEM SHOWCASE
 * File demo để xem preview tất cả design tokens
 * Sử dụng cho testing và reference
 */

import React from 'react';
import { inlinePatterns } from '../styles/patterns';

const DesignSystemShowcase: React.FC = () => {
  return (
    <div style={{ 
      fontFamily: 'var(--font-body)', 
      padding: '2rem',
      backgroundColor: 'var(--color-bg-main)'
    }}>
      <div className="container">
        <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
          Tripook Design System
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '3rem' }}>
          Theme: Di sản và Lịch sử Việt Nam - Chuyên nghiệp, Thanh lịch, Hiện đại
        </p>

        {/* Color Palette */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '2rem' }}>
            1. Bảng Màu (Color Palette)
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {/* Primary Colors */}
            <ColorSwatch 
              color="var(--color-bg-main)" 
              name="Trắng Ngà / Kem nhạt"
              code="#FAF8F1"
            />
            <ColorSwatch 
              color="var(--color-primary)" 
              name="Xanh Chàm đậm"
              code="#2C3E50"
              light
            />
            <ColorSwatch 
              color="var(--color-cta)" 
              name="Đỏ Son"
              code="#D9411E"
              light
            />
            <ColorSwatch 
              color="var(--color-accent)" 
              name="Vàng Đồng"
              code="#B8860B"
              light
            />
            <ColorSwatch 
              color="var(--color-text)" 
              name="Xám Đen"
              code="#333333"
              light
            />
          </div>
        </section>

        {/* Typography */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '2rem' }}>
            2. Typography
          </h2>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontFamily: 'var(--font-body)' }}>
              Font Heading: Playfair Display (Serif)
            </h3>
            <div style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>
              <div style={{ fontSize: 'var(--font-size-h1)', marginBottom: '0.5rem' }}>H1 - Heading 1 (56px)</div>
              <div style={{ fontSize: 'var(--font-size-h2)', marginBottom: '0.5rem' }}>H2 - Heading 2 (40px)</div>
              <div style={{ fontSize: 'var(--font-size-h3)', marginBottom: '0.5rem' }}>H3 - Heading 3 (28px)</div>
              <div style={{ fontSize: 'var(--font-size-h4)', marginBottom: '0.5rem' }}>H4 - Heading 4 (24px)</div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontFamily: 'var(--font-body)' }}>
              Font Body: Be Vietnam Pro (Sans-serif)
            </h3>
            <p style={{ fontSize: 'var(--font-size-body)', marginBottom: '0.5rem' }}>
              Body Text - 16px - Nền tảng kết nối du khách với nhà cung cấp dịch vụ du lịch uy tín
            </p>
            <p style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-muted)' }}>
              Small Text - 14px - Văn bản phụ, captions, labels
            </p>
          </div>
        </section>

        {/* Buttons */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '2rem' }}>
            3. Buttons (CTA Elements)
          </h2>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button style={{
              padding: '1rem 2rem',
              backgroundColor: 'var(--color-cta)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-body)',
              fontWeight: 'var(--font-weight-semibold)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-cta)'
            }}>
              Primary CTA Button
            </button>

            <button style={{
              padding: '1rem 2rem',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-body)',
              fontWeight: 'var(--font-weight-semibold)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-md)'
            }}>
              Secondary Button
            </button>

            <button style={{
              padding: '1rem 2rem',
              backgroundColor: 'transparent',
              color: 'var(--color-accent)',
              border: '2px solid var(--color-accent)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-body)',
              fontWeight: 'var(--font-weight-semibold)',
              cursor: 'pointer'
            }}>
              Outline Button
            </button>
          </div>
        </section>

        {/* Heritage Patterns */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '2rem' }}>
            4. Họa Tiết Di Sản (Heritage Patterns)
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <PatternDemo 
              pattern={inlinePatterns.footer}
              name="Brocade Floral"
              usage="Footer background"
            />
            <PatternDemo 
              pattern={inlinePatterns.sectionDivider}
              name="Ceramic Wave"
              usage="Section dividers"
            />
            <PatternDemo 
              pattern={inlinePatterns.accentBorder}
              name="Border Accent"
              usage="Top/bottom borders"
            />
          </div>
        </section>

        {/* Card Example */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '2rem' }}>
            5. Card Components
          </h2>

          <div style={{
            backgroundColor: 'var(--color-bg-white)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            padding: '2rem',
            maxWidth: '400px'
          }}>
            <div style={{
              width: '100%',
              height: '200px',
              backgroundColor: 'var(--color-bg-light)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-muted)'
            }}>
              Image Placeholder
            </div>
            <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              Card Title
            </h4>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', fontSize: 'var(--font-size-small)' }}>
              Card description text goes here. This is a sample card component with the new design system.
            </p>
            <button style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'var(--color-cta)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-body)',
              fontWeight: 'var(--font-weight-semibold)',
              cursor: 'pointer'
            }}>
              Xem chi tiết
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

// Helper Components
const ColorSwatch: React.FC<{ color: string; name: string; code: string; light?: boolean }> = ({ 
  color, 
  name, 
  code, 
  light 
}) => (
  <div>
    <div style={{
      backgroundColor: color,
      height: '100px',
      borderRadius: 'var(--radius-md)',
      marginBottom: '0.5rem',
      border: '1px solid var(--color-border)'
    }} />
    <div style={{ fontSize: 'var(--font-size-small)' }}>
      <div style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: '0.25rem' }}>{name}</div>
      <div style={{ color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{code}</div>
    </div>
  </div>
);

const PatternDemo: React.FC<{ pattern: any; name: string; usage: string }> = ({ pattern, name, usage }) => (
  <div>
    <div style={{
      ...pattern,
      height: '100px',
      backgroundColor: 'var(--color-primary)',
      borderRadius: 'var(--radius-md)',
      marginBottom: '0.5rem',
      border: '1px solid var(--color-border)'
    }} />
    <div style={{ fontSize: 'var(--font-size-small)' }}>
      <div style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: '0.25rem' }}>{name}</div>
      <div style={{ color: 'var(--color-text-muted)' }}>{usage}</div>
    </div>
  </div>
);

export default DesignSystemShowcase;
