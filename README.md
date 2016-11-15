ASSESS - Client
======

This project develops the frontend of http://assess.aksw.org - an automatic self-assessment platform based on RDF.

A running demo can be found here http://assess.aksw.org/demo/.

The underlying backend can be found here http://github.com/aksw/Semweb2NL.


Docker:
======
first clone the repo an go into the folder.

to build the image run:
'sudo docker build -t assess-demo-client .'

to run the image please run the following command:
sudo docker run -d --restart=always --name assess-demo-client --link assess-demo-backend -p 9909:8080 assess-demo-client


