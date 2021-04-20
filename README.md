# Marmor Musica
> Generating harmony by balancing a marble  

Marmor Music is a networked Pure Data project developed for the Sound Space and Interaction course of the Mediatechnology programme. There is a [video demontrating the project](https://youtu.be/s7Vonrr7p88) but you could also read on and learn how play with it yourself or even how to run it locally. 

## Using the online version
To use the online version of this project please do the following: 

1. Go to [maniflames.github.io/ssi](https://maniflames.github.io/ssi) and press the start button
2. Clone or download this repository & open `PD Client/main.pd`

Because of an unfortunate bug that is still in the pd client for correcting some of the behaviour of the Device Orientation API by the browser it is important to connect all client first and then open the patch.

Make sure the following Pd externals are installed in combination with Pure Data 0.51.4 (or higher): 
- else (1.0-0 beta-37 or higher)
- cyclone (0.5-4 or higher)
- mrpeach (v20200615 or higher)

The web input client currently works best on Chrome & Safari.

## Running the project locally 
It is also possible to run this project locally or host it yourself. Keep in mind that the Device Orientation API in modern browsers is only supported when the page is loaded in a secure context (https). To run this project locally please do the following:

1. Clone or download this repository 
2. Run `npm install` using a version of NodeJS that is compatible with NodeJS v14.16.1 
3. Generate SSL certificates (by using openssl for local SSL or using certbot for non-local SSL)
4. Correct the path to the SSL certificates in `server.js` on line 22 & 23
5. Change the url into the url of your hosted solution in `main.js` on line 38 
6. Run `npm run build` to build a correct version of the mobile client
7. Host the client using a server that supports SSL (either by hosting it on a platform like github pages or extending the server a little bit to return `docs/index.html` when it recieves a GET request on port 443)
8. Change the url into the url of your hosted solution in the `main.pd` patch
9. Follow the steps of the `using the online version` section using your own mobile client instead