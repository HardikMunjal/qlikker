wind r
mstsc

Qlik production server credentials
10.2.5.159
hclt-pc2713-2\qlikadmin
power@11

lic key 9103550146105029

ctrl no. 51526
http://lef1.qliktech.com/manuallef/default.aspx

9103550146105029
PRODUCTLEVEL;50;;2017-03-30
OVERAGE;NO;;
TOKENS;430;;
WL2Q-W9UR-K62S-3SF8-VBKH


to open service 

wind r, services.msc


Is your goal to remove the cert privacy messages generated using self-signed certs? 
One option if you are trying to do this on a closed network that isn't exposed to the internet is to distribute the root certificate
from the Qlik Sense generated certs  (without private key) to users and add it to their trusted root cert authority on their local machines.  
This will help.

Buying a trusted cert from a third party for a .local cert is possible is well because you supply the CSR that contains the domain
 you are creating the cert to recognize.


This site cert (your cert) needs to have a private key attached to it when it is imported into Windows Cert Manager.
 Usually certs with private keys have an extension of .pfx. 




************************* get thumbprint of certificate *****************************

Received from domain CA certificate on the server. If not necessary to, I will describe how to do this.
further open the properties of the certificate, tab "details" option "Thumbprint"
and copied value as is, with spaces. 

Open QMC in my server 

https://fly/qmc/proxies

Edit Proxy, check Security and paste value in "SSL browser sertificate thumbprint" with space.

Restart Qlik Sense Web Server. 



hcl

1234


solution 1:
https://community.qlik.com/thread/144840

OK, I got my SSL certificate running by

1. stopping the qlik repository service,

2. installing my certificates on the windows server

3. entering the SSL browser certificate thumbprint in the proxy (with the whitespaces)

4. removing the qlik certificates

5. restart the qlik repository service (which re-installs the qlik certificates again)



solution 2:

1.  make sure my firewall supports inbound connections on port 443 (and 4244 if performing windows authentication).

2.  Go to a domain register and register a domain name.

3.  Add an entry for my domain to the DNS registry of a DNS provider with the ip address of my server.

4.  Generate a CSR for a certificate for the domain name I have registered.

5. Request the certificate from a trusted CA.

6.  Obtain the certificate and add the private key to the certificate

7. Add the certificate to windows cert manager localmachine\personal store.  potentially root certs as well.

8. Add the certificate thumbprint to the Qlik Sense proxy.

9.  In your Qlik Sense virtual proxy, make sure the domain name you have registered has been added to the websocket whitelist.

 




s3
If you want to use a certificate from a different CA than the self-signed certificate created by Sense you can find information about adding the security thumbprint here:

http://help.qlik.com/sense/en-US/online/#../Subsystems/ManagementConsole/Content/ServerUserGuide/SUG_ConfiguringSecurity…

 

When you import your certificate on the Qlik Sense server, it will require the private key and
 you will want to use a server certificate to create the trust between IIS and the Qlik Sense server.
   I recommend importing the certificate to the Local Machine\Personal certificate store.

 

Depending on the CA that created the cert, you may have to add the root certificate from that CA to the Trusted Root Certificate Authorities Store under Local Machine as well.

