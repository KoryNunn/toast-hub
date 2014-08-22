var Ajax = require('simple-ajax'),
    githubApi = 'https://api.github.com';
    githubUrl = 'https://github.com',
    crel = require('crel'),
    seen = [];

function parseHtml(html){
    var el = document.createElement('div');

    el.innerHTML = html;

    var notifications = el.querySelectorAll('#notification-center .notifications-list .list-group-item');

    var results = [],
        newSeen = [];

    for (var i = 0; i < notifications.length; i++) {
        var notification = notifications[i],
            link = notification.querySelector('.js-notification-target'),
            result = {};

        result.text = link.textContent;
        result.link = link.getAttribute('href');
        result.id = notification.getAttribute('data-note-id');
        result.image = notification.querySelector('img.avatar').getAttribute('src');

        newSeen.push(result.id);

        if(~seen.indexOf(result.id)){
            continue;
        }

        results.push(result);
    };

    seen = newSeen;

    return results;
}

function showDesktopNotification(results){
    results.forEach(function(result){
        var notification = new Notification('Toasthub', {
            body: result.text,
            icon: result.image
        });

        notification.onclick = function(){
            window.open(result.link);
        };
    })
}

function checkNotifications(){
    var request = new Ajax(githubUrl + '/notifications');

    request.on('complete', function(response){
        var statusCode = response.target.status;
        if(statusCode === 200){
            showDesktopNotification(parseHtml(response.target.responseText));
        }
        setTimeout(checkNotifications, 60000);
    });

    request.send();
}

checkNotifications();