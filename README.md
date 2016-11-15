ASSESS - Client
======

This project develops the frontend of http://assess.aksw.org - an automatic self-assessment platform based on RDF.

A running demo can be found here http://assess.aksw.org/demo/.

The underlying backend can be found here http://github.com/aksw/Semweb2NL.


Docker:
======
To run ASSESS as docker container you need this container and a container from the backend.
http://github.com/aksw/Semweb2NL

Howto get the frontend working:

1. Clone the repo an go into the folder.

2. Build the image.

`sudo docker build -t assess-demo-client .`

3. Run the Image.

`sudo docker run -d --restart=always --name assess-demo-client --link assess-demo-backend -p 9909:8080 assess-demo-client`


