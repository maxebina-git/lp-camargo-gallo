// Simple FTP deploy script using ftp-deploy package
const FtpDeploy = require('ftp-deploy');
const ftpDeploy = new FtpDeploy();

const localDir = process.argv[2];
const remoteDir = process.argv[3];

if (!localDir || !remoteDir) {
    console.error('Usage: node deploy-ftp.cjs <localDir> <remoteDir>');
    process.exit(1);
}

const config = {
    user: process.env.FTP_USERNAME,
    password: process.env.FTP_PASSWORD,
    host: process.env.FTP_SERVER,
    port: 21,
    localRoot: __dirname + '/' + localDir,
    remoteRoot: '/public_html/' + remoteDir + '/',
    include: ['*', '**/*'],
    exclude: ['.DS_Store', '**/.DS_Store'],
    // Enable passive mode for compatibility with some FTP servers
    passive: true,
};

console.log(`Uploading ${localDir} to /public_html/${remoteDir}/`);
console.log('Local root:', __dirname + '/' + localDir);
console.log('Remote root:', '/public_html/' + remoteDir + '/');
ftpDeploy.deploy(config)
    .then(res => {
        console.log('Upload completed:', res);
        process.exit(0);
    })
    .catch(err => {
        console.error('Upload failed:', err);
        console.error('Error details:', JSON.stringify(err));
        process.exit(1);
    });