# JerryCan #

JerryCan is a Koajs / Nodejs web application designed to track gasoline expenses over time.

This repository houses the backend of JerryCan (RESTful API)

PostgreSQL > 9.6 is required with migrations and seeding handled by Knex. Database access and pooling is handled by pg and pg-extra.  Before running the application please ensure Postgres has started and the database url is set in an environmental variable.

The application structure is heavily inspired by koa-skeleton by danneu on [GitHub](https://github.com/danneu/koa-skeleton)

## How do I get set up? ##

* Ensure PostgreSQL is installed and running
* Setup [Google OAuth2](https://developers.google.com/identity/protocols/OAuth2) and configure callback url
* Set environmental variables (check `/src/config.js` for a list) consider using [dotenv](https://www.npmjs.com/package/dotenv)
* Install packages via [yarn](https://yarnpkg.com/en/)
* Initialize database with `knex migrate:latest`
* Run `node app.js` from root directory to start JerryCan

## API Endpoints

| Route                 | HTTP Verb | Type   | Explanation                                                     | Public |
|-----------------------|:---------:|--------|-----------------------------------------------------------------|:------:|
| /                     |    GET    | Public | general statistics used for homepage                            |   Yes  |
| /auth/google          |    GET    | Auth   | google oauth2 authentication                                    |   Yes  |
| /auth/google/callback |    GET    | Auth   | google oauth2 callback                                          |   Yes  |
| /cars                 |    GET    | Cars   | return cars for the authenticated user                          |   No   |
| /cars                 |    POST   | Cars   | creates a car for the authenticated user                        |   No   |
| /cars/:uuid           |    PUT    | Cars   | update a car for the authenticated user                         |   No   |
| /cars/:uuid           |    DEL    | Cars   | delete a car and any associated logs for the authenticated user |   No   |
| /cars/:car_uuid       |    GET    | Logs   | return all logs for the car                                     |   No   |
| /cars/:car_uuid       |    POST   | Logs   | add a log for the car                                           |   No   |
| /cars/:car_uuid/:uuid |    DEL    | Logs   | delete a log                                                    |   No   |

## Who do I talk to? ##

* Contact Sean @ [github.com/sdwalsh](https://www.github.com/sdwalsh) or [bitbucket.org/sdwalsh](https://www.bitbucket.org/sdwalsh)

## Contributing ##

Feel free to fork this repository and send pull requests!

# License #

MIT License

Copyright (c) 2017 Sean Walsh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
