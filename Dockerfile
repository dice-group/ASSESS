FROM tomcat:8
RUN mkdir /usr/local/tomcat/webapps/ASSESS
COPY . /usr/local/tomcat/webapps/ASSESS/
#WORKDIR /usr/local/tomcat/webapps/ASSESS/
EXPOSE 8080
CMD bash -C '/usr/local/tomcat/webapps/ASSESS/start.sh'


