const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/tasks.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials_desktop.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the user's first 10 task lists.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
// async function listTaskLists(auth) {
//   const service = google.tasks({version: 'v1', auth});
//   const res = await service.tasklists.list({
//     maxResults: 10,
//   });
//   const taskLists = res.data.items;
//   if (taskLists && taskLists.length) {
//     console.log('Task lists:');
//     taskLists.forEach((taskList) => {
//       console.log(`${taskList.title} (${taskList.id})`);
//     });
//   } else {
//     console.log('No task lists found.');
//   }
// }

// authorize().then(listTaskLists).catch(console.error);


/**
 * Lists the user's first 10 task lists.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function checkTask(auth){
    const service = google.tasks({version: 'v1', auth});



    service.tasks.get({
        tasklist: 'MDM5Njg1MDE4NTY4MjAxNDAxMDE6MDow',
        task: 'c3ZrbllrUWNDQjVkc3NKZg',
      }, (err, res) => {
        if (err) {
          console.error('Error fetching task details:', err);
          return;
        }
      
        console.log('Task details:', res.data);
      });
      
}

authorize().then(checkTask).catch(console.error);