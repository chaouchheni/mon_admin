import { Amplify } from 'aws-amplify';
import { AwsConfig } from '../types';

const awsConfig: AwsConfig = {
  Auth: {
    region: process.env.REACT_APP_AWS_REGION || 'eu-west-3',
    userPoolId: process.env.REACT_APP_USER_POOL_ID!,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID!,
    mandatorySignIn: true,
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  },
  API: {
    endpoints: [
      {
        name: 'articlesAPI',
        endpoint: process.env.REACT_APP_API_GATEWAY_URL!,
        region: process.env.REACT_APP_AWS_REGION || 'eu-west-3'
      }
    ]
  }
};

const requiredEnvVars: Array<keyof NodeJS.ProcessEnv> = [
  'REACT_APP_USER_POOL_ID',
  'REACT_APP_USER_POOL_CLIENT_ID',
  'REACT_APP_API_GATEWAY_URL'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Variables d\'environnement manquantes:', missingEnvVars);
  throw new Error(`Variables d'environnement manquantes: ${missingEnvVars.join(', ')}`);
} else {
  console.log('✅ Configuration AWS chargée avec succès');
}

Amplify.configure(awsConfig);

export default awsConfig;
