export default {
    port: process.env.PORT || 8080,
    db: {
        mongodb: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce',
    },
    session_key: process.env.SESSION_KEY || 'SessionKeyDefault',
    cookie_secret: process.env.COOKIE_SECRET || 'CookieSecretDefault',
    jwt_key: process.env.JWT_SECRET_KEY || 'JSONWebTokenDefault',
    gh_client_id: process.env.GitHubClientID || 'GHClientIDDefault',
    gh_client_secret: process.env.GitHubClientSecret || 'GHClientSecretDefault',

    admin_first_name: process.env.admin_first_name || 'AdminFirstNameDefault',
    admin_last_name: process.env.admin_last_name || 'AdminLastNameDefault',
    admin_email: process.env.admin_email || 'AdminEmailDefault',
    admin_password: process.env.admin_password || 'AdminPasswordDefault',
    admin_role: process.env.admin_role || 'AdminRoleDefault',
};