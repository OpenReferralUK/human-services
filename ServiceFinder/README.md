# Service Finder

_Service Finder is targeted at any public or third sector frontline worker looking to find services that might support the needs and circumstances of a citizen. It accesses open data collected to meet the data standard of the [OpenReferral community](https://openreferral.org)_

## Getting Started

_To use this project you must follow the steps mentioned below._

### Requirements

_You will need the following:_

- [Node.js](https://nodejs.org/en/)

### Install

_Next we will comment step by step how to start with the Service Finder project:_

_To start with, open a command line and go to the project root folder.
Then write the following line on command line:_

_For windows users:_
`$ npm install`

_For linux and MacOS users:_
`$ sudo npm install`

_When all the packages have been downloaded, you can now build and test the Service Finder_

## Configuration

_The project has two aspects of configuration: an API endpoint URL and a configuration data file to specify the Personas options._

_To modify the API endpoint URL, modify the API_URL_BASE constant in the settings.js file._

_To modify the Personas configurations, modify the config.js file (note that this refers to ID numbers specific to data held within the particular API)._

## Scripts

-_To run the project use the following command line_

>_For windows users:_
`$ npm start`

>_For linux and MacOs users:_
`$ sudo npm start`
>
_Then you can see the project running at :_
- [http://localhost:3000](http://localhost:3000)

## Deploy Project
-_To build the project use the following command line_

>_For windows users:_
`$ npm run build`

>_For linux and MacOs users:_
`$ sudo npm run build`
>
To go to the build folder just type the following line in the command line:
`$cd ./build`

_These files are the ones that must be on the server._

_When the files are hosted on the server, we will need to create a new file in the directory where the page is located.
The file will have to be called `.htaccess` and the following lines must be inside this file:_

``` 
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

_In the public folder, there is a file called `settingsConfig.json`. This file must be changed to include the endpoint URL of the API you wish to use.
By default, the API endpoint is:_

```
https://api.porism.com/ServiceDirectoryService
```


## Service Finder key components

_The project was made with:_
* [React](https://reactjs.org/)
* [Redux](https://es.redux.js.org/)
* [react-redux](https://github.com/reduxjs/react-redux)
* [Axios](https://github.com/axios/axios)
* [Bootstrap](https://getbootstrap.com/)
* [classnames](https://github.com/JedWatson/classnames)
* [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
* [rc-checkbox](https://github.com/react-component/checkbox)
* [rc-slider](https://github.com/react-component/slider)
* [React Router](https://github.com/ReactTraining/react-router)
* [React Select](https://github.com/JedWatson/react-select)
* [React Spinners](https://github.com/davidhu2000/react-spinners)
* [React Table](https://github.com/tannerlinsley/react-table)
