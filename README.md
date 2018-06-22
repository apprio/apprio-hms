## Note 

This repository holds the code for the actual hybrid application for the project. The more interesting files for the Apprio HMS server and daemon files can be found at https://github.com/meccaparker/apprio-hms-server and https://github.com/meccaparker/apprio-hms-daemon.

## How to use this template

This is a starter template for [Ionic](http://ionicframework.com/docs/) projects.

*This template does not work on its own*. The shared files for each starter are found in the [ionic2-app-base repo](https://github.com/ionic-team/ionic2-app-base).

To use this template, either create a new ionic project using the ionic node.js utility, or copy the files from this repository into the [Starter App Base](https://github.com/ionic-team/ionic2-app-base).

### With the Ionic CLI - MAC:

Take the name after `ionic2-starter-`, and that is the name of the template to be used when using the `ionic start` command below:

```bash
$ sudo npm install -g ionic cordova
$ sudo npm install @ionic-native/in-app-browser

```

Then, to run it, cd into `myBlank` and run:

```bash
$ ionic cordova platform add ios
$ ionic cordova run ios
```

Preconditions, download node.js https://nodejs.org/en/
and git https://git-scm.com/download/win

### With the Ionic CLI - Windows:

The instructions are pretty much the same: 

```bash
git clone https://github.com/apprio/apprio-hms.git
cd apprio-hms
npm install -g ionic cordova
npm install @ionic-native/in-app-browser
npm uninstall -D @ionic/cli-plugin-cordova
ionic serve
```
If you receive an error regarding certs:
https://stackoverflow.com/questions/21855035/ssl-error-cert-untrusted-while-using-npm-command


