$.get('/wordpress/api/auth_ass', null,function(response) {
    if(!response.result) {
        location.href = '/login';
    }
});
