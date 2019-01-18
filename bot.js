
var auth = require('./auth.json');

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


const reglas =  "Reglas del Gremio\n"
                + "================================\n"
                + "1/ Buen rollito, este gremio se creó como un sitio donde crecer con ayuda de quien más puede y donde ayudar a quien menos.\n\n"
                + "2/ Tickets diarios: El objetivo es que todos los miembros del gremio aporten 600 tickets al día."
                + "Los tickets son básicos para poder hacer raids y conseguir (todos) más equipo más rápidamente"
                + "Normalmente, para llegar a estos 600 tickets diarios hace falta gastar cristales (50 mínimo) en refrescos.";
                + "Aunque parezca que no, compensa gastarlos todos los días. Para más info sobre como conseguir los 600 diarios di !600\n"
                + "   La idea es mantener cierta 'flexibilidad' con el tema tickets diarios. "
                + "Flexibilidad = no pasa nada si durante 1 semana haces 400 en vez de 600 por cualquier razón, esto es un juego. "
                + "En cambio, si llevas un mes haciendo 200 tickets diarios estás perjudicando al gremio, no le das tickets pero tu "

const energyCost = {
    "cantina":[8, 8, 10, 10, 12, 12, 16, 16],
    "batalla":[6, 8, 10, 12, 14, 16, 18, 20, 20]
};

const refreshCost = {
    "cantina":[100, 100, 200, 200, 14, 16, 18, 20, 20],
    "batalla":[75, 75, 10, 12, 14, 16, 18, 20, 20]
};

const battleEnergy = 240 + 135;
const cantinaEnergy = 120 + 45;

client.on('message', (msg) => {
    // Our bot needs to know if it needs to execute a command
    // for this script it will listen for messages that will start with `!`    
    let message = msg.content;
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);

        switch(cmd) {
            // !ping
            case 'ping':
                msg.reply("pong");
                break;
            // !reglas
            case 'reglas':
                msg.reply(reglas);
                break;
            case 'frag':
                msg.reply(fragmentos(args));
                break;
            default:
            msg.reply("Ein?");
        }
    }
})

fragmentos = (args) => {
    let cantina;
    let response = "";
    
    if (args[0] && ("cantina" === args[0] || "batalla" === args[0]))
        cantina = args[0];
    else
        return "Necesito saber si es en cantina o batallas y qué nivel (ej: !frag cantina 7, !frag batalla 3,...)"
    if (!args[1])
        return "Necesito saber si es en cantina o batallas y qué nivel (ej: !frag cantina 7, !frag batalla 3,...)"

    
    if (energyCost[cantina][args[1] -1]){
        let cost = energyCost[cantina][args[1] -1];
        response = "Valores para " + args[0] + ", nivel " + args[1] + "\n" 
            + "Coste por intento: " + cost + "\n";
        if ("cantina" === cantina){
            response += cantinaFrags(cost);
        }else{
            response += battleFrags(cost);
        }   
    }else{
        response = "Ese nivel no existe"
    }
    
    return response;
}

