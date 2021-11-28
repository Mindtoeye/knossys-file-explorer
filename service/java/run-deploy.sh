clear
echo "Building packages ..."
mvn package
echo "Copying to wildfly folder ..."
cp -v ./target/*.war ~/wildfly/standalone/deployments
