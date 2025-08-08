// src/react-app-env.d.ts
/// <reference types="react-scripts" />

// Déclarations de types pour les variables d'environnement
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PUBLIC_URL: string;
    REACT_APP_AWS_REGION: string;
    REACT_APP_USER_POOL_ID: string;
    REACT_APP_USER_POOL_CLIENT_ID: string;
    REACT_APP_API_GATEWAY_URL: string;
    REACT_APP_NODE_ENV?: string;
  }
}

// Déclarations pour les modules CSS
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

// Déclarations pour les assets
declare module '*.svg' {
  import * as React from 'react';
  
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
  
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
} 

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}