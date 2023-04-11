# Web-Programming-Final

Goal
Produce a text based game featuring exploration and combat on local host.

Milestone Goal: Have 1-2 levels prepped with the warrior class ready. Database (sqlite) should be ready for some loot generation. Need authentication for inividual users, take things in the direction of having multiple users mixed in. Use text inputs for milestone, do buttons after. Build array to hold map. Use ASCII editor? Read easier through ASCII encoding? Player with highest score leads party, players forced into cooperative party, party leader decides where to go.

Requirements
Final project for Dr. Ohl's Web Programming Class. 
Update requirements once we get exactly what he wants, but for now we know he wants us to use 2 servers and a database. 
Need authentication method, need multiple players (express server?) Need to figure out how multiplayer interaction works. Sync Issues with turn based and outside turn based? Hash user passwords, save user passwords and emails in database.

Ideas
Database table with classes
Combine text based commands ("go", find", "open") with button input. Look to early final fantasy, old mmorpg. turn based.
no art, most is you win or you died.
save states for game
webpage that you jump into the game for username input (no password)

Main theme and design
Bottom in combat has buttons, outside is text. 
Top has xp bar, wealth/score, name, username, stats
Use point values for hp, stamina, possibly shift color value with lower values
Top middle status, chaos level?
Text changes color when entering combat?
Use score to level up? 1 life game, every time fight is won increase reputation
Def use magic. If mage collect books that go to inventory and stat scale. Level is modifier, as player levels up get more skills? %increase/lv or straight level. Capping at level 10? Stats double the base at max. Base + (10 * level). 4 playable characters. Specialization?
Score and level determine foes
Level 9- lost church with holy artifact

Stats
Health
Mana
Strength -> attack
Endurance -> stamina, defense
Dexterity -> ranged physical, dodge chance, assissination
luck -> critical

class perks(choose specializations)
mages -> magic damage multiplier 25%
warriors -> physical damage multiplier 25%
rogue -> dodge changce buff and x crit boost chance

class promtions?

Option for 1hp boss: Insult or kill?

Added consumeables

Servers
1-Entities and event checking and player interaction. 
2-Loot. Also holds inventory. Currently takes 3 types of requests, one for loot, one for enviornment and the other for information. Database will be stored on the client end.
Use MongoDB for database, use number ranges for categories

backstory
enter demon king lands, win back lost honor? Suffered yo mama joke? Anger demon king, king tries to drag you to throne room immediately. God of chaos tries to drag player(s) to throne room, chaos god reduces it to going to next area instead. Anger demon king by destroying altars. If chaos xp bar is filled special enemy arrives. Win and progress. 

Loot
Different ores for weapons


Map
Not using map, generating stuff on the fly.




Equipment tier for equipment
hide id 1-4
leather id 5-8
iron id 9-12
steel id 13-16
dwarven id 17-20
ebony id 21-24
dragon id 25-28
daedric id 29-32
chaotic id 33-36

Equipment tier for weapons
grey
white
green
blue
purple
orange
pearlesent
E-tech
seraph