I have prepared this document to communicate the outputs of tasks that were not writing code.

# Planning

### Time allocated
I started planning by deciding what time I was going to use. In total I anticipated I would have about 20 hours.

### Task breakdown
I also thought of the different stages I would go through in this process. These were then allocated a percentage of my time to see how much time I should spend on each section:

    * Exploring: 10% - 2hrs
    * Design: 30% - 6hrs
    * Implementing: 50% - 10hrs
    * Preparing submission: 10% - 2hrs

With these guidelines, I was in theory capable of working without worrying I was falling behind. In reality, sometimes I would back and forward between different sections.

# Design

### UX

The user story was vaguely specified in the task specs. I adhered to these. I also thought about different ways the suggestion could be shown. The options were:

#### Option A
![Option A](http://i.imgur.com/0Zs1k8Q.jpg)
This one would have a tab on top of the editor box. It had very little going for it since another tab would cost a click to see it and another click to send it. It would also be very relatively harder to implement if not working closely with Ember.

#### Option B
![Option B](http://i.imgur.com/9baxjlG.jpg)
A hover on top of a TrueAI button next to the reply button would make the text appear in the editor. It would cost a click to accept and then another one to accept. It wasn't ideal since that place is sometimes taken by the 'Reply and Close' button when there's text in the editor.

#### Option C
![Option C](http://i.imgur.com/QXziXtZ.jpg)
A switch that when active would automatically show TrueAI's suggestions, and it could be turned off. This way users could just click reply to immediately send, edit the suggestion or turn off the suggestions. I chose this one.

When switching on it should immediately fetch the suggestion (rather than turning the plugin on and then reloading the page). When turning off the plugin, it should delete the message in the editor only if the message was one suggested.

### UI

The goal was to integrate seamlessly. I pictured the switch button as a robot, and like the rest of the buttons it would darken the color when hovered. When active it would be the same color as the highlights in the page (blue) and it should also show a tooltip on hover.

### Assumptions

During the design I had to make the following assumptions. Normally, in an environment where I can quickly communicate with my team, I would pass it through them to validate.

I assume that the conversations happen only in pages served by the following endpoint:
* `https://app.intercom.io/a/apps/*/inbox/*/conversations/*`

If there's more places where the extension should work, it should be easy to add.

I assume that TrueAI would like to validate their suggestions or even see what an user has responded to a given context.

I assume that Intercom users reply conversations by clicking on the reply button or by pressing `CMD + return`.

I have also designed freely the shapes of the payloads sent and received to and from TrueAI APIs.

I also assume the company name is the team name in the Intercom application. Since nowehere in the page there is a label called company name, I picked the most fitting one.

### Application architecture

The application was small so it wasn't going to be a problem to manage complexity. I still figured I'd like to have different files for specific concerns such as interacting with TrueAI, the page or configurations. I also encapsulated the whole flow in a try and catch so the errors would be logged in the console with very specific messages.

I checked Intercom's documentation for developers, and considered using the API to access the data. However, the API uses OAuth tokens. I tried finding the token somewhere in the page with no success. Making the user log in through the extension was an option I considered but this would not be ideal if there was also a TrueAI login process (double logins). I proceeded to consider working with the served page instead.

I noticed Intercom is a single page application built with Ember.js. I digged a little bit about this framework to see if I could work with it rather than fight with it. I realised this would require more time in order to be able of reverse engineering Ember components. This would be my suggestion for a production application (specifically, for reasons mentioned in **Shortcomings**), but for this prototype I will be working directly with the DOM.

### Production goals

In production I would:
* fully integrate with Ember
* minify and concatenate the scripts
* use ES2015
* enforce style with a linter
* write a test suite

# Bonus

### Extra features

I took the freedom to write code for the following requirements I thought were necessary:

* A cache for the suggestions: this is so the same request is not made twice if the suggestion has already been fetched.
* A reply listener: I figured TrueAI would like to know the result of their suggestion, so the extension listens for sent messages so it can know if their suggestion was approved or not (or modified).

### User authentication

To authenticate every request, we can give the extension a token on login. When they first install the token, we could ask them to authenticate themselves to TrueAI services. This shouldn't be hard.

# Shortcomings

I had to let go of the tooltip and the switch color darkening on hover. The tooltip was easy to implement by copying the class names of other elements in the page but it was hard to access it programatically so it could be deleted. When I implemented the tooltip, switching a button on and off would leave the tooltip in the page, frozen even when moving the cursor out of the button, and I couldn't find a way to remove it.

As for darkening on hover, this is because styling the SVG can only be done inline. Meaning that I could only listen the hover from the SVG itself. This was achieved but it would mean that the SVG would have to listen for clicks, but since the SVG was on an `object` element, this wasn't clickable. I had to make the SVG with pointer events none so the div beneath could access the click and trigger the switch.

I believe these two features could be sorted by working with Ember or by using a hack that would take me a long time to discover.
