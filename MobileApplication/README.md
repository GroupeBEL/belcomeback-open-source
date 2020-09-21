**Belcomeback Ionic project :**

<div align="center">
<img src="https://i.pinimg.com/originals/0c/67/5a/0c675a8e1061478d2b7b21b330093444.gif" alt="bot" title="bot" width="150" /> 
<p>Hello, I will be your guide today so make sure to read closely</p>
</div>
<br>

First before start cloning the project, we need to take a close look to this project.

This is an ionic 5/Angular project, Ionic is an HTML5 mobile app development framework targeted at building hybrid mobile apps. For more information you can check the link below.
[Link]( https://ionicframework.com/docs/v1/guide/preface.html)



You need also to do these steps so you can be more comfortable later while working and it may let you avoid many troubles.


**I-Configuring your computer.**

So, if you are going to test on the Android/iOS platforms, you need to do these steps:

1-	Install JDK + add JAVA_HOME to your path (Environment variables).

2-	Install Node Js (LTS version recommended).

3-	Install Android SDK or Install Android studio (recommended: included SDK Manager and much easier) + add ANDROID_HOME to your path (Environment variables).

4-	Install Xcode (you need to add certificates with appropriate project from Xcode. You have to set these certificates from project Navigators in Build Settings tab).

5-	   Install Ionic CLI via this command npm install -g @ionic/cli.

6-	Install GIT (needed to clone project).

**II-Choice of Ionic and Angular**

In our project we are going to work using Ionic 5 (stable version) and Agular 8 (you can updgrade later to version 10). 


**III-Choosing IDE**

There are a lot of IDEs that you can use to start developing ionic:

1-	Atom (Free)

2-	Visual Studio Code (Free)

3-	WebStorm (intelliJ)

4-	ALM (Free)

5-	Angular IDE by Webclipse

The most popular ones are:  Atom, Visual Studio Code and WebStorm (intelliJ). While developing our projects we choose to use Visual Studio Code.

In the link below you will find more explication about them.
[Link](https://ionicframework.com/docs/developer-resources/editors_and_ides/)

**IV-Starting the project**

1- First clone the project

2- Install all dependencies via this command : npm install

3- There you go, if your computer's configuration is well done you can start the project using : ionic serve or you can deploy to your phone


**PS**

- The azure authentication(app.module.ts)/firebase configuration(env.ts)/web service(ws.service.ts) used in this projects may not work , you may configure it yourself and change the authentication.

- Msal is used for pwa projects / Msadal for mobile use.