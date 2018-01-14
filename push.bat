call git add .
TIMEOUT 1
call git commit -m 'asdf'
TIMEOUT 1
call git push heroku master
TIMEOUT 1
call git push origin master