---
layout: default  
title: Local install  
permalink: /install/
---

# notes
html pages seem to use "liquid syntax". Best documentation seems to be on shopify (e.g. https://shopify.dev/api/liquid/objects/for-loops)

# To serve site locally

## Using Ruby installer - Windows

[Follow instructions here](https://jekyllrb.com/docs/installation/windows/#installation-via-rubyinstaller)

After install:  
_`gem update`_

_`gem install jekyll -v 3.8.5`_ Use current version on [Github Pages](https://pages.github.com/versions/)  
_`gem install bundler`_

### To serve to localhost

_`bundle exec jekyll serve`_

[127.0.0.1:4000](http://127.0.0.1:4000/)

## Using Ubuntu or Windows Subsystem for Linux Ubuntu.

### To install

_`sudo apt-get update -y && sudo apt-get upgrade -y`_  
  
_`sudo apt-add-repository ppa:brightbox/ruby-ng`_
  
_`sudo apt-get update`_

_`sudo apt-get install ruby2.5 ruby2.5-dev build-essential dh-autoreconf zlib1g-dev`_

_`sudo gem update`_

_`sudo gem install jekyll -v 3.8.5`_ Use current version on [Github Pages](https://pages.github.com/versions/)  
_`sudo gem install bundler`_

### To serve to localhost

_`bundle exec jekyll serve`_

[127.0.0.1:4000](http://127.0.0.1:4000/)
