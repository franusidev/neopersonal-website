import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import pdf from 'astro-pdf';

export default defineConfig({
  integrations: [
    react(), 
    tailwind(), 
    mdx(), 
    pdf({
      baseOptions: {
        waitUntil: 'networkidle2',
        maxRetries: 2,
        pdf: {
          format: 'A4',
          printBackground: true,
          margin: {
            top: '10px',
            right: '10px', 
            bottom: '10px',
            left: '10px'
          }
        }
      },
      pages: {
        '/pdf/resume-en': 'resume-en.pdf',
        '/pdf/resume-es': 'resume-es.pdf'
      }
    })
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    },
    remarkPlugins: [],
    rehypePlugins: []
  }
});