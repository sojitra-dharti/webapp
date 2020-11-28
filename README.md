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
7. Password gets stored securely using BCrypt password hashing scheme with salt 

### Update user information
1. Update my account information. I should only be allowed to update following fields.
    First Name
    Last Name
    Password
2. Account_updated field for the user gets updated when user update is successful.
3. A user can only update their own account information.

### Get user information
1. User can get my account information. Response payload returns all fields for the user except for password.

### File attachment
1. User can add/delete file for the question as well as answers.
2. User who created question/answer should be able to create/delete attachment.
3. Attachment will be added in s3 bucket (created by terraform).
4. User can only add images in s3 bucket.
5. Bucket name is being passed using user data via terraform instance creation.

## Project Generation
This project was generated with node version greater than 12.0

## Github actions (Continuous Deployment Workflow)
1. GitHub Actions will trigger a new build on pull request merge.
2. GitHub Actions will run the build steps from GitHub Actions workflow (pull-request.yml).
3. Once pr is mergerd, Github actions will trigger push-request workflow. It will do the following steps.
    - Run unit tests.
    - Build artifacts if all tests are successful.
    - Zip artifacts and upload it to AWS S3 bucket dedicated for CodeDeploy.
    - Call AWS CodeDeploy to deploy the latest revision of your application to the EC2 instances.

## Github secrets
* Following 3 github secrets are required to deploy artifacts in s3 bucket. user should have all policies which are required to access s3 bucket.
1. `AWS_ACCESS_KEY_ID`
2. `AWS_SECRET_ACCESS_KEY`
3. `CODEDEPLOY_BUCKETNAME`



## Steps to launch back end
make sure to get into webappBackend directory.
Run `npm install`
Run `npm run start` to launch the back end.

## Step to run test cases
make sure to get into webappBackend directory.
Run `npm run test`

update demo8



