
## Byron Morley Test Notes

### Setup

I started by adding a basic test route to smoke test and make sure the setup was working when I ran npm run dev. 

### Database

I then moved on to the sqlite database setup, making sure the db can be recreated locally and that the columns follow the constraints given. I added a health check endpoint so I could test that the database is set up and running.

### Routing

Next I moved on to routing, I was tempted to include both in the users route but chose to separate them into user and auth (authentication for short). I made this decision for scalability as I know the user model and controller can usually be some of the largest and there is a separation of concern and functionality to the authentication. Other features will include password management, session handling, login/logout and potentially authentication middleware support (like JWT or SSO). So I think it’s a good idea to keep them separated.

### Validation

In addition to this I added the validation to the route using “express-validator” it simply gate keeps the route by checking the request body against a series of rules. I moved this to its own folder as it’s likely an application like this would expand so I have left room for this. We will deal with the validation later in the logic

### Repository

When it comes to the ORM layer I worked out I will need exactly 3 functions to query the database with. I prefer to avoid writing comments inside of functions unless its really necessary. I believe in these cases the functions read well semantically and the doc comments aid the reader if they are unclear on their functionality. As repository functions I would expect these to contain no logic and simply parse data to queries and return the requested Object/value or to throw an error. Maintaining this consistency will help write better controller functions and make it easier to trace problems and debug.

One crucial decision I made early on which you can see implemented here is that the createDate is being initialised in the createUser function instead of being passed through the endpoint. The reason I made this decision is that you should only allow information that you want the frontend to control to be passed to an endpoint. The created date for a user should be guarded by the backend and so it can be input correctly when the record is created. Leaving the endpoint open to choose its own record creation date is a security risk for anyone who wants to make their account look older than it is, it's simply safer to maintain control over this and omit it from the endpoint.

We use uuid to create the id, this is done due to  a security concern. If you were to use ascending record numbers a malicious actor could just guess the next value in the sequence and potentially get hold of sensitive information. By using uuid we remove that possibility making the account more secure.

### Testing

Now I have my first bit of logic in the application. I turn my attention to testing. I decided not to go with TDD and the reason for that has to do with speed and complexity. I believe TDD is much more effective at helping build on functions with complex logic than it is with simple parse and fetch functions. With the introduction of the latest AI tools boilerplating tests has become a lot easier and lends itself to writing simple tests quickly, but I wouldn't trust the AI with anything more complex than this as I feel it needs the intervention of a good programmer to manage effectively.

For the tests I mocked the DB, created a fixture for mocking users which could be added to and used in other tests later. Each function only had 2 potential states so I have written a test for each outcome to make sure they are doing what they are supposed to.

### Controllers

Initially I had the logic in the routes as a placeholder so I refactored and moved the createNew User and getUserById to its own controller. We now have a very clear separation of routing, logic and database which should be easy to navigate from the folder structure.

#### CreateNewUser

Firstly we pull the validation result in and return an array of errors if something isn't right. I would expect that the frontend has done their checking before submission but if there is a difference in the validation schemas this will list out which rules have been violated and this information could be used to generate a readable response to the user, or just assist with integration testing when pairing it with the frontend.

Secondly we check whether the user exists, in this case we don’t have an id which is why we created the findUserByEmail function earlier.
If the user already exists we return a 500 and a non descript explanation. The reason for this is that we do not want to give out information about our users. If we were to return “user already exists” then a malicious actor would be able to discern from a large list of emails who has an account with us and potentially use that information to gain access to it.

Thirdly we add some randomisation to our hashing with some salt and use “bcrypt” to hash a password, because backend security rule number 1 and 2 and 3 of user management, never store a password as plain text.

Lastly, we create the user and return the User with the password removed, for security reasons.

### FindUserById

This controller function is relatively simple, we check the ID is present in the params and return a 400 if not found. We search for the User and return a 404 if not found, we arent as bothered about returning a 404 here as mentioned above the user id is created with a uuid and isn't likely to be guessed so the risk is already mitigated.


### Controller Testing

I feel that the coverage for the controller should focus on the potential outcomes. I decided to only include one test for the validation and made sure it was for the email, the reason for this is that validation will change over time and we do not want to re-write tests every time there is a modification to it, we also tend to trust external libraries especially if they are well known. I looked up the github for express-validator and checked that they have valid test coverage. The remaining tests look at mocking and producing each return result.

### End-to-End Testing

Throughout development and once complete I used various tools to test my work. Some of them are external libraries and others are internal tools to the WebStorm IDE, such as http files and the database connection tools, where i can inspect the records in the database manually.

#### HTTP

In the http folder you find a file with the extension .http. This is a built in API platform that allows me to build up API tests using various user profiles and information for testing. If you look in the http-client.env.json file in the root you will see a number of user objects which is used for testing ( this is usually a private file as it may contain sensitive information)

#### Swagger

In case you are unable to run the http files I decided to install swagger.

```
http://localhost:3000/api-docs
```

I auto generated the documentation for each route and checked them and added swagger to the above url. If you are unfamiliar with swagger this library generates API documentation for each endpoint and the ability to test them from the browser. Here is where i tested the validation and http code responses.


### Improvements

I would probably add a few extra security measures into the middleware. I would add a rate limiter to prevent spamming any endpoint that has to do with user authentication or creation, as these endpoints could be used maliciously and we want to mitigate that as much as possible.
The other middleware security feature I would add would be a randomised return delay, this would randomise the amount of time it takes an endpoint to return. The reason for this is that when dealing with authentication additional checks and logic can take longer than it takes to reject an authorisation. A malicious actor can use these time differences to work out which users have accounts and which do not, by randomising it it can mitigate this risk.
I would also likely add a 2nd password field to the endpoint, lots of users can mistype their passwords and an additional check to validate it matches the password they've entered is good practice.
