# slack-cleaner-server
A slack message cleaner webservice hooked to Outgoing WebHooks

# Installation
``` bash
$ npm i -g slack-cleaner-server
```

## Slack integration
You need to add an `Outgoing WebHooks` app integration.  

With or without Trigger Word, it's up to you.  
For the URL, because `slack-cleaner-server` need a dev token to communicate with the Slack API, you need to pass it :
```
// e.g. If slack-cleaner-server is launched on yourDomain.com
http://yourDomain.com:5140/delete/<yourSecretApiToken>/
```

You can generate an API token here : https://api.slack.com/tokens

# Usage
``` bash
$ slack-cleaner-server
```
