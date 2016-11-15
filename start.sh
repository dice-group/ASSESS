#/bin/bash
filename='/usr/local/tomcat/webapps/ASSESS/assess.js'
tempfile='/usr/local/tomcat/webapps/ASSESS/tempfile'
#filename='assess.js'
#tempfile='tempfile'

url="var rootURL = \"http://"
#get ip addr from linked container
url+=$(cat /etc/hosts | grep assess-demo-backend | awk {'print $1'})
url+=":9902/assess-service/rest/\";"

#insert a new line at the beginning of $filename
echo $url > $tempfile
cat $filename >> $tempfile
rm $filename
mv $tempfile $filename

#run tomcat
bin/catalina.sh run
