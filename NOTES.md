# Getting Started With TypeScript Development Workshop

## Prerequisites
This is meant to be a hands-on workshop so we'll dive straight into building. The following knowledge is assumed:

 * Working knowledge of JavaScript
 * TypeScript basics. If you are completely new to TS, a little starter lesson like this will suffice: https://www.youtube.com/watch?v=fm2m0ddOAaU

 The following tools need to be installed if you want to follow along. This is totally optional of course, you can also just watch if you prefer.

 * **NodeJS** v12+.
 * **VS Code** You can use any IDE for the development but when we look at debugging, I'll show the setup for VS Code only.
 * **Serverless framework** (optional) You can install this globally if you wish but I'll be running it via `npx sls`.

 ## Part 1: Building a JS API with SLS

 We'll start by creating a small API using lambda.

  1. Create an empty workspace folder for our workshop
  2. In there, create a folder for the API: 
   ```
   mkdir api
   cd api
   ```
  3. Use serverless to create a minimal app:
  ```
  npx sls create --template aws-nodejs
  ```

  *Note: SLS has a NodeJS TypeScript template as well (`aws-nodejs-typescript`). While this template is great, we are not using it for this workshop because it is too complex and comes with too much out-of the box. We learn more when building from scratch.*

  4. Create a package file (say yes to all questions)
  ```
  npm init
  ```
  5. Install *SLS offline* to simulate a local api gateway
  ```
  npm i -D serverless serverless-offline
  ```
  6. Wire up the plugin
  ```
  // serverless.yml
  plugins:
  - serverless-offline

  // ...
  functions:
    hello:
      handler: handler.hello
      events:
        - http:
            path: hello
            method: get
            cors: true
  ```
  7. Add a start script
  ```
  // package.json
  {
    "scripts": {
      "start": "sls offline --httpPort 2500"
    }
  }
  ```
  8. Try it 🎉
  ```
  npm start
  ```

## Part 2: Convert the JS API to TypeScript

1. Install the SLS TypeScript Plugin
```
npm i -D @types/node typescript serverless-plugin-typescript
```
2. Wire it up
```
// serverless.yml
plugins:
  - serverless-plugin-typescript
  - serverless-offline
```
3. Rename the handler
```
mv handler.js handler.ts
```
4. Try it
```
npm start
```
5. Examine the build folder and then refine your TypeScript settings by creating a tsconfig.json
```
npx tsc --init
```
6. Adjust the compiler settings
*Note: Feel free to leave the comments in the file, they are a good documentation.*
```
// tsconfig.json
{
  "compilerOptions": {
    "target": "es2015",
    "module": "commonjs",
    "sourceMap": true,
    "outDir": "./.build",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}

```
7. Run again and note the difference in the compiled files
```
npm start
```

We now have a functioning TypeScript API.

## Part 3: Create a shared library
1. Create the scaffolding
```
cd ..
mkdir service
cd service
npm init
npx tsc --init
npm i -D typescript
```
2. Add the source code
```
// src/species.ts
export enum Species {
    Dog = 'dog',
    Cat = 'cat',
    Human = 'human'
}
```
```
// src/hello-service.ts
import { Species } from "./species";

export class HelloService {
  hello(name: string, species: Species): string {
    switch (species) {
      case Species.Cat:
        return `Meow, ${name}.`;
      case Species.Dog:
        return `Woof, ${name}`;
      case Species.Human:
        return `Hello? Yes, this is ${name}.`;
    }
  }
}
```
```
// src/index.ts
export * from "./hello-service";
export * from "./species";

```
3. Configure
```
// package.json
{
  // ...
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "scripts": {
    "build": "tsc --build tsconfig.json",
    "build:watch": "tsc --build tsconfig.json --watch"
  },
}
```
```
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./.lib",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```
4. Compile
```
npm run build
```

## Part 4: Reference and use the library in the API
1. Reference the library
```
// package.json
{
  "dependencies": {
    "service": "file:../service"
  },
}
```
```
npm install
```
2. Use the library
```
// handler.ts
import { HelloService, Species } from "service";

interface HelloRequest {
  queryStringParameters: { name: string; species: any };
}

module.exports.hello = async (request: HelloRequest) => {
  const svc = new HelloService();
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: svc.hello(
        request?.queryStringParameters?.name ?? "dog",
        request?.queryStringParameters?.species ?? Species.Human
      ),
    }),
  };
};
```
3. Test it
```
npm start
```
*Note: Try various query string parameters to get different greetings!*

4. Create a debug configuration and try debugging it.
```
// .vscode/launch.json (at the root, not in /api!)
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Hello Function",
      "cwd": "${workspaceFolder}/api/",
      "program": "${workspaceFolder}/api/node_modules/.bin/sls",
      "args": ["offline", "--httpPort", "2500"],
      "outFiles": [
        "${workspaceFolder}/api/.build/**/*.js",
        "${workspaceFolder}/service/**/*.js"
      ],
      "console": "integratedTerminal",
    }
  ]
}

```