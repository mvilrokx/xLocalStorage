# Introduction
Add this library to your Web Page to enable Cross Domain localStorage.

Normally, you cannot access localStorage information from one domain if it was stored by another domain.  This library however implements a hack that allows you to both set and get data from localStorage, even if it was not created by the current domain.

I discovered the hack from https://www.nczonline.net/blog/2010/09/07/learning-from-xauth-cross-domain-localstorage/ and this is my interpretation of it, but the gist is that an iFrame is being used as a "portal" to store data through into localStorage.

# Installation
[Download the library](https://github.com/mvilrokx/xLocalStorage/blob/master/dist/xLocalStorage.js) and put it in your Web project

(I am working on npm'ing this, stay tuned)

# Usage
## Initialize Server
Create an html page that will get loaded into an iFrame on your Web Page (see second step) and serves as the portal to localStorage.  This page is extremely simple and really only serves to initialize the "server".  You have to serve this page somehow, it can be from the same Web Server as your Web Application proper, or a completely different one.  Just make sure you know the URL of the page, you will need it in the next step.  All you need to do on this page is to load the script you installed earlier and initialize the server:

```html
<!DOCTYPE html>
<html>
  <body>
    <script src="dist/xLocalStorage.js"></script>
    <script> xLocalStorage.server()</script>
 </body>
</html>
```

There is [an example](https://github.com/mvilrokx/xLocalStorage/blob/master/iFrameServer.html) in this repository that you can just copy and use

## Initialize clients
Then, on each page you want to store data from into localStorage, you "connect" to this "server" and just store and retrieve data using the APIs provided by the library.

First add the library to your HTML page.  Then you create a client and instanciate the connection using the ```connect``` API for this client:

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <script src="dist/xLocalStorage.js"></script>
    <script>
      const client = xLocalStorage.clientFactory()

      client.connect('http://localhost:3002/iFrameServer.html')
        .then(() => {
          console.log('Connected')
        })
        .catch(() => console.log('Server unreachable!'))
    </script>
  </body>
</html>
```

Note that ```connect``` returns a Promise that gets fullfilled when the connection is successful and rejected when not.

Once connected you can make requests to the server to perform localStorage actions.  The methods provided are the same as the onces available on the localStorage Object so you have:

* getItem
* setItem
* removeItem
* clear

Besides these, you also get:

* connect
* disconnect
* isConnected
* on
* getItems
* setItems
* removeItems

Enjoy!
