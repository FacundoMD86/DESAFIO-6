import dotenv from 'dotenv';
import express from 'express';
import { engine } from 'express-handlebars';
import { connect } from 'mongoose';
import __dirname from './utils.js'
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import indexRouter from './router/index.js';
import { Server} from "socket.io";
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import MongoStore from 'connect-mongo';
import morgan from 'morgan';
import inicializedPassport from './middlewares/passport.js';
import passport from 'passport';

//SERVIDOR
dotenv.config();
const app = express();
const PORT = 8080
const ready = () => {
    console.log('server ready on port '+PORT)
    connect('mongodb+srv://facundomd:11223344@fmd.cqejc72.mongodb.net/fmd')
        .then(()=>console.log('connected to database'))
        .catch(error=>console.log(error))
    //NOTA:
    //BORRAR DE LA URL LOS PICOS Y LA PALABRA PASSWORD Y REEMPLAZARLA POR LA PASS QUE ELIJA
    //EL LINK DE CONEXION COPIADO ES DEL CLUSTER!! SI O SI HAY QUE AGREGAR AL FINAL EL NOMBRE DE LA BASE DE DATOS
    //NO OLVIDA EL NOMBRE DE LA BASE DE DATOS A LA CUAL ME QUIERO CONECTAR LUEGO DE .net/    
}
const server = app.listen(PORT,ready)
const io = new Server(server)

app.get('/', async (req,res)=>{
    res.render('home', {
        title: "Backend 52250"
    })
})

const message = []

io.on('connection', socket => {
    console.log(`User ${socket.id} connected`)
    //Nombre del usuario
    let userName = ''
    //Mensaje de conexion
    socket.on('userConnection', (data) => {
        userName = data.user
        message.push({
            id: socket.id,
            info:'connection',
            name: data.user,
            message: `${data.user} conectado`,
            date: new Date().toTimeString(),
        })
        io.sockets.emit('userConnection', message)
    })
    //Mensaje enviado
    socket.on('userMessage', (data) => {
        message.push({
            id: socket.id,
            info: 'message',
            name: userName,
            message: data.message,
            date: new Date().toTimeString(),
        })
        io.sockets.emit('userMessage', message)
    })
    //Mensage Usuario escribiendo
    socket.on("typing", (data) => {
        socket.broadcast.emit("typing", data)
  });
})

//Static
app.use(express.static((`${__dirname}/public`)))

// Handlebars
app.engine('handlebars',engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

//Middlewares
app.use(cookieParser(process.env.SECRET_COOKIE))
app.use(expressSession({
    store:MongoStore.create({           //backup por si se cae el servidor
        mongoUrl: process.env.LINK_DB,
        ttl:60*60*24*7
    }),
    secret: process.env.SECRET_SESSION,
    resave: true,
    saveUninitialized: true,
  }))

inicializedPassport()
app.use(passport.initialize())  
app.use(passport.session())  
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

//router
app.use('/api',indexRouter)
app.use(errorHandler)
app.use(notFoundHandler)

//Static
app.use(express.static((`${__dirname}/public`)))


