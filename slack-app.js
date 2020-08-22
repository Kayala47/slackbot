addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

let example = "token=gIkuvaNzQIHg97ATvDxqgjtO&team_id=T0001&team_domain=example&enterprise_id=E0001&enterprise_name=Globular%20Construct%20Inc&channel_id=C2147483705&channel_name=test&user_id=U2147483697&user_name=Steve&command=/grabitem&text=94070&response_url=https://hooks.slack.com/commands/1234/5678&trigger_id=13345224609.738474920.8088930838d88f008e0&api_app_id=A123456";




function translateToJson(text){

    var argsList = text.split("&");

    var dict = {};

    console.log(argsList)

    for (i in argsList){

        //we have to split the string, turn it into a dictionary item

        [key, value] = argsList[i].split("=");
        dict[key] = value;
        console.log(key)
        console.log(value)


    }

    return dict;

};

let exampleDict = translateToJson(example);
console.log(exampleDict["command"]);


async function handleRequest(request) {

    text = await request.text()

    // return new Response(text, {status:200})

    message = constructMessage(text)

    return new Response(message, {status: 200})

    // return createResponse(200, message1)



};

function findCommand(argsList){


    for (piece of argsList){

        if (piece.includes("command")){
            return piece.split("=")[1]
        }

    }


    return null
}

function findText(argsList){

    for (piece of argsList){

        if (piece.includes("text")){
            return piece.split("=")[1]
        }

    }
    return null

}

function constructMessage(request){

    // var message = "Hey There!"

    var decoded_req = decodeURIComponent(request);
    var message = decoded_req;

    var dict = translateToJson(decoded_req);

    let command = dict["command"];

    let text = dict["text"];

    switch(command){

        case "/test": 
            message = text;
            break;
        case "/grabitem":
            message = rentItem(dict);
            // message = request;
            break;
        case "/additem":
            message = addItem(dict);
            break;
        case "listitems":
            message += " Here's your list:";
            break;

    }


    return message


}


function createResponse(statusCode, message) {
  let resp = {
    message: message,
    status: statusCode
  }

  return new Response(JSON.stringify(resp), {
    headers: jsonHeaders,
    status: statusCode
  })
}

function rentItem(infoDict){
    //the dictionary contains all the info we'll need to log the item and send the confirmation message
    let response = "ERROR PROCESSING REQUEST";//we'll overwrite this if we are able to rent an item out

    //remember that the "text" replaces spaces with "+"

    let itemNumber = infoDict["text"].split("+");//the first (and only) argument should be the item numeber
    let date = getTodayDate();
    let user = infoDict["user_name"];

    if (true){
        //TODO: check in database to see if this item is available
        response = "Hi " + "<@" + user  + ">" + ", this is to confirm that you've rented item number " + itemNumber + " on " + date;
    }

    
    return response;


}

function addItem(infoDict){

    //the dictionary contains all the info we'll need to log the item and send the confirmation message
    let response = "ERROR PROCESSING REQUEST";//we'll overwrite this if we are able to rent an item out

    //remember that the "text" replaces spaces with "+"

    let [item_number, item_name, item_link] = infoDict["text"].split("+");
    let date = getTodayDate();
    let user = infoDict["user_name"];

    response = "Hi " + "<@" + user  + ">" + ", this is to confirm that you've added a(n) " + item_name + "(#" + item_number + ") to the lab on " + date + ". The link you've provided is: " + item_link; 
    return response;

}

function getTodayDate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    return today;
}


let jsonHeaders = new Headers([["Content-Type", "application/json"]])