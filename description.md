# Licensing and distribution module.
The module will consists with two parts:

 - authorization web server
 - small piece of code implemented in desktop application which will communicate with the server

> We will use RSA cryptography (pair of asymetric keys) to verify the client identity
> and encrypt/decrypt licensing details while sending between server and desktop application.

## Authorization web server
Authorization web server will consists with two parts.

### Admin part.
Administrator logs in to authorization server and registers new client using his email and name. Also admin issues a license for the client and sets the options if any. Admin provides client website link and credentials.

### Clients part.
Client gets the link and credentials to the website. Using this information client logs in: user can see the information about himself and his license (client's RSA key). There is also instruction for the client, somethink like this:

> Please copy your license key and paste into Desktop application.
> When user do this, the communication between Desktop application and server will begin.

User's Desktop application composes **HardwareId** and together with the pasted license key sends to the authorization server. The server finds the client by the key and set received HardwareId as active, then server sends response to Desktop application with permission to unlock the application (client can work).

If client uses the same license on another computer, server will get one more **HardwareId** for the same lincese and will sent the block response.

Such communication/checking between desktop and authorization server will run periodically, for exapmple 1 time per hour.