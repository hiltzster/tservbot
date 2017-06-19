var SparkBot = require("node-sparkbot");
var bot = new SparkBot();
var order = prompt();
//bot.interpreter.prefix = "#"; // Remove comment to overlad default / prefix to identify bot commands

var SparkAPIWrapper = require("node-sparkclient");
if (!process.env.SPARK_TOKEN) {
    console.log("Could not start as this bot requires a Cisco Spark API access token.");
    console.log("Please add env variable SPARK_TOKEN on the command line");
    console.log("Example: ");
    console.log("> SPARK_TOKEN=XXXXXXXXXXXX DEBUG=sparkbot* node helloworld.js");
    process.exit(1);
}
var spark = new SparkAPIWrapper(process.env.SPARK_TOKEN);


//
// Help and fallback commands
//
bot.onCommand("help", function (command) {
    spark.createMessage(command.message.roomId, "Hi, I am the T\-Serv bot !\n\nType /hello to see me in action.", { "markdown":true }, function(err, message) {
        if (err) {
            console.log("WARNING: could not post message to room: " + command.message.roomId);
            return;
        }
    });
});
bot.onCommand("fallback", function (command) {
    spark.createMessage(command.message.roomId, "Sorry, I did not understand.\n\nTry /help.", { "markdown":true }, function(err, response) {
        if (err) {
            console.log("WARNING: could not post Fallback message to room: " + command.message.roomId);
            return;
        }
    });
});


//
// Bots commands here
//
bot.onCommand("hello", function (command) {
    var email = command.message.personEmail; // Spark User that created the message orginally 
    spark.createMessage(command.message.roomId, "Greetings <@personEmail:" + email + ">", { "markdown":true }, function(err, message) {
        if (err) {
            console.log("WARNING: could not post Hello message to room: " + command.message.roomId);
            return;
        }
    });
});

bot.onCommand("loser", function (command) {
    var email = command.message.personEmail; // Spark User that created the message orginally 
    spark.createMessage(command.message.roomId, "No\, you\'re a loser <@personEmail:" + email + ">", { "markdown":true }, function(err, message) {
        if (err) {
            console.log("WARNING: could not post Loser message to room: " + command.message.roomId);
            return;
        }
    });
});

bot.onCommand("test", function (command) {
    var email = command.message.personEmail; // Spark User that created the message orginally 
    spark.createMessage(command.message.roomId, "test <@personEmail:" + email + ">", { "markdown":true }, function(err, message) {
        if (err) {
            console.log("WARNING: could not post Loser message to room: " + command.message.roomId);
            return;
        }
    });
});

//
// Welcome message 
// sent as the bot is added to a Room
//
bot.onEvent("memberships", "created", function (trigger) {
    var newMembership = trigger.data; // see specs here: https://developer.ciscospark.com/endpoint-memberships-get.html
    if (newMembership.personId != bot.interpreter.person.id) {
        // ignoring
        console.log("new membership fired, but it is not us being added to a room. Ignoring...");
        return;
    }

    // so happy to join
    console.log("bot's just added to room: " + trigger.data.roomId);
    
    spark.createMessage(trigger.data.roomId, "Hi, I am the TservBot bot !\n\nType /hello to see me in action.", { "markdown":true }, function(err, message) {
        if (err) {
            console.log("WARNING: could not post Hello message to room: " + trigger.data.roomId);
            return;
        }

        if (message.roomType == "group") {
            spark.createMessage(trigger.data.roomId, "**Note that this is a 'Group' room. I will wake up only when mentionned.**", { "markdown":true }, function(err, message) {
                if (err) {
                    console.log("WARNING: could not post Mention message to room: " + trigger.data.roomId);
                    return;
                }
            });
        }      
    }); 
});

