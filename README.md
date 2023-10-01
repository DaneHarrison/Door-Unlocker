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

## Acknowledgements:
- Cubes

//add emailer to fails and lock outs
//could move session management to a memcache db

//might throw error double check - cookie domian attr

- Make queueRequest create a function to give to workers
- need to setup so that when session changes it persists to all tables (stored procedure)
- need to make latest login persist as well (stored procedure)
- update frontend (React)
