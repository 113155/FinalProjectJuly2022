import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";

const cognitoUserPool = () => (
    new CognitoUserPool({
        UserPoolId: "us-east-1_Iau5MO8zd",
        ClientId: "7r9h34a32l3l9qoa1kap5e8ji5"
    })
);

const setCognitoUserAttribute = (attributeKey, attributeValue) => {
    let data = {
        Name: attributeKey,
        Value: attributeValue
    };

    return new CognitoUserAttribute(data);
};

export const signupCognitoUser = (values) => {
    const { email, password, firstname, lastname, role } = values;
    const attributeList = [];

    const userPool = cognitoUserPool();

    attributeList.push(setCognitoUserAttribute('given_name', firstname));
    attributeList.push(setCognitoUserAttribute('family_name', lastname));
    attributeList.push(setCognitoUserAttribute('email', email));
    attributeList.push(setCognitoUserAttribute('picture', ""));
    attributeList.push(setCognitoUserAttribute('custom:role', role));

    return new Promise((resolve, reject) =>
        userPool.signUp(email, password, attributeList, null, (err, result) => {
            if (err) {
                console.log("Cognito signup error: " + err);
                reject(err);
            } else {
                console.log("Response: " + JSON.stringify(result));
                resolve(result);
            }
        })
    );
};

export const confirmCognitoUser = (username, confirmationCode) => {
    const userPool = cognitoUserPool();
    const userData = {
        Username: username,
        Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
        cognitoUser.confirmRegistration(confirmationCode, true, function (err, result) {
            if (err) {
                console.log("Error: " + err);
                reject(err);
            } else {
                console.log("Response: " + result);
                resolve(result);
            }
        });
    });
};

export const loginCognitoUser = (values) => {
    const userPool = cognitoUserPool();

    const user = new CognitoUser({ Username: values.email, Pool: userPool });

    const authenticationData = { Username: values.email, Password: values.password };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve, reject) =>
        user.authenticateUser(authenticationDetails, {
            onSuccess: result => resolve(result),
            onFailure: err => reject(err)
        })
    );
};

export const getCurrentUser = () => {
    const userPool = cognitoUserPool();
    return userPool.getCurrentUser();
};

export const logoutCognitoUser = () => {
    const currentUser = getCurrentUser();

    if (currentUser !== null) {
        currentUser.signOut();
    }
};