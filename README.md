This is a frontend (site) source code (not a result/deploy) for Adaperio project.

##Prereqs

     npm install -g bower
     npm install -g grunt-cli

##Prepare directory

     bower install
     npm install

*This will populate node_modules and bower_modules directories*.

#Grunt
You have 4 simple Grunt commands available:

    grunt server     #Run test server on localhost:9001
    grunt build      #Build quickly (not for production)
    grunt release    #Places a fully optimized (minified, concatenated, and more) in /dist
    grunt deploy     #Build and then deploy to server

