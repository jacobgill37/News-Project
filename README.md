# Northcoders News API

## Project summary

This project is a REST api designed to simulate a news site. It allows clients to retrieve articles, comments, users and topics. As well as allowing the posting of new comments, deleting of comments and the updating of existing article's vote counts.

## Cloning

The repo will need to be cloned if you will want to host your own version. Use the following link:
`https://github.com/jacobgill37/News-Project.git`

## Installing dependencies

All project dependencies can be installed using:

```
npm install
```

## .env's needed

This project will need two .env files in the main directory:

```
.env.test
.env.development
```

Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names). Double check that these .env files are .gitignored.

## Seeding the local database

To seed the database locally run both:

```
npm run setup-dbs
npm run seed
```

## Testing

Testing is done with jest. Tests can be run with the following:

```
npm test
```

## Node.js and Postgres versions

The versions used in this project were:

- `Node.js v16.17.1`
- `Postgres v14.5`
