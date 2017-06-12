# JerryCan #

JerryCan is a Koajs / Nodejs web application designed to track gasoline expenses over time. Migrations are handled by Knex and database access / pooling is handled by pg and pg-extra.

The application structure is heavily inspired by koa-skeleton by danneu on [GitHub](https://github.com/danneu/koa-skeleton) 

### To-do ###

### How do I get set up? ###

* Ensure PostgreSQL is installed and running
* Configure environmental variables
* Install packages via Yarn

```
#!JS

exports.GOOGLE_CONSUMER_KEY = process.env.GOOGLE_CONSUMER_KEY
exports.GOOGLE_CONSUMER_SECRET = process.env.GOOGLE_CONSUMER_SECRET
exports.JWT_SECRET = process.env.JWT_SECRET

// Ensure require('dotenv').config() is run before this module is required
exports.NODE_ENV = process.env.NODE_ENV || 'development'
exports.PORT = Number.parseInt(process.env.PORT, 10)
exports.DATABASE_URL = process.env.DATABASE_URL

exports.TRUST_PROXY = process.env.TRUST_PROXY === 'true'

// Set the HOSTNAME in production for basic CSRF prevention
//
// Ex: example.com, subdomain.example.com
exports.HOSTNAME = process.env.HOSTNAME
if (!exports.HOSTNAME) {
  console.warn('Warn: CSRF checks are disabled since there is no HOSTNAME environment variable provided')
}

exports.MESSAGES_PER_PAGE = Number.parseInt(process.env.MESSAGES_PER_PAGE, 10) || 10
exports.USERS_PER_PAGE = Number.parseInt(process.env.USERS_PER_PAGE, 10) || 10

// //////////////////////////////////////////////////////////

// Output config object in development to help with sanity-checking
if (exports.NODE_ENV === 'development' || exports.NODE_ENV === 'test') {
  console.log(exports)
```

### Who do I talk to? ###

* Sean @ github.com/sdwalsh or bitbucket.org/sdwalsh