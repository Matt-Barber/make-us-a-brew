#Make us a brew

Do you ever find yourself arguing about who's turn it is to make the tea? Shouldn't you get the coffees in?
And the famous - "I got them before x, after y, while gallivanting with w". Consider your issues solved.

##Check it out at [make-us-a-brew](matt-barber.github.io/make-us-a-brew)

Make us a brew allows you to

- add drinkers to the roulette wheel
- remove drinkers, who have yet to make
- select a maker at random
- remove the maker from the pot, so the same person doesn't get the short straw
- Allows you to select if the stated maker is able to 'make'


Coming in the next few commits
- sleep a selected maker, so they aren't selected for the next X seconds
- configuration options
- style changes
- settings
- better drinker management

Coming later will be a fully functional ExpressJS backend / API allowing you to
- save lists of drinkers
- import lists of drinkers
- save a session in progress
- restart a session

##Motivation##

At work we're always looking to who is next on the hit list of coffee / tea making, and this is designed to hopefully resolve some of those grievances.

For me it's been an excuse to get my head back into JavaScript and Frameworks like <http://materializecss.com/>, as well as an excuse to medle with the PUG (formally JADE) templating language -
<https://github.com/pugjs/pug> and toy with QUnit - <https://qunitjs.com/>

If for any reason you want to fork this and play around with the jade files - I use this command to compile and move the rendered template into my build folder
``` $ jade -P src/views/makeus_a_brew.jade && mv src/views/makeus_a_brew.html build/index.html ```
