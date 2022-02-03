heroku container:login

docker container stop mafia-front
docker container rm mafia-front
docker build -t mafia-front .

heroku container:push web --app mafia-front

heroku container:release web --app mafia-front