battleFrags = (cost) => {
    let response = "";
    let tries = Math.min(Math.floor(battleEnergy/cost), 8);

    response += "0 Cristales: " + tries + " intentos, " 
        + (tries * cost) + " energía (sobran " + (battleEnergy - (tries * cost)) + ") --> "
        + Math.floor(tries/3) + "-" + Math.ceil(tries/3) 
        + " (" + (tries/3).toFixed(2) + ") fragmentos / día\n";
    
    // Refresh de intentos, no de energía (50)
    tries = Math.min(Math.floor(battleEnergy/cost), 16);
    response += "50 Cristales (refresh de nodo): " + tries + " intentos, " 
        + (tries * cost) + " energía (sobran " + (battleEnergy - (tries * cost)) + ") --> "
        + Math.floor(tries/3) + "-" + Math.ceil(tries/3) 
        + " (" + (tries/3).toFixed(2) + ") fragmentos / día\n";

    // Segundo Refresh de intentos, no de energía (100)
    tries = Math.min(Math.floor(battleEnergy/cost), 24);
    response += "150 Cristales (2 refresh de nodo): " + tries + " intentos, " 
        + (tries * cost) + " energía (sobran " + (battleEnergy - (tries * cost)) + ") --> "
        + Math.floor(tries/3) + "-" + Math.ceil(tries/3) 
        + " (" + (tries/3).toFixed(2) + ") fragmentos / día\n";

    // Refresh de intentos + energía (50 + 50)
    tries = Math.min(Math.floor((battleEnergy + 120)/cost), 16);
    response += "100 Cristales (refresh de nodo + energía): " + tries + " intentos, " 
        + (tries * cost) + " energía (sobran " + (battleEnergy +120 - (tries * cost)) + ") --> "
        + Math.floor(tries/3) + "-" + Math.ceil(tries/3) 
        + " (" + (tries/3).toFixed(2) + ") fragmentos / día\n";

    // Segundo Refresh de intentos, no de energía (100)
    tries = Math.min(Math.floor((battleEnergy+240)/cost), 24);
    response += "250 Cristales (2 refresh de nodo + 1 energía): " + tries + " intentos, " 
        + (tries * cost) + " energía (sobran " + (battleEnergy + 240 - (tries * cost)) + ") --> "
        + Math.floor(tries/3) + "-" + Math.ceil(tries/3) 
        + " (" + (tries/3).toFixed(2) + ") fragmentos / día\n";
        
    return response;
}


cantinaFrags = (cost) => {
    let response = "";

    let tries = Math.floor(cantinaEnergy/cost);
    response += "0 Cristales: " + tries + " intentos, " 
        + (tries * cost) + " energía (sobran " + (cantinaEnergy - (tries * cost)) + ") --> "
        + Math.floor(tries/3) + "-" + Math.ceil(tries/3) 
        + " (" + (tries/3).toFixed(2) + ") fragmentos / día\n";

    tries = Math.floor((cantinaEnergy+120)/cost);
    response += "100 Cristales: " + tries + " intentos, " 
        + (tries * cost) + " energía (sobran " + (cantinaEnergy +120 - (tries * cost)) + ") --> "
        + Math.floor(tries/3) + "-" + Math.ceil(tries/3) 
        + " (" + (tries/3).toFixed(2) + ") fragmentos / día\n";

    tries = Math.floor((cantinaEnergy+240)/cost);
    response += "200 Cristales: " + tries + " intentos, " 
        + (tries * cost) + " energía (sobran " + (cantinaEnergy + 240- (tries * cost)) + ") --> "
        + Math.floor(tries/3) + "-" + Math.ceil(tries/3) 
        + " (" + (tries/3).toFixed(2) + ") fragmentos / día\n";

    tries = Math.floor((cantinaEnergy+360)/cost);
    response += "400 Cristales: " + tries + " intentos, " 
        + (tries * cost) + " energía (sobran " + (cantinaEnergy + 360 - (tries * cost)) + ") --> "
        + Math.floor(tries/3) + "-" + Math.ceil(tries/3) 
        + " (" + (tries/3).toFixed(2) + ") fragmentos / día\n";
    
    return response;
};


// let msg = "!frag batalla 7";
// console.log(fragmentos(msg.split(' ').splice(1)));
// msg = "!frag batalla 1";
// console.log(fragmentos(msg.split(' ').splice(1)));
//  msg = "!frag cantina 7";
// console.log(fragmentos(msg.split(' ').splice(1)));
//  msg = "!frag batalla 12";
// console.log(fragmentos(msg.split(' ').splice(1)));
//  msg = "!frag bla 7";
// console.log(fragmentos(msg.split(' ').splice(1)));
//  msg = "!frag bis 7";
// console.log(fragmentos(msg.split(' ').splice(1)));
client.login(auth.token);