var Ajax = require('simple-ajax'),
    githubApi = 'https://api.github.com';
    githubUrl = 'https://github.com';

function parseHtml(html){
    var el = document.createElement('div');

    el.innerHTML = html;

    return el;
}

function checkNotifications(){
    var request = new Ajax(githubUrl + '/notifications');

    request.on('complete', function(response){
        var x = parseHtml(response.target.responseText);
        console.log(response);
    });

    request.send();
}

var notification = new Notification(
  'Thing!'
);

checkNotifications();