# About

This is tool for finding html elements at URLs from sitemap.xml

## Setup

1) npm i -g @adonisjs/cli
2) npm i
3) cp .env.example .env
3) place sitemap.xml in to root of project

## RUN

adonis serve --dev


### Find by word

http://127.0.0.1:3333/sitemap?word={{word}}

### Find empty elements

http://127.0.0.1:3333/empty

each line is element with empty inner text
`${url};${title};${tag};${elemID};${elemClass};\n`
