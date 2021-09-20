

### Local dev setup

1. Instal dependencies
   - `npm install -d`
2. run application locally
   - `npm run start:dev`
3. Test application
   - Now application can be accessed buy visiting a sample url `curl http://localhost:1337/employees/getEmployees`


### Add new api
sails automatically generates and registers models with basic CRUD operations if models are generated usign followign command:
>./node_modules/.bin/sails generate api employees

- Now Controller code can be added in `./node_modules/.bin/sails generate api employees`
  - sample function written to demonstrate database interaction although same behaviour automatically exposed on `http://localhost:1337/employees/getEmployees`
  - `rest` endpoints on each model are automatically exposed `https://sailsjs.com/documentation/reference/configuration/sails-config-blueprints#?routerelated-settings`
    - `id`, `createdAt`, `updatedAt`  fields are automatically created and updated on each model unless otherwise required
- Node Model code can be added in `./node_modules/.bin/sails generate api employees`

# Deploy to production:
 Application configured to deploy `develop` branch automatically everytime there is a push on gituhub

Application is accessible via `https://api.projectkelvin.io/uservotes/getTransactionPage?pageNumber=1`
