<div align='center'>
<h1>Door-Unlocker</h1>
</div>

<br>

My first solo project and introduction to web development. Here I learnt the basics of web technologies, different software architectures and server authentication. My goal was to experiment with automation and while I was successful, I am currently adjusting its design to reflect aquired knowledge and experience. 

<br>
<br>
<br>

## Overview
- setting up the environment
- security
- Acknowledgements

## changelog:
- we swap to import to use tree shaking and prevent dependency issues
- .env makes it easy to control environment variables and can be accessed by both docker-compose and the server more easily
- Design patterns
- Queue system
- Triggers
- Logging
- Design architecture
- fixed a bug where throwing an error gave access - false by default

## Further improvements
- Security?
- Better device setup? - send over serial

//add emailer to fails and lock outs
//could move session management to a memcache db

//might throw error double check - cookie domian attr

- Make queueRequest create a function to give to workers
- need to setup so that when session changes it persists to all tables (stored procedure)
- need to make latest login persist as well (stored procedure)
- update frontend (React)

```docker-compose --env-file .env up```
connecting to database uses this as addr: ```door-unlocker-postgres-1```

# DoorUnlocker

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

UPDATE public.friends 
SET access_lvl = 'admin' WHERE friend_id = 1;

if you dont subscribe to a request it will not send

https://myaccount.google.com/apppasswords

if this doesnt work its because 2 factor auth is needed