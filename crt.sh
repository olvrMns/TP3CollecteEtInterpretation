# https://www.youtube.com/watch?v=USrMdBF0zcg

certDirectory=./cert/;
privateKeyPath=$certDirectory'privateKey.pem';
certificateSigningRequest=$certDirectory'certificateSigningRequest.csr';
crt=$certDirectory'publicKey.crt';
# openssl x509 -req -days 365 -in .\cert\certificateSigningRequest.pem -signkey .\cert\privateKey.key -out ./cert/cert.pem
cr() {
    if ! [ -d $certDirectory ]; 
    then mkdir $certDirectory;
    fi

    echo "== PRIVATE KEY ==";
    openssl genrsa -out $privateKeyPath;
    echo "== SIGNING REQUEST ==";
    openssl req -new -key $privateKeyPath -out $certificateSigningRequest;
    echo "== PUBLIC KEY ==";
    openssl x509 -req -days 365 -in $certificateSigningRequest -signkey $privateKey -out $crt;
}
 
$*
