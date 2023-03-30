# Časopis
[![CI](https://github.com/JazzXP/casopis/actions/workflows/main.yml/badge.svg)](https://github.com/JazzXP/casopis/actions/workflows/main.yml)

Technically Czech for Magazine, I kinda like how it sounds.

## Installation
* Create keys with 
  * `openssl genrsa -out jwtkey_private.pem 2048`
  * `openssl rsa -in jwtkey_private.pem -out jwtkey_public.pem -outform PEM -pubout`
* Customise `docker-compose.yml` to your needs, in particular make sure the image can write to your `files` directory
* `docker-compose up -d`