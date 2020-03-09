# **Telegram server monitor**

<p align="center">
    <img align="left" width="400px" src="https://github.com/midnightblurz/telegram-server-monitor/raw/master/static/images/1.jpg">
    <img align="right" width="400px"  src="https://github.com/midnightblurz/telegram-server-monitor/raw/master/static/images/3.jpg">
</p>

<p align="center">
    <img width="400px" src="https://github.com/midnightblurz/telegram-server-monitor/raw/master/static/images/3.jpg">
</p>


**Monitor your server using Telegram's Bot API**

## Installation:
Clone the repository, ```cd``` into it and run :
```shell script
 npm install
```

## Getting started:
Rename ```.env.example``` to ```.env```

Replace ```BOT_TOKEN``` value to your bot token. For security reasons there is the ```ALLOWED_IDENTIFIERS``` 
variable. You need to get your ID from the bot. Run the command ```npm run bot``` or ```node index``` to start the bot
and use the command ``/my_id``  to output your ID. Replace the existing 
```ALLOWED_IDENTIFIERS``` with your own ID **(you can use multiple if you have multiple accounts, just list them with a coma)**;


After that you can run the bot in the background, using for example: 
[PM2](https://pm2.keymetrics.io/docs/usage/quick-start/).


## Usage

#### Available commands: 

* ```/cpu```   CPU information
* ```/memory```  memory information
* ```/os```  OS information
*  ```/users``` active users
*  ```/network``` network information
*  ```/io``` disk input/output information
*  ```/processes``` outputs a pretty table for currently running processes
*  ```/usage``` outputs server usage stats


## Contribution
Feel free to add additional features and submit pull requests