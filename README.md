# TICKETING APP

# Instructions
- run npm install for each service
- run skaffold dev to build and start Kuberneties deployments
- run command to create jwt secret:
## kubectl create secret generic jwt-secret --from-literal=jwt=blablabla

- run Jest tests by going to any service folder and running command: npm run test (check it in package.json)