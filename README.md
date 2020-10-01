## Web app description

### Create a new user
1. create an account by providing following information.
    Email Address
    Password
    First Name
    Last Name
2. account_created field for the user be set to current time when user creation is successful.
3. User should not be able to set values for account_created and account_updated. Any value provided   for these fields gets ignored.
4. Password field never returns in the response payload.
5. Application enforces strong password as recommended by NIST.
6. Returns 400 Bad Request HTTP response code when a user account with the email address already exists.
7. Password gets stored securely using BCrypt password hashing schemewith salt 

### Update user information
1. Update my account information. I should only be allowed to update following fields.
    First Name
    Last Name
    Password
2. Account_updated field for the user gets updated when user update is successful.
3. A user can only update their own account information.

### Get user information
1. User can get my account information. Response payload returns all fields for the user except for password.

## Project Generation
This project was generated with node version greater than 12.0

## Step to launch back end
make sure to get into webappBackend directory.
Run `npm install`
Run `npm run start` to launch the back end.

## Step to run test cases
make sure to get into webappBackend directory.
Run `npm run test`

## References
https://bezkoder.com/node-js-express-sequelize-mysql/

https://docs.github.com/en/free-pro-team@latest/actions/quickstart

https://medium.com/@svsh227/write-your-first-test-case-in-your-node-app-using-mocha-5250e614feb3

https://scotch.io/tutorials/nodejs-tests-mocking-http-requests

