# easyBSB

## Connecting the BSB / LPB

- via bsbLAN -> but only API
- via bsbLAN interface board on Rapsi -> see docu
- bsbLAN board + ftdi kabel (see docu howto connect)
- simple without galvanic isolation (nur empfangen fehlt noch senden) https://www.mikrocontroller.net/attachment/163762/BSB-to-USB_Adapter.png

## Install

### electron

Just donwload the actual release from the releases and open the
electron app.

### npm

```bash
npm install -g @easybsb/cli
easybsb
```

open the browser http://localhost:808x/

If you like to change port / binding,.. see the optional arguments
in the Documentation ...

### docker

add docker install

NOTE: HowTo Exposing a tty serial device if needed

## Config

... Config the connection .-> bsbLAN, direct serial, tcp serial,...

## Typeorm

npx nx run server:migration-generate --name <NAME> to create a new migration
npx nx run server:migration-run to run migrations

## Packages

### easybsb package

npm run package:server

### electron app

npm run package:electron

> ensure npm run package:server was called before

### Environment variables

| | | |
|-|-|-|
|name|type|description|
|EASYBSB_PORT|number|port nestjs server is running|
|EASYBSB_DATABASE_FILE|string|path where the file should be saved|
|EASYBSB_JWT_SECRET|string|JWT Secret|


>You can allways write down all environment variables into a file so you do not need
>to pass them allways

| | | |
|-|-|-|
||path|name|
|development|source_root|.env|
|end2end|source_root|.env.e2e|
|production/electron| <HOME_DIRECTORY>/easybsb/|.env|
