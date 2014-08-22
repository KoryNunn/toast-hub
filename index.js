var Ajax = require('simple-ajax'),
    githubApi = 'https://api.github.com';
    githubUrl = 'https://github.com',
    crel = require('crel'),
    doc = require('doc-js'),
    seen = [];

function parseHtml(html){
    var el = document.createElement('div');

    el.innerHTML = html;

    var notifications = el.querySelectorAll('#notification-center .notifications-list .list-group-item');

    var results = [],
        newSeen = [];

    for (var i = 0; i < notifications.length; i++) {
        var notification = doc(notifications[i]),
            link = notification.findOne('.js-notification-target'),
            result = {};

        result.parentName = doc(notification.closest('.boxed-group')).findOne('h3').textContent.trim();
        result.text = link.textContent.trim();
        result.link = link.getAttribute('href');
        result.id = notification[0].getAttribute('data-note-id');
        result.image = notification.findOne('img.avatar').getAttribute('src');

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
            body: result.parentName + ': ' + result.text,
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