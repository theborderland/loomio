# Loomio Development Quickstart

## Clone the Loomio repo from github
```
git clone git@github.com:loomio/loomio.git && cd loomio
```

## Install the required node version
Check the node version required by ensuring your node version matches with the version specified in the `engines` field of `client/package.json`
```
$ grep client/package.json -e 'engines' -A 3
```

We will now build and install that node version (at the time of writing 8.4.0):

```
$ nvm install 8.4.0
$ nvm alias default 8.4.0
```

### Install two packages required for this project

```
$ npm install -g yarn gulp
```

## Create database user

### On OSX
If you're on OSX then you can run the following bootstrap task to setup your system with postgresql, npm, bundler and gulp. It will then create an admin user. If you need help installing ruby, or more detail on installing the dependencies, please read [Setup Environment](setup_environment.md)

If you are setting up with PostgreSQL for the first time, you would have to create a superuser.

```
[sudo] su postgres -c 'createuser -P --superuser <username>'
```
### On Linux
If running Linux, you'll use:
```
$ sudo -u postgres psql postgres
postgres=# CREATE USER <youruseraccount> WITH SUPERUSER;
\q
$ logout
```
## Install loomio specific dependencies

### Setup transfer encryption with Bundler
```bundle config github.https true```

### Install dependencies

```
bundle install
cd client
yarn
```

## Run the bootstrap task
```
rake bootstrap
```

_NB: Take note of the email and password generated at the end of this task; you'll need it to log in once setup is complete_

## Build the frontend client
```
gulp compile
```
## Launch the server
```
gulp dev
```
And then in a new terminal instance
```
rails s
```

If you do not run ```gulp dev``` your browser will connect to (and apparently load) the page served by rails, but the page itself will be blank.
If you feel like your changes to the application aren't being picked up, try restarting this process.

The rails server may tell you that it's listening on 0.0.0.0:[port], but attempting to log in at that page will result in 403 Forbidden and a redirect. Use localhost:[port] instead.

### Other things to know
- There are several other gulp commands you can run to make your development go. These can be run from the `angular` folder.
  - `gulp nightwatch`: Run the automated frontend tests
  - `PRIVATE_PUB_SECRET_TOKEN=abc123 bundle exec rackup private_pub.ru -E production` is how to start faye (live updating) in development
  - `npm rebuild node-sass` has been known to be very useful
  - if you ever get into problems, then `rm -rf node_modules && yarn`

### Having trouble?

- Make sure ruby (2.3.5), node (7.4.0), postgres (9.4+), and [ImageMagick](http://stackoverflow.com/questions/3704919/installing-rmagick-on-ubuntu) are installed
- Let us know in the [product development](https://www.loomio.org/g/GN7EFQTK/loomio-community-product-development) group on Loomio.
