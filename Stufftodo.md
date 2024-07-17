What is the use of user.controller ? Apparantly it get all users

Sleep tracker not sending data to database, set up API

save goal of session input in localStorage.

--- get rating of a session. If not given, what to do then ? a popup to ask for
it, mandatory ? entering goal is not mandatory

R A N K I N G S in rankings, when timer ends, remove session/user.

profile & shop first (new comps)

--so from online users,

STEPS -get online users -request their data from the api -group them based on
countries. (I can do this in sql, right ?) use timezone of any user in there.
-for each country in array, get colours api -get colours & store them (add them
to country array)

I make array of countries containing user & timezone & then from api, I get
their colour. --so on signIn, I check if country exists, if it does, dont ask
for colour, otherwise ask & let them know.

S P R I N T S [] check Live through db instead of socket io <------

- grab latest (of the room) and check if endedAt exist, if does, return true.
  else return false.

- ID not required since it will just end the last session (of the room) []
  profile picture not working on some devices/browsers. Retrieve .jpg/.png from
  link [] fix timer showing even if new live. [] add changing colour and country
  api and functionality [] fix table styles on user page [] fix sep window timer
  and full functionality [] build profile icon (user, points, and no of
  promises, of 2 colours) [] shop page where to buy promises [] fix socket
  issue, new user not shown, only on refresh resumes only when on the Timer tab

[] add createdAt & EndedAt in user sessions table

Q U E S ''' do I add list of in sesh timers, like a table during sessions ?

F I X E S: [] fix timer so that it runs on remaining time rn it

Removed tokens & protected route, sending userId where required.

Sep Window

S C O R I N G A L G O

[] For every 500 points, 1 dollar. [] For a 60 min 10/10, give around 11 points.
[] For a 90 min 10/10, give around 14 points ---> duration weight 1.2 ---->
rating weight 1.5

60x + 10y = 11 , 90x + 10y = 14

~STOPWATCH

(why does timer start running along it ?)

-check isRunnign & isPaused. (persist timer. call & set from stopwatch.jsx) ~

---------T I M E R---------- when reset, then isPaused time should not be
considered. //if isPaused time, set to

COUNTDOWN

timeLeft. setTimeLeft when timeLeft paused --- condition on isCountDownActive

persist.

// C O D E BREAKS IF A BAD LINK GIVEN

//LOGIN & SIGNUP

AuthForm will be on same page but different component, making it easier. Google
login will hide.

SignUP -- name, pass, country, color will show --

=---------------------------------------- NOT STOPPING UNTIL I AM DONE WITH YOU.

---
