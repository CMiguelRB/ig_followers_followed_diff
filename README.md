# ig_followers_followed_diff
This NodeJS script returns the diff array between followers and followed IG accounts, for a certain account.

## Environment variables

It requires some variables to be set in a .env file. 

```
COOKIE='XXXXXXXXXXXXXXXXXXXXXXXX'
CSRFTOKEN='XXXXXXXXXXXXXXXXXXXXXXXX'
ACCOUNT='accountName'
IGAPPID='XXXXXXXXXXXXXXXXXXXXXXXX'
USERID='XXXXXXXXXXXXXXXXXXXXXXXX'
```

All these params can be obtained from a browser in some requests to the IG API. You can check those requests in the Network tab in DevTools. The cookie, csrf-token and ig-app-id are set in the request headers. The userId is in the request path.

## Run

This script can be executed from a terminal with the following command: 

```
node execute.js
```
