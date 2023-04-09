var qs = require('querystring');
var db = require('./db');
var template = require('./templates.js');

var cookie = require('cookie');


exports.home = function(request,response){
    var cookies = {};
    if(request.headers.cookie){
        cookies = cookie.parse(request.headers.cookie);
    }
    db.query(`SELECT * FROM topic WHERE topic.user = '${cookies.user}'`,function(error,result){
        if (error){throw error;}
        var title = 'Welcome';
        var description = 'Add Your Bookmark';
        var list = template.list(result);
        var login = template.authStatusUI(request, response);
        var html = template.html(title,list,`<h2>${title}</h2><div class = "article">${description}</div>`,`
        <button type="button" class="w-btn w-btn-green" onclick="location.href =  '/create'">생성</button>`,login);
        
        response.writeHead(200);
        response.end(html);   
    });
    
}
exports.detail = function(request, response){
    var queryData = request.query
    var id = queryData.id
    var cookies = {};
    if(request.headers.cookie){
        cookies = cookie.parse(request.headers.cookie);
    }
    db.query(`SELECT * FROM topic WHERE topic.user = '${cookies.user}'`,function(error,result){
        if (error){throw error;}
        db.query(`SELECT * FROM topic WHERE topic.id=?`,[id],function(error2,topic){
            if (error2){throw error;}
            var list = template.list(result);
            var login = template.authStatusUI(request, response);
            var html = template.html(topic[0].SiteName,list,`<h2>${topic[0].SiteName}</h2><a href="${topic[0].SiteUrl}">${topic[0].SiteUrl}</a></div>`,
            `<table>
            <tr>
                <td><button type="button" class="w-btn w-btn-green" onclick="location.href =  '/update?id=${id}'">수정</button></td>
                <td>
                    <form action="/delete_process" method="post">
                        <input type="hidden" name="id" value="${id}">
                        <input type="submit" class="w-btn w-btn-green" value="삭제">
                    </form>
                </td>
            </tr>
            </table>`,login);
            
            response.writeHead(200);
            response.end(html);
        });
    });
}
exports.creat = function(request, response){
    var cookies = {};
    if(request.headers.cookie){
        cookies = cookie.parse(request.headers.cookie);
    }
    db.query(`SELECT * FROM topic WHERE topic.user = '${cookies.user}'`,function(error,result){
        if (error){throw error;}
        var title = 'create';
        var list = template.list(result);
        var login = template.authStatusUI(request, response);
        var html = template.html(title,list,`
        <form
        action="/create_process" method="post">
        <p><input type="text" name="title" placeholder = "SITE NAME"></p>
        <p>
        <textarea name="description" placeholder="URL">http://</textarea></p>
        <p>
        <input type="submit" class="w-btn w-btn-green">
        </p>
        `,`<p></p>`,login);
        
        response.writeHead(200);
        response.end(html);  
    });
}
exports.create_process = function(request,response){
    var cookies = {};
    if(request.headers.cookie){
        cookies = cookie.parse(request.headers.cookie);
    }
    var post = request.body;
    var title = post.title;
    var description = post.description;
    db.query(`INSERT INTO topic (SiteName,SiteUrl,Date,user) VALUES (?,?,NOW(),'${cookies.user}')`,[title,description],function(error,result){
        if (error){throw error;}
        response.writeHead(302,{location: `/page/?id=${result.insertId}`});
        response.end();
    });

}
exports.update = function(request, response){
    var cookies = {};
    if(request.headers.cookie){
        cookies = cookie.parse(request.headers.cookie);
    }
    var queryData = request.query
    var id = queryData.id
    db.query(`SELECT * FROM topic WHERE topic.user = '${cookies.user}'`,function(error,result){
        var list = template.list(result);
        var login = template.authStatusUI(request, response);
        db.query(`SELECT * FROM topic WHERE id=?`,[id],function(error,topic){
            var html = template.html(topic[0].SiteName,list,`
            <form action="/update_process" method="post">
            <input type="hidden" name="id" value="${topic[0].id}">
            <p><input type="text" name="title" placeholder = "SITE NAME" value = "${topic[0].SiteName}"></p>
            <p>
            <textarea name="description" placeholder="URL">${topic[0].SiteUrl}</textarea></p>
            <p>
            <input type="submit" class = "w-btn w-btn-green">
            </p>`,"",login)
            response.writeHead(200);
            response.end(html);
        });
    });
}
exports.update_process = function(request, response){

    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    db.query(`UPDATE topic SET SiteName=?, SiteUrl=?, Date=NOW() WHERE id=?`,[title,description,id],function(error,result){
        response.writeHead(302,{location: `/page/?id=${id}`});
        response.end();
    });

}
exports.delete_process = function(request, response){
           
    var post = request.body
    var id = post.id;
    db.query(`DELETE FROM topic WHERE id=?`,[id],function(error,result){
        response.writeHead(302,{location: `/`});
        response.end();
    });
            
}

exports.register = function(request,response){
        var html = template.reg('register',`
        <form
        action="/register_process" method="post">
        <p><input type="text" name="id" placeholder = "id"></p>
        <p><input type="password" name="password" placeholder = "password"></p>
        <p><input type="text" name="name" placeholder = "name"></p>
        <p>
        <input type="submit" class="w-btn w-btn-green">
        </p>`);
        
        response.writeHead(200);
        response.end(html);   

}

exports.register_process= function(request,response){
    var post = request.body
    db.query(`INSERT INTO users (id,password,name) VALUES (?,?,?)`,[post.id,post.password,post.name],function(error,result){
        response.writeHead(302,{location: `/login`});
        response.end();
    });
}

exports.login = function(request,response){
        var html = template.reg('login',`
        <form
        action="/login_process" method="post">
        <p><input type="text" name="id" placeholder = "id"></p>
        <p><input type="password"  name="password" placeholder = "password"></p>
        <p>
        <input type="submit" class="w-btn w-btn-green">
        </p>`);
        
        response.writeHead(200);
        response.end(html);  
}
exports.login_process = function(request,response){
    var post = request.body
    db.query(`SELECT * FROM users WHERE users.id='${post.id}'`,function(error,result){
        if(result[0] === undefined){
            response.send(`<script>
                      alert('등록되지 않은 정보입니다.');
                      location.href='/login'
            </script>`);
        }
        else if( result[0].password !== post.password){
            response.send(`<script>
                      alert('아이디 또는 비밀번호를 확인하세요.');
                      location.href='/login'
            </script>`);
        }
        else{
            response.writeHead(302,{
                'Set-Cookie':[
                    `user=${post.id}`,
                    `name=${result[0].name}`
                ],
                location: `/`});        
        response.end();
            }
            
        });
    
}
exports.logout_process = function(request,response){
    var post = request.body
    response.writeHead(302, {
        'Set-Cookie':[
        `user=; Max-Age=0`,
        `name=; Max-Age=0`
        ],
        Location: `/`
    });
    response.end();
}