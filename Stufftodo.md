What is the use of user.controller ? Apparantly it get all users 

Sleep tracker not sending data to database, set up API 

in rankings, when timer ends, remove session/user. 

save goal of session input in localStorage. 

--- get rating of a session. If not given, what to do then ? a popup to ask for it, mandatory ? entering goal is not mandatory



--so from online users,

STEPS
-get online users
-request their data from the api 
-group them based on countries. (I can do this in sql, right ?) use timezone of any user in there. 
-for each country in array, get colours api
-get colours & store them (add them to country array)


 I make array of countries containing user & timezone & then from api, I get their colour. 
--so on signIn, I check if country exists, if it does, dont ask for colour, otherwise ask & let them know. 


S P R I N T S 
[] check Live through db instead of socket io <------
   - grab latest (of the room) and check if endedAt exist, if does, return true. else return false. 
   
   - ID not required since it will just end the last session (of the room)

[] fix timer showing even if new live. 
[] add changing colour and country api and functionality 
[] fix table styles on user page 
[] fix sep window timer and full functionality 
[] build profile icon (user, points, and no of promises, of 2 colours)
[] shop page where to buy promises 
[] fix socket issue, new user not shown, only on refresh
[] fix timer so that it runs on remaining time (rn it resumes only when on the Timer tab)





F I X E S: 
removed tokens & protected route, sending userId where required.

----make a button for SepTimer and on clicking, setOpen of SepWindow to true. will fix the problem. 

   <p className=" flex flex-row     ">
                  <p className="badge  badge-md badge-primary rounded-[0.2px]">
                    {getCurrentTimeInTimeZone(c.timeZone)}
                  </p>
                  {/* <span className="ml-[auto] badge  rounded-[2px] badge-md ">
                {timeDiff(authUser.offset, c.offset)}
                  </span> */}
                </p>
                <div>
                  {c.users.length > 0
                    ? c?.users?.map((x) => (
                        <li className="flex flex-col gap-[12px] ">
                          <ul className="  flex flex-row px-[10px] py-[15px]">
                            <div className="avatar">
                              <div className="w-8 rounded-full ring ring-primary  ring-offset-base-100 ring-offset-1">
                                <img
                                  src={`${x.picture}`}
                                  //                          className=" w-[38px] h-[38px] rounded-[100px]   "
                                />
                              </div>
                              <p className="prose prose-md self-center ml-[10px] ">
                                {x.name}
                              </p>
                              {/* <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" /> */}
                            </div>
                          </ul>
                         
                        </li>
                      ))
                    : null}
                </div>