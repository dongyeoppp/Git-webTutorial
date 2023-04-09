const cookie = require('cookie')
var template = {
    html:function(title,list,body, control,login){
        return `
        <!doctype html>
        <html>
        <head>
        <title>Bookmark - ${title}</title>
        <meta charset="utf-8">
        <link rel="stylesheet" href="/css/style.css">
        </head>
        <body id="root">
        ${login}
        <h1 id="top"><a href="/">Bookmark</a></h1>
            <div id="list">
            ${list}
            </div>

            <div id="con">
            ${body}
        
            ${control}
            </div>
        </body>
        </html>
        `;
    },
    list:function(topic){
        var list = '<div class="back color-6"><div class="row columns"><ul class="menu align-center expanded text-center SMN_effect-6">';
        for(var i = 0 ; i < topic.length;i++){
            list += `<li ><a href = "/page/?id=${topic[i].id}" data-hover="${topic[i].SiteName}">${topic[i].SiteName}</a></li>`
        }
    
        list = list + '</ul></div></div>';
        return list;
    },
    reg:function(title,control){
        return `
        <!doctype html>
        <html>
        <head>
        <title>${title}</title>
        <meta charset="utf-8">
        <link rel="stylesheet" href="/css/style.css">
        </head>
        <body id="root">
        <h1 id="top">${title}</h1>

            <div id="con">
            ${control}
            </div>
        </body>
        </html>
        `;
    },
    IsOwner:function(request,response){
        var isOwner = false;
        var cookies = {}
        if(request.headers.cookie){
            cookies = cookie.parse(request.headers.cookie);
        }
        if(cookies.user){
            isOwner = true;
        } 
        console.log(isOwner);
        return isOwner;
    },

    authStatusUI:function(request,response){
        var cookies = cookie.parse(request.headers.cookie)
        var authStatusUI = '<a href="/login">login</a>     <a href="/register">register</a>';
      if (this.IsOwner(request, response)) {
        authStatusUI = `${cookies.name}님 <a href="/logout_process">logout</a>`;
      }
      return authStatusUI;
    }

}

module.exports = template;